import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth-helpers'
import { type Project } from '@/lib/project-catalog'
import type { CaseStudy } from '@/lib/case-studies'
import { createGroqCompletion } from '@/lib/groq'

export const runtime = 'nodejs'

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
  const challenge = sentences(project.problemSolved)
  const solution = sentences(project.systemLogic)
  const highlights = project.highlights || []

  return {
    slug: project.id,
    title: project.title,
    subtitle: project.purpose,
    overview: [project.problemSolved, project.systemLogic, project.outcome].filter(Boolean).join(' '),
    status: project.status || 'Portfolio Project',
    timeline: 'Timeline not documented in the portfolio',
    role: project.role || 'Engineering role documented in project record',
    challenge: challenge.length ? challenge.slice(0, 5) : ['Engineering challenge documented in the project record.'],
    solution: unique([...solution, ...highlights]).slice(0, 6),
    results: [
      {
        value: project.status || 'Documented',
        label: 'Project status',
        description: project.outcome || 'Outcome is documented in the project record.',
      },
      ...highlights.slice(0, 3).map((highlight, index) => ({
        value: 'Verified',
        label: `Project highlight ${index + 1}`,
        description: highlight,
      })),
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
title, subtitle, overview, status, timeline, role, challenge, solution, results, technologies, architecture.

challenge and solution are arrays of short strings.
results is an array of up to 4 objects with value, label, description. Values must be descriptive when no verified metric exists; never fabricate numbers.
technologies and architecture are arrays of strings.
Write clear professional English suitable for an international engineering portfolio.`,
      },
      {
        role: 'user',
        content: JSON.stringify(project),
      },
    ],
    maxCompletionTokens: 1800,
    temperature: 0.2,
    reasoningEffort: 'medium',
    responseFormat: { type: 'json_object' },
    timeoutMs: 25_000,
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
    })
  } catch (error) {
    console.error('Case study generation route error:', error)
    return NextResponse.json({ error: 'Unable to generate case study.' }, { status: 500 })
  }
}
