import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth-helpers'
import { type Project } from '@/lib/project-catalog'
import type { CaseStudy } from '@/lib/case-studies'
import { createGroqCompletion } from '@/lib/groq'

export const runtime = 'nodejs'
export const maxDuration = 60

function sentences(value?: string) {
  if (!value) return []
  return value
    .split(/(?<=[.!?])\s+/)
    .map(item => item.trim().replace(/[.!?]+$/, ''))
    .filter(Boolean)
}

function unique(items: string[]) {
  return Array.from(new Set(items.map(item => item.trim()).filter(Boolean)))
}

function localDraft(project: Project): CaseStudy {
  const challenge = unique([
    ...sentences(project.problemSolved),
    ...(project.constraints || []),
  ])
  const solution = unique([
    ...sentences(project.solutionSummary || project.systemLogic),
    ...sentences(project.systemLogic),
    ...(project.highlights || []),
  ])

  return {
    slug: project.id,
    title: project.title,
    subtitle: project.problemTagline || project.purpose,
    overview: [project.problemSolved, project.targetUsers, project.solutionSummary || project.purpose, project.outcome].filter(Boolean).join(' '),
    status: project.status || 'Portfolio Project',
    timeline: 'Timeline not documented in the portfolio',
    role: project.role || 'Engineering role documented in project record',
    projectType: project.projectType,
    organization: project.organization,
    contribution: project.contribution,
    context: [project.targetUsers ? `Target users: ${project.targetUsers}` : '', project.whyItMatters || ''].filter(Boolean).join(' '),
    requirements: [],
    planning: project.nextMilestone ? [`Next milestone: ${project.nextMilestone}`] : [],
    testing: [],
    outcome: project.outcome,
    futureImprovements: project.nextMilestone ? [project.nextMilestone] : [],
    challenge: challenge.length ? challenge.slice(0, 6) : ['Engineering challenge documented in the project record.'],
    solution: solution.slice(0, 6),
    results: [
      {
        value: project.status || 'Documented',
        label: 'Current status',
        description: project.outcome || 'Current project status is documented in the project record.',
      },
      ...(project.measuredImpact ? [{
        value: 'Measured',
        label: 'Verified impact',
        description: project.measuredImpact,
      }] : []),
    ].slice(0, 4),
    technologies: project.techStack || [],
    architecture: project.architecture?.length
      ? project.architecture
      : unique([...(project.techStack || []).slice(0, 6)]),
    links: [
      project.liveUrl ? { label: 'Live demo', href: project.liveUrl } : null,
      project.websiteUrl ? { label: 'Website', href: project.websiteUrl } : null,
      project.githubUrl ? { label: 'Source code', href: project.githubUrl } : null,
      project.docsUrl ? { label: 'Documentation', href: project.docsUrl } : null,
    ].filter((item): item is { label: string; href: string } => Boolean(item)),
  }
}

function parseJsonObject(text: string) {
  const cleaned = text
    .trim()
    .replace(/^\`\`\`(?:json)?/i, '')
    .replace(/\`\`\`$/, '')
    .trim()
  return JSON.parse(cleaned)
}

function normalizeStudy(input: any, project: Project, fallback: CaseStudy): CaseStudy {
  const safeString = (value: unknown, backup: string) =>
    typeof value === 'string' && value.trim() ? value.trim() : backup
  const safeStrings = (value: unknown, backup: string[]) =>
    Array.isArray(value)
      ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0).slice(0, 8)
      : backup

  const results = Array.isArray(input?.results)
    ? input.results
        .filter((item: any) => item && typeof item === 'object')
        .map((item: any) => ({
          value: safeString(item.value, 'Documented'),
          label: safeString(item.label, 'Outcome'),
          description: safeString(item.description, project.outcome || 'Documented project outcome.'),
        }))
        .slice(0, 4)
    : fallback.results

  return {
    slug: project.id,
    title: safeString(input?.title, fallback.title),
    subtitle: safeString(input?.subtitle, fallback.subtitle),
    overview: safeString(input?.overview, fallback.overview),
    status: safeString(input?.status, fallback.status),
    timeline: safeString(input?.timeline, fallback.timeline),
    role: safeString(input?.role, fallback.role),
    projectType: safeString(input?.projectType, fallback.projectType || ''),
    organization: safeString(input?.organization, fallback.organization || ''),
    contribution: safeString(input?.contribution, fallback.contribution || ''),
    context: safeString(input?.context, fallback.context || ''),
    requirements: safeStrings(input?.requirements, fallback.requirements || []),
    planning: safeStrings(input?.planning, fallback.planning || []),
    testing: safeStrings(input?.testing, fallback.testing || []),
    outcome: safeString(input?.outcome, fallback.outcome || project.outcome || ''),
    futureImprovements: safeStrings(input?.futureImprovements, fallback.futureImprovements || []),
    challenge: safeStrings(input?.challenge, fallback.challenge),
    solution: safeStrings(input?.solution, fallback.solution),
    results: results.length ? results : fallback.results,
    technologies: safeStrings(input?.technologies, fallback.technologies),
    architecture: safeStrings(input?.architecture, fallback.architecture),
    links: fallback.links,
  }
}

async function generateWithGroq(project: Project, fallback: CaseStudy) {
  const groq = await createGroqCompletion({
    model: process.env.GROQ_CASE_STUDY_MODEL || process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
    messages: [
      {
        role: 'system',
        content: `You write evidence-based engineering case studies for Emmanuel Inambao's portfolio.

Use ONLY the supplied project record. Do not invent clients, dates, metrics, certifications, results, deployment status, commercial impact or technical details. If something is not documented, say "Not documented" or keep the wording generic. Distinguish prototype, active development and production accurately.

Return ONLY a valid JSON object with these keys:
title, subtitle, overview, status, timeline, role, projectType, organization, contribution, context, requirements, planning, challenge, solution, testing, outcome, futureImprovements, results, technologies, architecture.

Use projectType, organization and contribution from the project record when present. Do not upgrade "contributed to" into "led" or "built".
Use problemTagline, targetUsers, whyItMatters, solutionSummary, roleAreas, constraints, nextMilestone and evidence when they are present in the project record. They are grounding fields, not permission to invent missing details.
requirements, planning, challenge, solution, testing and futureImprovements are arrays of short strings. Only populate them when they can be directly supported by the supplied project record; otherwise return an empty array.
results is an array of up to 4 objects with value, label, description. Treat measuredImpact as achieved only when that exact field contains evidence. expectedImpact is future/potential impact and MUST NOT be rewritten as an achieved result or numerical claim.
Evidence items prove only what their labels/descriptions/links support. A prototype photo does not prove deployment, adoption, accuracy, safety or commercial impact.
technologies and architecture are arrays of strings.
Do not turn a concept, R&D project or prototype into a production claim. Do not infer confidential client identities.
Write clear professional English suitable for an international engineering portfolio.`,
      },
      {
        role: 'user',
        content: JSON.stringify(project),
      },
    ],
    maxCompletionTokens: 4096,
    temperature: 0.2,
    reasoningEffort: 'low',
    responseFormat: { type: 'json_object' },
    timeoutMs: 45_000,
  })

  if (!groq.ok) {
    if (groq.reason !== 'not_configured') {
      console.error('Groq case-study generation error:', groq.status, groq.detail)
    }
    return null
  }

  try {
    return normalizeStudy(parseJsonObject(groq.text), project, fallback)
  } catch (error) {
    console.error('Groq case-study JSON parse error:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const projectId = typeof body?.projectId === 'string' ? body.projectId.trim() : ''
    const incomingProject = body?.project

    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required.' }, { status: 400 })
    }

    if (
      !incomingProject ||
      typeof incomingProject !== 'object' ||
      typeof incomingProject.id !== 'string' ||
      incomingProject.id !== projectId ||
      typeof incomingProject.title !== 'string' ||
      !Array.isArray(incomingProject.techStack)
    ) {
      return NextResponse.json(
        { error: 'The selected project data was not supplied correctly.' },
        { status: 400 }
      )
    }

    const project = incomingProject as Project

    const fallback = localDraft(project)
    let generated: CaseStudy | null = null

    try {
      generated = await generateWithGroq(project, fallback)
    } catch (error) {
      console.error('Case study AI generation failed:', error)
    }

    return NextResponse.json({
      caseStudy: generated || fallback,
      source: generated ? 'groq' : 'local',
      ...(!generated ? { warning: 'Groq could not return a complete draft. This draft was built locally from your project record. Check the Groq key, model and quota if AI generation keeps failing.' } : {}),
    })
  } catch (error) {
    console.error('Case study generation route error:', error)
    return NextResponse.json({ error: 'Unable to generate case study.' }, { status: 500 })
  }
}
