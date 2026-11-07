'use client'

import type { CaseStudy } from '@/lib/case-studies'
import type { Project } from '@/lib/project-catalog'

// Adds or replaces one study in the published caseStudies list. Reads the current list first
// so a failed read never overwrites existing studies with an empty array.
export async function publishCaseStudy(study: CaseStudy): Promise<CaseStudy[]> {
  const currentResponse = await fetch('/api/portfolio-data?key=caseStudies', { cache: 'no-store' })
  const current = await currentResponse.json()
  if (!currentResponse.ok) throw new Error(current?.error || 'Unable to read published studies.')

  const next = [...(Array.isArray(current) ? current : []).filter((item: CaseStudy) => item.slug !== study.slug), study]
  const response = await fetch('/api/portfolio-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    cache: 'no-store',
    body: JSON.stringify({ key: 'caseStudies', data: next }),
  })
  const payload = await response.json().catch(() => null)
  if (!response.ok || payload?.success !== true) throw new Error(payload?.error || 'The case study could not be saved.')
  return next
}

export async function generateCaseStudy(project: Project): Promise<{ caseStudy: CaseStudy; source: 'groq' | 'local'; warning?: string }> {
  const response = await fetch('/api/ai/case-study', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    cache: 'no-store',
    body: JSON.stringify({ projectId: project.id, project }),
  })
  const payload = await response.json().catch(() => null)
  if (!response.ok || !payload?.caseStudy) throw new Error(payload?.error || 'Could not generate the case study.')
  return { caseStudy: payload.caseStudy, source: payload.source === 'groq' ? 'groq' : 'local', warning: payload.warning }
}

// Runs when a new project is created: writes the case study and publishes it without review.
export async function autoPublishCaseStudy(project: Project) {
  const { caseStudy, source } = await generateCaseStudy(project)
  await publishCaseStudy(caseStudy)
  return { slug: caseStudy.slug, source }
}
