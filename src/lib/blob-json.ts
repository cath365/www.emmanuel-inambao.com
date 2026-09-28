import 'server-only'
import { get, list, put, BlobPreconditionFailedError } from '@vercel/blob'

export function storageToken(access: 'public' | 'private') {
  const key = access === 'private' ? 'PRIVATE_BLOB_READ_WRITE_TOKEN' : 'BLOB_READ_WRITE_TOKEN'
  const token = process.env[key]?.trim()
  if (!token) throw new Error(`Set ${key} from the ${access} Blob store in Vercel Production, then redeploy.`)
  return token
}

export function storageError(access: 'public' | 'private') {
  const key = access === 'private' ? 'PRIVATE_BLOB_READ_WRITE_TOKEN' : 'BLOB_READ_WRITE_TOKEN'
  return `${access === 'public' ? 'Portfolio publishing' : 'Private submission storage'} is unavailable. Check that ${key} belongs to the ${access} Blob store, reconnect it to Production, then redeploy.`
}

export async function readPublicJson<T>(path: string): Promise<T | null> {
  const { blobs } = await list({ prefix: path, token: storageToken('public') })
  const blob = blobs.find(item => item.pathname === path)
  if (!blob) return null
  const url = new URL(blob.url)
  url.searchParams.set('v', String(Date.now()))
  const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(10000) })
  if (!response.ok) throw new Error(storageError('public'))
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
