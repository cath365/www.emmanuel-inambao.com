import 'server-only'
import { unstable_cache } from 'next/cache'
import { list } from '@vercel/blob'
import { publicBlobToken } from '@/lib/blob-json'

// Saved admin content is rendered into the HTML so crawlers and link previews see it,
// not just the built-in defaults. /api/portfolio-data revalidates this tag on every save.
export const PORTFOLIO_CACHE_TAG = 'portfolio-data'

const SERVER_RENDERED_KEYS = ['profile', 'projects', 'experiences', 'services', 'skills', 'certifications', 'gallery'] as const

export type InitialPortfolio = Partial<Record<(typeof SERVER_RENDERED_KEYS)[number], unknown>>

async function readSection(key: string): Promise<unknown> {
  const token = publicBlobToken()
  if (!token) return undefined
  const path = `data/portfolio/${key}.json`
  const { blobs } = await list({ prefix: path, token })
  const blob = blobs.find(item => item.pathname === path)
  if (!blob) return null

  // The query string bypasses the Blob CDN copy so a fresh save is read after revalidation.
  // A non-zero revalidate (instead of no-store) keeps pages statically cacheable.
  const url = new URL(blob.url)
  url.searchParams.set('v', String(Date.now()))
  const response = await fetch(url, { next: { revalidate: 300 }, signal: AbortSignal.timeout(8000) })
  if (!response.ok) throw new Error(`Blob read failed with status ${response.status}`)
  return response.json()
}

// undefined = could not read (providers keep their client-side behaviour);
// null = nothing saved yet (providers use their defaults).
export const getInitialPortfolio = unstable_cache(
  async (): Promise<InitialPortfolio> => {
    const entries = await Promise.all(
      SERVER_RENDERED_KEYS.map(async key => {
        try {
          return [key, await readSection(key)] as const
        } catch (error) {
          console.error(`Server portfolio read failed for ${key}:`, error)
          return [key, undefined] as const
        }
      })
    )
    return Object.fromEntries(entries.filter(([, value]) => value !== undefined))
  },
  ['initial-portfolio'],
  { tags: [PORTFOLIO_CACHE_TAG], revalidate: 300 }
)
