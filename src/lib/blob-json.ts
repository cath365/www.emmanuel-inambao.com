import 'server-only'
import { get, put, BlobPreconditionFailedError } from '@vercel/blob'

// Store-connection tokens win over BLOB_READ_WRITE_TOKEN so a stale manually-pasted token
// can't shadow them. Production's public store is currently connected with the "BLOD" prefix.
export function publicBlobToken() {
  return process.env.PUBLIC_BLOB_READ_WRITE_TOKEN?.trim()
    || process.env.BLOD_READ_WRITE_TOKEN?.trim()
    || process.env.BLOB_READ_WRITE_TOKEN?.trim()
    || undefined
}

export function storageToken(access: 'public' | 'private') {
  const token = access === 'private' ? process.env.PRIVATE_BLOB_READ_WRITE_TOKEN?.trim() : publicBlobToken()
  if (!token) {
    const key = access === 'private' ? 'PRIVATE_BLOB_READ_WRITE_TOKEN' : 'PUBLIC_BLOB_READ_WRITE_TOKEN'
    throw new Error(`Set ${key} from the ${access} Blob store in Vercel Production, then redeploy.`)
  }
  return token
}

export function storageError(access: 'public' | 'private') {
  const key = access === 'private' ? 'PRIVATE_BLOB_READ_WRITE_TOKEN' : 'PUBLIC_BLOB_READ_WRITE_TOKEN'
  return `${access === 'public' ? 'Portfolio publishing' : 'Private submission storage'} is unavailable. Check that ${key} belongs to the ${access} Blob store, reconnect it to Production, then redeploy.`
}

// Read-write tokens look like vercel_blob_rw_<storeId>_<secret>; public blobs are served from
// https://<storeId>.public.blob.vercel-storage.com/<pathname>.
function publicStoreId() {
  const fromToken = publicBlobToken()?.split('_')[3]
  const id = (fromToken || process.env.PUBLIC_BLOB_STORE_ID || process.env.BLOD_STORE_ID || '')
    .trim().replace(/^store_/, '').toLowerCase()
  if (!id) throw new Error(storageError('public'))
  return id
}

// Reads the blob by its fixed URL instead of list(): list() is a billed "advanced operation"
// (2,000/month on Hobby) and calling it on every read suspended the store. Callers should go
// through the cached readers in portfolio-server.ts rather than calling this per request.
export async function readPublicJson<T>(path: string): Promise<T | null> {
  const url = new URL(`https://${publicStoreId()}.public.blob.vercel-storage.com/${path}`)
  // Bypasses the CDN copy so a read right after a save sees the new data.
  url.searchParams.set('v', String(Date.now()))
  const response = await fetch(url, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(10000) })
  if (response.status === 404) return null
  if (!response.ok) throw new Error(`${storageError('public')} (HTTP ${response.status})`)
  return response.json()
}

async function privateSnapshot<T>(path: string, fallback: T) {
  const result = await get(path, { access: 'private', token: storageToken('private'), useCache: false })
  if (!result) return { data: fallback, etag: undefined }
  if (result.statusCode !== 200) throw new Error('Unexpected storage response')
  return { data: await new Response(result.stream).json() as T, etag: result.blob.etag }
}

export async function readPrivateJson<T>(path: string, fallback: T): Promise<T> {
  return (await privateSnapshot(path, fallback)).data
}

// Failed reads must never become empty collections. Conditional writes also keep
// simultaneous visitors from overwriting each other's inquiries/subscriptions.
export async function updatePrivateJson<T>(path: string, fallback: T, update: (data: T) => T): Promise<T> {
  for (let attempt = 0; attempt < 4; attempt++) {
    const previous = await privateSnapshot(path, fallback)
    const next = update(previous.data)
    try {
      await put(path, JSON.stringify(next), {
        access: 'private', token: storageToken('private'), contentType: 'application/json',
        addRandomSuffix: false, allowOverwrite: Boolean(previous.etag), ifMatch: previous.etag,
      })
      return next
    } catch (error) {
      const conflict = error instanceof BlobPreconditionFailedError ||
        (error instanceof Error && /already exists/i.test(error.message))
      if (!conflict || attempt === 3) throw error
    }
  }
  throw new Error('Storage is busy. Please try again.')
}
