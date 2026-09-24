'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ExternalLink, RefreshCw, Save, Sparkles, Trash2 } from 'lucide-react'
import { useProjects } from '@/lib/projects'
import type { CaseStudy } from '@/lib/case-studies'

function linesToArray(value: string) {
  return value.split('\n').map(item => item.trim()).filter(Boolean)
}

function resultsToText(results: CaseStudy['results']) {
  return results.map(item => [item.value, item.label, item.description].join(' | ')).join('\n')
}

function textToResults(value: string): CaseStudy['results'] {
  return linesToArray(value).map(line => {
    const [metric = 'Documented', label = 'Outcome', ...rest] = line.split('|').map(item => item.trim())
    return {
      value: metric || 'Documented',
      label: label || 'Outcome',
      description: rest.join(' | ') || 'Documented project outcome.',
    }
  }).slice(0, 4)
}

export default function CaseStudyManager() {
  const { projects } = useProjects()
  const [savedStudies, setSavedStudies] = useState<CaseStudy[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [draft, setDraft] = useState<CaseStudy | null>(null)
  const [challengeText, setChallengeText] = useState('')
  const [solutionText, setSolutionText] = useState('')
  const [architectureText, setArchitectureText] = useState('')
  const [technologyText, setTechnologyText] = useState('')
  const [resultsText, setResultsText] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [generationSource, setGenerationSource] = useState<'groq' | 'local' | ''>('')
  const [groqStatus, setGroqStatus] = useState<'checking' | 'connected' | 'missing'>('checking')

  const selectedProject = useMemo(
    () => projects.find(project => project.id === selectedProjectId),
    [projects, selectedProjectId]
  )

  const loadSaved = async () => {
    try {
      const response = await fetch('/api/portfolio-data?key=caseStudies', { cache: 'no-store' })
      const payload = await response.json()
      setSavedStudies(Array.isArray(payload) ? payload : [])
    } catch {
      setSavedStudies([])
    }
  }

  useEffect(() => {
    loadSaved()

    fetch('/api/ai/status', { cache: 'no-store' })
      .then(response => response.json())
      .then(payload => setGroqStatus(payload?.configured ? 'connected' : 'missing'))
      .catch(() => setGroqStatus('missing'))
  }, [])

  const setEditor = (study: CaseStudy) => {
    setDraft(study)
    setChallengeText(study.challenge.join('\n'))
    setSolutionText(study.solution.join('\n'))
    setArchitectureText(study.architecture.join('\n'))
    setTechnologyText(study.technologies.join('\n'))
    setResultsText(resultsToText(study.results))
  }

  const generate = async () => {
    if (!selectedProjectId) {
      setMessage('Choose a project first.')
      return
    }

    setBusy(true)
    setMessage('Generating case study from the current project record…')
    try {
      const response = await fetch('/api/ai/case-study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: selectedProjectId }),
      })
      const payload = await response.json()

      if (!response.ok || !payload?.caseStudy) {
        setMessage(payload?.error || 'Could not generate the case study.')
        return
      }

      setGenerationSource(payload.source === 'groq' ? 'groq' : 'local')
      setEditor(payload.caseStudy)
      setMessage(
        payload.source === 'groq'
          ? 'Groq AI draft generated from the saved project data. Review it before publishing.'
          : 'Draft generated from the saved project data. The AI provider was unavailable, so the evidence-based local generator was used.'
      )
    } catch {
      setMessage('Could not generate the case study.')
    } finally {
      setBusy(false)
    }
  }

  const buildEditedStudy = (): CaseStudy | null => {
    if (!draft) return null
    return {
      ...draft,
      challenge: linesToArray(challengeText),
      solution: linesToArray(solutionText),
      architecture: linesToArray(architectureText),
      technologies: linesToArray(technologyText),
      results: textToResults(resultsText),
    }
  }

  const publish = async () => {
    const study = buildEditedStudy()
    if (!study) return

    setBusy(true)
    setMessage('Publishing case study…')
    try {
      const next = [...savedStudies.filter(item => item.slug !== study.slug), study]
      const response = await fetch('/api/portfolio-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        cache: 'no-store',
        body: JSON.stringify({ key: 'caseStudies', data: next }),
      })

      const payload = await response.json().catch(() => null)
      if (!response.ok || payload?.success !== true) {
        setMessage(payload?.error || 'The case study could not be saved.')
        return
      }

      setSavedStudies(next)
      setDraft(study)
      setMessage('Case study published. It is now available on the public case-study pages.')
    } catch {
      setMessage('The case study could not be saved.')
    } finally {
      setBusy(false)
    }
  }

  const removeStudy = async (slug: string) => {
    setBusy(true)
    setMessage('Removing generated case study…')
    try {
      const next = savedStudies.filter(item => item.slug !== slug)
      const response = await fetch('/api/portfolio-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        cache: 'no-store',
        body: JSON.stringify({ key: 'caseStudies', data: next }),
      })

      const payload = await response.json().catch(() => null)
      if (!response.ok || payload?.success !== true) {
        setMessage(payload?.error || 'Could not remove the case study.')
        return
      }

      setSavedStudies(next)
      if (draft?.slug === slug) setDraft(null)
      setMessage('Generated case study removed.')
    } catch {
      setMessage('Could not remove the case study.')
    } finally {
      setBusy(false)
    }
  }

  const updateDraft = (field: keyof CaseStudy, value: string) => {
    if (!draft) return
    setDraft({ ...draft, [field]: value })
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-primary-400" />
          <h1 className="text-2xl font-bold text-white">AI Case Studies</h1>
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-dark-400">
          Generate evidence-based case studies from the same project records used by the public portfolio and AI assistant.
          Generated text is never published until you review and save it.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-dark-700 bg-dark-900/60 px-3 py-2 text-xs">
          <span
            className={`h-2 w-2 rounded-full ${
              groqStatus === 'connected'
                ? 'bg-green-400'
                : groqStatus === 'missing'
                  ? 'bg-amber-400'
                  : 'bg-dark-500'
            }`}
          />
          <span className="text-dark-300">
            {groqStatus === 'connected'
              ? 'Groq AI connected'
              : groqStatus === 'missing'
                ? 'Groq API key not detected — local evidence-based fallback is active'
                : 'Checking Groq AI configuration…'}
          </span>
        </div>
      </div>

      <section className="rounded-xl border border-dark-700 bg-dark-800/40 p-5">
        <label className="mb-2 block text-sm font-medium text-dark-300">Project source</label>
        <div className="flex flex-col gap-3 md:flex-row">
          <select
            value={selectedProjectId}
            onChange={event => setSelectedProjectId(event.target.value)}
            className="min-h-11 flex-1 rounded-lg border border-dark-700 bg-dark-900 px-3 text-sm text-white outline-none focus:border-primary-500"
          >
            <option value="">Choose a saved project…</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.title}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={generate}
            disabled={busy || !selectedProjectId}
            className="btn-primary gap-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Generate Case Study
          </button>
        </div>
        {selectedProject && (
          <p className="mt-3 text-xs text-dark-500">
            Source: {selectedProject.title} · {selectedProject.status || 'status not specified'} · {selectedProject.techStack.length} technologies
          </p>
        )}
        {message && <p className="mt-4 rounded-lg border border-dark-700 bg-dark-900/60 px-4 py-3 text-sm text-dark-300">{message}</p>}
      </section>

      {draft && (
        <section className="rounded-xl border border-dark-700 bg-dark-800/40 p-5 sm:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">Review generated draft</h2>
              <p className="mt-1 text-xs text-dark-500">
                Generator: {generationSource === 'groq' ? 'Groq grounded generation' : generationSource === 'local' ? 'Local evidence-based fallback' : 'saved draft'}
              </p>
            </div>
            <button type="button" onClick={publish} disabled={busy} className="btn-primary gap-2">
              <Save className="h-4 w-4" /> Publish Case Study
            </button>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {([
              ['title', 'Title'],
              ['subtitle', 'Subtitle'],
              ['status', 'Status'],
              ['timeline', 'Timeline'],
              ['role', 'Role'],
            ] as const).map(([field, label]) => (
              <label key={field} className="block">
                <span className="mb-2 block text-sm font-medium text-dark-300">{label}</span>
                <input
                  value={String(draft[field] || '')}
                  onChange={event => updateDraft(field, event.target.value)}
                  className="w-full rounded-lg border border-dark-700 bg-dark-900 px-3 py-2.5 text-sm text-white outline-none focus:border-primary-500"
                />
              </label>
            ))}
          </div>

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-medium text-dark-300">Overview</span>
            <textarea
              value={draft.overview}
              onChange={event => updateDraft('overview', event.target.value)}
              rows={5}
              className="w-full rounded-lg border border-dark-700 bg-dark-900 px-3 py-2.5 text-sm leading-6 text-white outline-none focus:border-primary-500"
            />
          </label>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <label>
              <span className="mb-2 block text-sm font-medium text-dark-300">Engineering challenges · one per line</span>
              <textarea value={challengeText} onChange={event => setChallengeText(event.target.value)} rows={8} className="w-full rounded-lg border border-dark-700 bg-dark-900 px-3 py-2.5 text-sm text-white outline-none focus:border-primary-500" />
            </label>
            <label>
              <span className="mb-2 block text-sm font-medium text-dark-300">Solution · one per line</span>
              <textarea value={solutionText} onChange={event => setSolutionText(event.target.value)} rows={8} className="w-full rounded-lg border border-dark-700 bg-dark-900 px-3 py-2.5 text-sm text-white outline-none focus:border-primary-500" />
            </label>
            <label>
              <span className="mb-2 block text-sm font-medium text-dark-300">Architecture · one stage per line</span>
              <textarea value={architectureText} onChange={event => setArchitectureText(event.target.value)} rows={7} className="w-full rounded-lg border border-dark-700 bg-dark-900 px-3 py-2.5 text-sm text-white outline-none focus:border-primary-500" />
            </label>
            <label>
              <span className="mb-2 block text-sm font-medium text-dark-300">Technologies · one per line</span>
              <textarea value={technologyText} onChange={event => setTechnologyText(event.target.value)} rows={7} className="w-full rounded-lg border border-dark-700 bg-dark-900 px-3 py-2.5 text-sm text-white outline-none focus:border-primary-500" />
            </label>
          </div>

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-medium text-dark-300">Results · value | label | description</span>
            <textarea value={resultsText} onChange={event => setResultsText(event.target.value)} rows={6} className="w-full rounded-lg border border-dark-700 bg-dark-900 px-3 py-2.5 font-mono text-xs leading-6 text-white outline-none focus:border-primary-500" />
          </label>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">Published generated studies</h2>
        {savedStudies.length === 0 ? (
          <div className="rounded-xl border border-dashed border-dark-700 p-8 text-center text-sm text-dark-500">
            No generated case studies have been published yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {savedStudies.map(study => (
              <div key={study.slug} className="flex flex-col gap-4 rounded-xl border border-dark-700 bg-dark-800/40 p-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-white">{study.title}</p>
                  <p className="mt-1 text-sm text-dark-400">{study.status}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => { setGenerationSource(''); setEditor(study) }} className="btn-secondary px-3 py-2 text-sm">
                    Edit
                  </button>
                  <Link href={'/case-studies/' + study.slug} target="_blank" className="btn-secondary px-3 py-2 text-sm">
                    <ExternalLink className="h-4 w-4" /> View
                  </Link>
                  <button type="button" onClick={() => removeStudy(study.slug)} disabled={busy} className="inline-flex items-center gap-2 rounded-lg border border-red-800/60 px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-950/30">
                    <Trash2 className="h-4 w-4" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
