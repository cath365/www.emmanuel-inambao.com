'use client'

import { useEffect, useState } from 'react'
import { Plus, Save, Trash2 } from 'lucide-react'
import {
  type InstitutionalProgram,
  useInstitutionalPrograms,
} from '@/lib/institutional-programs'

function toLines(items: string[]) {
  return items.join('\n')
}

function fromLines(value: string) {
  return value
    .split('\n')
    .map(item => item.trim())
    .filter(Boolean)
}

function blankProgram(): InstitutionalProgram {
  return {
    id: 'program-' + Date.now(),
    institution: '',
    shortName: '',
    website: '',
    programme: '',
    myRole: '',
    description: '',
    technologies: [],
    learningObjectives: [],
    status: 'Details to confirm',
    image: '',
  }
}

export default function InstitutionalProgramsEditor({
  onNotify,
}: {
  onNotify?: (type: 'success' | 'error', message: string) => void
}) {
  const { programs, savePrograms } = useInstitutionalPrograms()
  const [drafts, setDrafts] = useState<InstitutionalProgram[]>(programs)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setDrafts(programs)
  }, [programs])

  const update = (id: string, patch: Partial<InstitutionalProgram>) => {
    setDrafts(current => current.map(item => (item.id === id ? { ...item, ...patch } : item)))
  }

  const remove = (id: string) => {
    setDrafts(current => current.filter(item => item.id !== id))
  }

  const save = async () => {
    setSaving(true)
    try {
      await savePrograms(drafts)
      onNotify?.('success', 'Institutional programmes published successfully.')
    } catch (error) {
      onNotify?.(
        'error',
        error instanceof Error ? error.message : 'Institutional programmes could not be saved.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">STEM & Institutional Programs</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-dark-400">
            Manage institutional programme context without implying ownership, formal partnership establishment
            or responsibilities that have not been confirmed.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDrafts(current => [...current, blankProgram()])}
          className="btn-secondary shrink-0"
        >
          <Plus className="h-4 w-4" /> Add programme
        </button>
      </div>

      <div className="space-y-5">
        {drafts.map(program => (
          <article key={program.id} className="rounded-xl border border-dark-700 bg-dark-900/45 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-white">{program.institution || 'New institution'}</p>
                <p className="mt-1 text-xs text-dark-500">{program.status || 'Status to confirm'}</p>
              </div>
              <button
                type="button"
                onClick={() => remove(program.id)}
                className="rounded-lg border border-red-800/50 p-2 text-red-300 hover:bg-red-950/25"
                aria-label={'Remove ' + (program.institution || 'programme')}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-dark-300">
                Institution
                <input
                  value={program.institution}
                  onChange={event => update(program.id, { institution: event.target.value })}
                  className="mt-2 w-full rounded-lg border border-dark-700 bg-dark-950 px-3 py-2.5 text-white outline-none focus:border-primary-500"
                />
              </label>
              <label className="text-sm text-dark-300">
                Short name
                <input
                  value={program.shortName || ''}
                  onChange={event => update(program.id, { shortName: event.target.value })}
                  className="mt-2 w-full rounded-lg border border-dark-700 bg-dark-950 px-3 py-2.5 text-white outline-none focus:border-primary-500"
                />
              </label>
              <label className="text-sm text-dark-300 md:col-span-2">
                Official website
                <input
                  type="url"
                  value={program.website || ''}
                  onChange={event => update(program.id, { website: event.target.value })}
                  className="mt-2 w-full rounded-lg border border-dark-700 bg-dark-950 px-3 py-2.5 text-white outline-none focus:border-primary-500"
                  placeholder="https://..."
                />
              </label>
              <label className="text-sm text-dark-300">
                Programme / activity
                <input
                  value={program.programme}
                  onChange={event => update(program.id, { programme: event.target.value })}
                  className="mt-2 w-full rounded-lg border border-dark-700 bg-dark-950 px-3 py-2.5 text-white outline-none focus:border-primary-500"
                />
              </label>
              <label className="text-sm text-dark-300">
                My role
                <input
                  value={program.myRole}
                  onChange={event => update(program.id, { myRole: event.target.value })}
                  className="mt-2 w-full rounded-lg border border-dark-700 bg-dark-950 px-3 py-2.5 text-white outline-none focus:border-primary-500"
                />
              </label>
              <label className="text-sm text-dark-300 md:col-span-2">
                Description
                <textarea
                  rows={4}
                  value={program.description}
                  onChange={event => update(program.id, { description: event.target.value })}
                  className="mt-2 w-full resize-none rounded-lg border border-dark-700 bg-dark-950 px-3 py-2.5 text-white outline-none focus:border-primary-500"
                />
              </label>
              <label className="text-sm text-dark-300">
                Technologies · one per line
                <textarea
                  rows={5}
                  value={toLines(program.technologies)}
                  onChange={event => update(program.id, { technologies: fromLines(event.target.value) })}
                  className="mt-2 w-full resize-none rounded-lg border border-dark-700 bg-dark-950 px-3 py-2.5 text-white outline-none focus:border-primary-500"
                />
              </label>
              <label className="text-sm text-dark-300">
                Learning objectives · one per line
                <textarea
                  rows={5}
                  value={toLines(program.learningObjectives)}
                  onChange={event => update(program.id, { learningObjectives: fromLines(event.target.value) })}
                  className="mt-2 w-full resize-none rounded-lg border border-dark-700 bg-dark-950 px-3 py-2.5 text-white outline-none focus:border-primary-500"
                />
              </label>
              <label className="text-sm text-dark-300 md:col-span-2">
                Status / evidence note
                <input
                  value={program.status}
                  onChange={event => update(program.id, { status: event.target.value })}
                  className="mt-2 w-full rounded-lg border border-dark-700 bg-dark-950 px-3 py-2.5 text-white outline-none focus:border-primary-500"
                  placeholder="Programme context verified · details to confirm"
                />
              </label>
            </div>
          </article>
        ))}
      </div>

      <div className="flex justify-end">
        <button type="button" onClick={save} disabled={saving} className="btn-primary">
          <Save className="h-4 w-4" />
          {saving ? 'Publishing…' : 'Publish institutional programmes'}
        </button>
      </div>
    </div>
  )
}
