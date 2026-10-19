/** Public media references. Never put enquiries, contact details, or private files here. */
export interface MediaAsset {
  id: string
  name: string
  url: string
  kind: 'image' | 'video' | 'audio' | 'document'
  mimeType: string
  size: number
  alt: string
  createdAt: string
}

export function validMediaAssets(value: unknown): MediaAsset[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is MediaAsset =>
    item !== null && typeof item === 'object' &&
    typeof item.id === 'string' && typeof item.name === 'string' &&
    typeof item.url === 'string' && /^https:\/\//.test(item.url) &&
    ['image', 'video', 'audio', 'document'].includes(item.kind) &&
    typeof item.size === 'number' && typeof item.createdAt === 'string'
  )
}

export async function fetchMediaLibrary(): Promise<MediaAsset[]> {
  const response = await fetch('/api/portfolio-data?key=mediaLibrary', { credentials: 'include', cache: 'no-store' })
  const payload = await response.json().catch(() => null)
  if (!response.ok) throw new Error(payload?.error || 'Could not load the media library.')
  return validMediaAssets(payload)
}
