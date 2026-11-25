import 'server-only'
import { unstable_cache } from 'next/cache'
import { readPublicJson } from '@/lib/blob-json'

// Saved admin content is read once and cached on the server until the next save
// (/api/portfolio-data revalidates this tag), so visitors never cost a storage operation.
export const PORTFOLIO_CACHE_TAG = 'portfolio-data'

// Every reader of public portfolio JSON (pages, API, AI assistants) goes through this.
// A failed read throws and is not cached; "nothing saved yet" is cached as null.
export const getPortfolioSection = unstable_cache(
  async (key: string): Promise<unknown> => readPublicJson<unknown>(`data/portfolio/${key}.json`),
  ['portfolio-section'],
  { tags: [PORTFOLIO_CACHE_TAG], revalidate: 86400 }
)

const SERVER_RENDERED_KEYS = ['profile', 'projects', 'experiences', 'services', 'skills', 'certifications', 'gallery'] as const

export type InitialPortfolio = Partial<Record<(typeof SERVER_RENDERED_KEYS)[number], unknown>>

// undefined = could not read (providers keep their client-side behaviour);
// null = nothing saved yet (providers use their defaults).
export async function getInitialPortfolio(): Promise<InitialPortfolio> {
  const entries = await Promise.all(
    SERVER_RENDERED_KEYS.map(async key => {
      try {
        return [key, await getPortfolioSection(key)] as const
      } catch (error) {
        console.error(`Server portfolio read failed for ${key}:`, error)
        return [key, undefined] as const
      }
    })
  )
  return Object.fromEntries(entries.filter(([, value]) => value !== undefined))
}
