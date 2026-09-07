'use client'

import { BarChart3, Bell, CalendarDays, FolderOpen, Plus, Sparkles } from 'lucide-react'
import type { AdminTab } from './AdminSidebar'

interface AdminOverviewProps {
  projectsCount: number
  newLeadsCount: number
  pendingBookingsCount: number
  todayVisitsCount: number
  onNavigate: (tab: AdminTab) => void
  onCreateProject: () => void
}

export default function AdminOverview({
  projectsCount,
  newLeadsCount,
  pendingBookingsCount,
  todayVisitsCount,
  onNavigate,
  onCreateProject,
}: AdminOverviewProps) {
  const kpis = [
    { label: 'Projects', value: projectsCount, detail: 'Portfolio records', icon: FolderOpen, tab: 'projects' as AdminTab, accent: '#7CA7EB' },
    { label: 'New leads', value: newLeadsCount, detail: 'Need a response', icon: Bell, tab: 'leads' as AdminTab, accent: '#CBB08A' },
    { label: 'Bookings', value: pendingBookingsCount, detail: 'Pending confirmation', icon: CalendarDays, tab: 'bookings' as AdminTab, accent: '#F7F3EC' },
    { label: 'Visitors today', value: todayVisitsCount, detail: 'Portfolio sessions', icon: BarChart3, tab: 'analytics' as AdminTab, accent: '#7CA7EB' },
  ]

  const attention = [
    {
      title: newLeadsCount > 0 ? `${newLeadsCount} lead${newLeadsCount === 1 ? '' : 's'} waiting` : 'No new leads waiting',
      description: newLeadsCount > 0 ? 'Review new project enquiries and respond while intent is fresh.' : 'Your lead inbox is clear.',
      tab: 'leads' as AdminTab,
      priority: newLeadsCount > 0,
    },
    {
      title: pendingBookingsCount > 0 ? `${pendingBookingsCount} booking${pendingBookingsCount === 1 ? '' : 's'} pending` : 'Bookings are up to date',
      description: pendingBookingsCount > 0 ? 'Confirm upcoming meetings and keep the client journey moving.' : 'There are no pending booking actions.',
      tab: 'bookings' as AdminTab,
      priority: pendingBookingsCount > 0,
    },
    {
      title: 'Check audience performance',
      description: 'Review which pages and projects are attracting the most attention.',
      tab: 'analytics' as AdminTab,
      priority: false,
    },
  ]

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden border border-white/10 bg-[#000B26] p-6 sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full border border-[#7CA7EB]/20" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#7CA7EB]">Control centre</p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.03em] text-[#F7F3EC] sm:text-4xl">
              Manage the portfolio like a product, not a collection of pages.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">
              Priorities, business activity, content maintenance and audience performance are now separated so the work that matters is easier to see.
            </p>
          </div>
          <button
            onClick={onCreateProject}
            className="inline-flex items-center justify-center gap-2 bg-[#F7F3EC] px-5 py-3 text-sm font-bold text-[#000B26] transition hover:bg-[#7CA7EB]"
          >
            <Plus className="h-4 w-4" />
            New project
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(item => {
          const Icon = item.icon
          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.tab)}
              className="group border border-white/10 bg-[#0B1120] p-5 text-left transition hover:border-white/25 hover:bg-[#0D1527]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-10 w-10 items-center justify-center border border-white/10" style={{ color: item.accent }}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-3xl font-semibold tracking-[-0.04em] text-white">{item.value}</span>
              </div>
              <p className="mt-5 text-sm font-semibold text-white">{item.label}</p>
              <p className="mt-1 text-xs text-white/40">{item.detail}</p>
            </button>
          )
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="border border-white/10 bg-[#0B1120]">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
            <div>
              <p className="text-sm font-semibold text-white">Needs attention</p>
              <p className="mt-1 text-xs text-white/40">Business and portfolio actions worth checking first.</p>
            </div>
            <Sparkles className="h-4 w-4 text-[#CBB08A]" />
          </div>
          <div>
            {attention.map(item => (
              <button
                key={item.title}
                onClick={() => onNavigate(item.tab)}
                className="grid w-full gap-3 border-b border-white/[0.07] px-5 py-5 text-left transition last:border-b-0 hover:bg-white/[0.03] sm:grid-cols-[0.8fr_1.2fr] sm:px-6"
              >
                <div className="flex items-center gap-3">
                  <span className={'h-2 w-2 rounded-full ' + (item.priority ? 'bg-[#CBB08A]' : 'bg-white/20')} />
                  <span className="text-sm font-semibold text-white">{item.title}</span>
                </div>
                <p className="text-xs leading-5 text-white/45 sm:text-sm">{item.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="border border-white/10 bg-[#CBB08A] p-6 text-[#402924]">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#402924]/55">Quick actions</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.02em]">Keep the portfolio current.</h3>
          <div className="mt-6 space-y-2">
            {[
              ['Manage projects', 'projects'],
              ['Update profile', 'profile'],
              ['Review services', 'services'],
              ['Open analytics', 'analytics'],
            ].map(([label, tab]) => (
              <button
                key={label}
                onClick={() => onNavigate(tab as AdminTab)}
                className="flex w-full items-center justify-between border-t border-[#402924]/20 py-3 text-left text-sm font-semibold transition hover:pl-2"
              >
                <span>{label}</span>
                <span>→</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
