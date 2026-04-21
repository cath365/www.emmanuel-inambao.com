'use client'

import { useEffect, useMemo, useState } from 'react'
import { Plus, Save, Trash2, Cpu } from 'lucide-react'
import { SkillCategory, useSkills } from '@/lib/skills'

interface Props {
  onNotify: (type: 'success' | 'error', message: string) => void
}

function normalizeId(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export default function SkillsEditor({ onNotify }: Props) {
  const { skillCategories, setSkillCategories } = useSkills()
  const [draft, setDraft] = useState<SkillCategory[]>(skillCategories)

  useEffect(() => {
    setDraft(skillCategories)
  }, [skillCategories])

  const hasChanges = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(skillCategories),
    [draft, skillCategories]
  )

  const updateCategory = (index: number, updates: Partial<SkillCategory>) => {
    setDraft(prev => prev.map((c, i) => (i === index ? { ...c, ...updates } : c)))
  }

  const addCategory = () => {
    const id = `category-${Date.now()}`
    setDraft(prev => [
      ...prev,
      {
        id,
        title: 'New Category',
        description: 'Describe this category',
        color: 'from-slate-500 to-slate-700',
        skills: [{ name: 'New Skill', level: 80 }],
      },
    ])
  }

  const removeCategory = (index: number) => {
    setDraft(prev => prev.filter((_, i) => i !== index))
  }

  const addSkill = (categoryIndex: number) => {
    setDraft(prev => prev.map((c, i) => (
      i === categoryIndex ? { ...c, skills: [...c.skills, { name: 'New Skill', level: 75 }] } : c
    )))
  }

  const updateSkill = (categoryIndex: number, skillIndex: number, name: string, level: number) => {
    setDraft(prev => prev.map((c, i) => {
      if (i !== categoryIndex) return c
      return {
        ...c,
        skills: c.skills.map((s, si) => (si === skillIndex ? { name, level } : s)),
      }
    }))
  }

  const removeSkill = (categoryIndex: number, skillIndex: number) => {
    setDraft(prev => prev.map((c, i) => {
      if (i !== categoryIndex) return c
      return { ...c, skills: c.skills.filter((_, si) => si !== skillIndex) }
    }))
  }

  const handleSave = () => {
    const cleaned = draft
      .map(cat => ({
        ...cat,
        id: cat.id?.trim() || normalizeId(cat.title),
        title: cat.title.trim(),
        description: cat.description.trim(),
        color: cat.color.trim() || 'from-slate-500 to-slate-700',
        skills: cat.skills
          .map(s => ({ name: s.name.trim(), level: Math.min(100, Math.max(0, Number(s.level) || 0)) }))
          .filter(s => s.name.length > 0),
      }))
      .filter(cat => cat.title.length > 0)

    if (cleaned.length === 0) {
      onNotify('error', 'Add at least one skills category before saving.')
      return
    }

    setSkillCategories(cleaned)
    setDraft(cleaned)
    onNotify('success', 'Skills updated successfully! AI and skills section now use this data.')
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-6 h-6 text-primary-500" />
            Skills
          </h1>
          <p className="text-dark-400 mt-1">Update skills shown on portfolio and used by AI assistant.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={addCategory} className="px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Category
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            Save Skills
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {draft.map((category, ci) => (
          <div key={`${category.id}-${ci}`} className="bg-dark-800/50 border border-dark-700 rounded-xl p-5">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <input
                value={category.title}
                onChange={e => updateCategory(ci, { title: e.target.value, id: normalizeId(e.target.value) })}
                className="px-3 py-2 bg-dark-900 border border-dark-700 rounded-lg text-white"
                placeholder="Category title"
              />
              <input
                value={category.id}
                onChange={e => updateCategory(ci, { id: e.target.value })}
                className="px-3 py-2 bg-dark-900 border border-dark-700 rounded-lg text-white"
                placeholder="Category id"
              />
              <input
                value={category.color}
                onChange={e => updateCategory(ci, { color: e.target.value })}
                className="px-3 py-2 bg-dark-900 border border-dark-700 rounded-lg text-white"
                placeholder="Tailwind gradient classes"
              />
              <button
                onClick={() => removeCategory(ci)}
                className="px-3 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Remove Category
              </button>
            </div>

            <textarea
              value={category.description}
              onChange={e => updateCategory(ci, { description: e.target.value })}
              className="w-full px-3 py-2 bg-dark-900 border border-dark-700 rounded-lg text-white mb-4"
              rows={2}
              placeholder="Category description"
            />

            <div className="space-y-2">
              {category.skills.map((skill, si) => (
                <div key={`${skill.name}-${si}`} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    value={skill.name}
                    onChange={e => updateSkill(ci, si, e.target.value, skill.level)}
                    className="col-span-8 px-3 py-2 bg-dark-900 border border-dark-700 rounded-lg text-white"
                    placeholder="Skill name"
                  />
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={skill.level}
                    onChange={e => updateSkill(ci, si, skill.name, Number(e.target.value))}
                    className="col-span-3 px-3 py-2 bg-dark-900 border border-dark-700 rounded-lg text-white"
                    placeholder="%"
                  />
                  <button
                    onClick={() => removeSkill(ci, si)}
                    className="col-span-1 p-2 text-red-400 hover:bg-red-600/20 rounded-lg"
                    aria-label="Remove skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addSkill(ci)}
                className="mt-2 px-3 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Skill
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
