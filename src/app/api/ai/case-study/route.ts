import { NextRequest, NextResponse } from 'next/server'
import { list } from '@vercel/blob'
import { isAuthenticated } from '@/lib/auth-helpers'
import { defaultProjects, mergeWithCurrentCatalog } from '@/lib/project-catalog'
import type { CaseStudy } from '@/lib/case-studies'
import { saveGeneratedCaseStudy } from '@/lib/case-study-store'
import { groqChat } from '@/lib/groq-server'

export const runtime = 'nodejs'

async function readProjects() {
  try {
    const { blobs } = await list({ prefix: 'data/portfolio/projects.json' })
    if (blobs.length === 0) return defaultProjects

    const response = await fetch(blobs[0].url, {
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
      cache: 'no-store',
    })
    if (!response.ok) return defaultProjects

    const data = await response.json()
    return Array.isArray(data) && data.length > 0 ? mergeWithCurrentCatalog(data) : defaultProjects
  } catch {
    return defaultProjects
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.map(item => String(item).trim()).filter(Boolean).slice(0, 10)
    : []
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: 'Groq is not configured. Add GROQ_API_KEY in Vercel.' },
      { status: 503 },
    )
  }

  try {
    const body = await request.json()
    const projectId = typeof body?.projectId === 'string' ? body.projectId : ''

    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 })
    }

    const projects = await readProjects()
    const snapshot =
      body?.project && typeof body.project === 'object' && body.project.id === projectId
        ? body.project
        : null
    const project = projects.find(item => item.id === projectId) || snapshot

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const projectEvidence = {
      id: project.id,
      title: project.title,
      purpose: project.purpose,
      role: project.role,
      status: project.status,
      techStack: project.techStack,
      problemSolved: project.problemSolved,
      systemLogic: project.systemLogic,
      outcome: project.outcome,
      architecture: project.architecture,
      highlights: project.highlights,
      liveUrl: project.liveUrl,
      websiteUrl: project.websiteUrl,
      githubUrl: project.githubUrl,
      docsUrl: project.docsUrl,
      appStoreUrl: project.appStoreUrl,
      playStoreUrl: project.playStoreUrl,
    }

    const raw = await groqChat(
      [
        {
          role: 'system',
          content: `You are an engineering case-study writer for Emmanuel Inambao's portfolio.
Return ONLY valid JSON.

Use only facts present in PROJECT EVIDENCE. Never invent clients, measurements, deployment status, timelines, revenue, user counts, certifications, performance results or technical components.

If a detail is unknown, write a neutral factual statement rather than making one up.
The case study must read like a professional engineering brief, not marketing hype.

Required JSON shape:
{
  "title": "string",
  "subtitle": "string",
  "overview": "string",
  "status": "string",
  "timeline": "string",
  "role": "string",
  "challenge": ["string"],
  "solution": ["string"],
  "results": [
    {"value":"string","label":"string","description":"string"}
  ],
  "technologies": ["string"],
  "architecture": ["string"]
}

Rules:
- 3-6 challenge items.
- 3-6 solution items.
- 3-4 results. Results must be qualitative unless the source contains a real number.
- technologies must come from the project's recorded tech stack.
- architecture must come from recorded architecture/system logic/highlights; do not invent hardware.
- Keep the overview under 140 words.`,
        },
        {
          role: 'user',
          content: `PROJECT EVIDENCE\n${JSON.stringify(projectEvidence)}`,
        },
      ],
      { json: true, maxTokens: 1500, temperature: 0.25 },
    )

    const generated = JSON.parse(raw)

    const links = [
      project.liveUrl ? { label: 'Live demo', href: project.liveUrl } : null,
      project.websiteUrl ? { label: 'Website', href: project.websiteUrl } : null,
      project.githubUrl ? { label: 'Source code', href: project.githubUrl } : null,
      project.docsUrl ? { label: 'Documentation', href: project.docsUrl } : null,
    ].filter(Boolean) as { label: string; href: string }[]

    const study: CaseStudy = {
      slug: slugify(project.title || project.id),
      title: String(generated.title || project.title),
      subtitle: String(generated.subtitle || project.purpose || ''),
      overview: String(generated.overview || project.purpose || ''),
      status: String(generated.status || project.status || 'Project'),
      timeline: String(generated.timeline || 'Project timeline documented in portfolio records'),
      role: String(generated.role || project.role || 'Engineering role'),
      challenge: stringArray(generated.challenge),
      solution: stringArray(generated.solution),
      results: Array.isArray(generated.results)
        ? generated.results.slice(0, 4).map((item: any) => ({
            value: String(item?.value || 'Documented'),
            label: String(item?.label || 'Outcome'),
            description: String(item?.description || ''),
          }))
        : [],
      technologies: Array.isArray(project.techStack)
        ? project.techStack.map(item => String(item)).filter(Boolean)
        : [],
      architecture: stringArray(generated.architecture),
      ...(links.length > 0 ? { links } : {}),
    }

    if (!study.challenge.length || !study.solution.length || !study.architecture.length) {
      return NextResponse.json({ error: 'AI output was incomplete. Please try again.' }, { status: 502 })
    }

    await saveGeneratedCaseStudy(study)
    return NextResponse.json({ success: true, study })
  } catch (error) {
    console.error('Case study generation error:', error)
    return NextResponse.json({ error: 'Unable to generate case study right now.' }, { status: 500 })
  }
}
