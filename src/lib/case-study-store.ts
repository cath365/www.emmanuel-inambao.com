import 'server-only'

import { list, put } from '@vercel/blob'
import { caseStudies as builtInCaseStudies, type CaseStudy } from '@/lib/case-studies'

const CASE_STUDY_PATH = 'data/portfolio/caseStudies.json'

async function readGeneratedCaseStudies(): Promise<CaseStudy[]> {
  try {
    const { blobs } = await list({ prefix: CASE_STUDY_PATH })
    if (blobs.length === 0) return []

    const response = await fetch(blobs[0].url, {
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
      cache: 'no-store',
    })
    if (!response.ok) return []

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  const generated = await readGeneratedCaseStudies()
  const bySlug = new Map<string, CaseStudy>()

  for (const study of builtInCaseStudies) bySlug.set(study.slug, study)
  for (const study of generated) {
    if (study?.slug) bySlug.set(study.slug, study)
  }

  return Array.from(bySlug.values())
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | undefined> {
  const studies = await getAllCaseStudies()
  return studies.find(study => study.slug === slug)
}

export async function saveGeneratedCaseStudy(study: CaseStudy) {
  const current = await readGeneratedCaseStudies()
  const next = [...current.filter(item => item.slug !== study.slug), study]

  await put(CASE_STUDY_PATH, JSON.stringify(next), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
  })

  return study
}
