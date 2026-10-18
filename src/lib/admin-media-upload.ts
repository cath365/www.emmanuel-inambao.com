'use client'

import { upload } from '@vercel/blob/client'
import { fetchMediaLibrary, type MediaAsset } from '@/lib/media-library'
import { persistPortfolioData } from '@/lib/portfolio-persistence'

/** Upload a public image directly to the public store, then register it for reuse. */
export async function uploadAdminImage(file: File): Promise<string> {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
  if (!allowed.includes(file.type)) throw new Error('Choose a JPG, PNG, WebP, GIF or AVIF image.')
  if (file.size === 0 || file.size > 10 * 1024 * 1024) throw new Error('Image must be between 1 byte and 10MB.')

  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(-100)
  const result = await upload(`portfolio/images/${crypto.randomUUID()}-${safe}`, file, {
    access: 'public', handleUploadUrl: '/api/upload/blob',
  })

  // Publishing the library index is separate from attaching the URL to a page.
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
