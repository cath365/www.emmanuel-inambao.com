import 'server-only'

import { getPortfolioSection } from '@/lib/portfolio-server'
import { caseStudies as staticCaseStudies, type CaseStudy } from '@/lib/case-studies'

async function readDynamicCaseStudies(): Promise<CaseStudy[]> {
  try {
    const payload = await getPortfolioSection('caseStudies')
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
    if (!study?.slug) continue
    const staticStudy = merged.get(study.slug)
    merged.set(study.slug, staticStudy ? { ...staticStudy, ...study } : study)
  }

  return Array.from(merged.values())
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  const studies = await getAllCaseStudies()
  return studies.find(study => study.slug === slug) || null
}
