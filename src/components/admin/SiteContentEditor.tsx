'use client'

import { useEffect, useState } from 'react'
import { Plus, Save, Trash2, RotateCcw, ExternalLink } from 'lucide-react'
import { defaultSiteContent, type SiteContent, useSiteContent } from '@/lib/site-content'
import MediaLibraryPicker from './MediaLibraryPicker'

const textField = 'w-full rounded-lg border border-dark-700 bg-dark-950 px-3 py-2 text-sm text-white focus:border-primary-500 focus:outline-none'

export default function SiteContentEditor({ onNotify }: { onNotify: (type: 'success' | 'error', message: string) => void }) {
  const { content, saveContent, isLoading } = useSiteContent()
  const [draft, setDraft] = useState<SiteContent>(content)
  const [section, setSection] = useState<keyof SiteContent>('about')
  const [busy, setBusy] = useState(false)
  useEffect(() => { setDraft(content) }, [content])
  const edit = (key: string, value: string) => setDraft(previous => ({ ...previous, [section]: { ...previous[section], [key]: value } }))
  const field = (label: string, key: 'eyebrow' | 'heading' | 'intro') => <label className="block space-y-1 text-sm text-dark-300">{label}
    {key === 'intro' ? <textarea rows={3} value={draft[section][key]} onChange={e => edit(key, e.target.value)} className={textField} />
      : <input value={draft[section][key]} onChange={e => edit(key, e.target.value)} className={textField} />}
  </label>
  const save = async () => {
    setBusy(true)
    try { await saveContent(draft); onNotify('success', 'Website text saved and published.') }
    catch (err) { onNotify('error', err instanceof Error ? err.message : 'Save failed.') }
    finally { setBusy(false) }
  }
  const patchArray = (key: 'pillars' | 'steps' | 'questions' | 'paragraphs' | 'horizons', value: unknown[]) => setDraft(previous => ({ ...previous, [section]: { ...previous[section], [key]: value } }))
  const cards = section === 'about' ? draft.about.pillars : section === 'vision' ? draft.vision.horizons : draft.process.steps
  const cardKey = section === 'about' ? 'pillars' : section === 'vision' ? 'horizons' : 'steps'
  return <div className="space-y-6">
    <div><h1 className="text-2xl font-bold text-white">Website Content Editor</h1>
      <p className="mt-1 text-sm text-dark-400">Edit homepage About, working process, 10-year direction and FAQs. For profile, hero images, project cards, services, gallery and other sections, use their dedicated admin tabs.</p>
    </div>
    <div className="flex flex-wrap gap-2">{(['about', 'process', 'vision', 'faq'] as const).map(key => <button type="button" key={key} onClick={() => setSection(key)} className={`rounded-lg px-4 py-2 text-sm capitalize ${section === key ? 'bg-primary-600 text-white' : 'bg-dark-800 text-dark-300'}`}>{key === 'process' ? 'How I Work' : key === 'vision' ? '10-Year Direction' : key === 'faq' ? 'FAQ' : 'About'}</button>)}</div>
    {isLoading ? <p className="text-dark-300">Loading published content…</p> : <div className="space-y-5 rounded-xl border border-dark-700 bg-dark-900/50 p-4 sm:p-6">
      {field('Small section label', 'eyebrow')}
      {field('Section heading', 'heading')}
      {field('Intro / subtitle', 'intro')}
      {section === 'about' && <div className="space-y-3"><h3 className="font-semibold text-white">About paragraphs</h3>
        {draft.about.paragraphs.map((paragraph, i) => <div className="flex gap-2" key={i}><textarea rows={3} value={paragraph} className={textField} onChange={e => patchArray('paragraphs', draft.about.paragraphs.map((v, index) => i === index ? e.target.value : v))} /><button type="button" aria-label="Remove paragraph" onClick={() => patchArray('paragraphs', draft.about.paragraphs.filter((_, index) => index !== i))} className="p-2 text-red-300"><Trash2 /></button></div>)}
        <button type="button" onClick={() => patchArray('paragraphs', [...draft.about.paragraphs, ''])} className="btn-secondary"><Plus className="h-4 w-4" /> Add paragraph</button>
      </div>}
      {section !== 'faq' && <div className="space-y-3"><h3 className="font-semibold text-white">{section === 'about' ? 'Engineering focus cards' : section === 'vision' ? 'Long-term priorities' : 'Process steps'}</h3>
        {cards.map((card, i) => <article key={i} className="space-y-3 rounded-lg border border-dark-700 p-4">
          <div className="flex items-center justify-between"><span className="text-xs text-dark-400">Item {i + 1}</span><button type="button" aria-label="Remove card" className="p-2 text-red-300" onClick={() => patchArray(cardKey, cards.filter((_, index) => index !== i))}><Trash2 className="h-4 w-4" /></button></div>
          <input value={card.title} placeholder="Title" className={textField} onChange={e => patchArray(cardKey, cards.map((c, index) => index === i ? { ...c, title: e.target.value } : c))} />
          <textarea value={card.description} rows={3} placeholder="Description" className={textField} onChange={e => patchArray(cardKey, cards.map((c, index) => index === i ? { ...c, description: e.target.value } : c))} />
          {(section === 'about' || section === 'vision') && <div className="flex flex-wrap items-center gap-3"><MediaLibraryPicker onSelect={url => patchArray(cardKey, cards.map((c, index) => index === i ? { ...c, image: url } : c))} />{card.image && <><img src={card.image} alt={card.title} className="h-14 w-20 rounded object-cover" /><button type="button" className="text-sm text-red-300" onClick={() => patchArray(cardKey, cards.map((c, index) => index === i ? { ...c, image: '' } : c))}>Remove image</button></>}</div>}
        </article>)}
        <button type="button" className="btn-secondary" onClick={() => patchArray(cardKey, [...cards, { title: '', description: '' }])}><Plus className="h-4 w-4" />Add {section === 'process' ? 'step' : 'card'}</button>
      </div>}
      {section === 'faq' && <div className="space-y-3"><h3 className="font-semibold text-white">Frequently asked questions</h3>
        {draft.faq.questions.map((faq, i) => <article key={i} className="space-y-3 rounded-lg border border-dark-700 p-4"><div className="flex items-center justify-between"><span className="text-xs text-dark-400">Question {i + 1}</span><button aria-label="Remove question" type="button" onClick={() => patchArray('questions', draft.faq.questions.filter((_, index) => index !== i))} className="text-red-300"><Trash2 className="h-4 w-4" /></button></div>
          <input className={textField} value={faq.question} placeholder="Question" onChange={e => patchArray('questions', draft.faq.questions.map((q, index) => i === index ? { ...q, question: e.target.value } : q))} />
          <textarea rows={3} className={textField} value={faq.answer} placeholder="Answer" onChange={e => patchArray('questions', draft.faq.questions.map((q, index) => i === index ? { ...q, answer: e.target.value } : q))} />
        </article>)}
        <button type="button" className="btn-secondary" onClick={() => patchArray('questions', [...draft.faq.questions, { question: '', answer: '' }])}><Plus className="h-4 w-4" />Add question</button>
      </div>}
    </div>}
    <div className="flex flex-wrap items-center gap-3"><button type="button" disabled={busy || isLoading} onClick={() => void save()} className="btn-primary inline-flex items-center gap-2"><Save className="h-4 w-4" />{busy ? 'Publishing…' : 'Save and publish changes'}</button>
      <a href={`/#${section === 'process' ? 'process' : section === 'vision' ? 'engineering-direction' : section}`} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-flex items-center gap-2"><ExternalLink className="h-4 w-4" />View public section</a>
      <button type="button" disabled={busy} onClick={() => setDraft(content)} className="btn-secondary">Discard edits</button>
      <button type="button" disabled={busy} onClick={() => { if (window.confirm('Replace the draft with the original homepage text? Click Save to publish the reset.')) setDraft(defaultSiteContent) }} className="inline-flex items-center gap-2 text-sm text-dark-400"><RotateCcw className="h-4 w-4" />Restore original draft</button>
    </div>
  </div>
}
