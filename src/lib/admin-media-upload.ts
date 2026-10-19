'use client'

import { upload } from '@vercel/blob/client'
import { fetchMediaLibrary, type MediaAsset } from '@/lib/media-library'
import { persistPortfolioData } from '@/lib/portfolio-persistence'
import { ensurePublicImageUploadReady, safePublicImageName } from '@/lib/public-image-upload'

/** Upload a public image directly to the public store, then register it for reuse. */
export async function uploadAdminImage(file: File): Promise<string> {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
  if (!allowed.includes(file.type)) throw new Error('Choose a JPG, PNG, WebP, GIF or AVIF image.')
  if (file.size === 0 || file.size > 10 * 1024 * 1024) throw new Error('Image must be between 1 byte and 10MB.')

  await ensurePublicImageUploadReady()
  const safe = safePublicImageName(file.name)
  let result: Awaited<ReturnType<typeof upload>>
  try {
    result = await upload(`portfolio/images/${crypto.randomUUID()}-${safe}`, file, {
      access: 'public', handleUploadUrl: '/api/upload/blob',
    })
  } catch (error) {
    if (error instanceof Error && /failed to retrieve the client token/i.test(error.message)) {
      throw new Error('Image token request failed after storage verification. Refresh the dashboard, sign in again and retry. If it persists, check /api/upload/blob in the Vercel runtime logs.')
    }
    throw error
  }

  // Publishing the library index is separate from attaching the URL to a page.
  // Read immediately before publishing; never reuse a stale editor snapshot.
  const existing = await fetchMediaLibrary()
  const asset: MediaAsset = {
    id: crypto.randomUUID(), name: file.name, url: result.url, kind: 'image',
    mimeType: file.type, size: file.size,
    alt: file.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' '),
    createdAt: new Date().toISOString(),
  }
  await persistPortfolioData('mediaLibrary', [asset, ...existing])
  return result.url
}
