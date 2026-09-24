import 'server-only'

import { list } from '@vercel/blob'
import { caseStudies as staticCaseStudies, type CaseStudy } from '@/lib/case-studies'

const DYNAMIC_CASE_STUDIES_PATH = 'data/portfolio/caseStudies.json'

async function readDynamicCaseStudies(): Promise<CaseStudy[]> {
  try {
    const { blobs } = await list({
      prefix: DYNAMIC_CASE_STUDIES_PATH,
    })

    if (blobs.length === 0) return []

    const url = new URL(blobs[0].url)
    url.searchParams.set('v', String(Date.now()))

    // Public portfolio JSON is read directly from the connected public Blob store.
    const response = await fetch(url, {
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error('Unable to read published case studies:', response.status)
      return []
    }

    const payload = await response.json()
    return Array.isArray(payload) ? payload : []
  } catch (error) {
    console.error('Unable to load dynamic case studies:', error)
    return []
  }
}

export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  const dynamicStudies = await readDynamicCaseStudies()
  const merged = new Map<string, CaseStudy>()

  for (const study of staticCaseStudies) merged.set(study.slug, study)
  for (const study of dynamicStudies) {
    if (study?.slug) merged.set(study.slug, study)
  }

  return Array.from(merged.values())
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  const studies = await getAllCaseStudies()
  return studies.find(study => study.slug === slug) || null
}
