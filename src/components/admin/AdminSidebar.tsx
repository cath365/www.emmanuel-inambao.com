'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Award,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  FileText,
  FolderOpen,
  Gauge,
  Image as ImageIcon,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  User,
  Video,
  Wrench,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type AdminTab =
  | 'overview'
  | 'projects'
  | 'profile'
  | 'experience'
  | 'testimonials'
  | 'certifications'
  | 'services'
  | 'skills'
  | 'media'
  | 'resources'
  | 'gallery'
  | 'leads'
  | 'bookings'
  | 'analytics'

interface NavItem {
  id: AdminTab
  label: string
  icon: LucideIcon
  badge?: number
}

interface AdminSidebarProps {
  activeTab: AdminTab
  onChange: (tab: AdminTab) => void
  userEmail?: string
  newLeadsCount: number
  pendingBookingsCount: number
  todayVisitsCount: number
  onLogout: () => void
}

export default function AdminSidebar({
  activeTab,
  onChange,
  userEmail,
  newLeadsCount,
  pendingBookingsCount,
  todayVisitsCount,
  onLogout,
}: AdminSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const groups: Array<{ label: string; items: NavItem[] }> = [
    {
      label: 'Workspace',
      items: [
        { id: 'overview', label: 'Overview', icon: Gauge },
        { id: 'projects', label: 'Projects', icon: FolderOpen },
      ],
    },
    {
      label: 'Content',
      items: [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'experience', label: 'Experience', icon: BriefcaseBusiness },
        { id: 'services', label: 'Services', icon: Wrench },
        { id: 'skills', label: 'Skills', icon: Sparkles },
        { id: 'testimonials', label: 'Testimonials', icon: FileText },
        { id: 'certifications', label: 'Certifications', icon: Award },
      ],
    },
    {
      label: 'Assets',
      items: [
        { id: 'gallery', label: 'Gallery', icon: ImageIcon },
        { id: 'media', label: 'Media', icon: Video },
        { id: 'resources', label: 'Resources', icon: FileText },
      ],
    },
    {
      label: 'Business',
      items: [
        { id: 'leads', label: 'Leads', icon: Bell, badge: newLeadsCount },
        { id: 'bookings', label: 'Bookings', icon: CalendarDays, badge: pendingBookingsCount },
      ],
    },
    {
      label: 'Insights',
      items: [
        { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: todayVisitsCount },
      ],
    },
  ]

  const selectTab = (tab: AdminTab) => {
    onChange(tab)
    setMobileOpen(false)
  }

  const panel = (
    <div className="flex h-full flex-col bg-[#000B26] text-[#F7F3EC]">
      <div className="border-b border-white/10 px-5 py-6">
        <Link href="/" className="block">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7CA7EB]">Portfolio Control</p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <div>
              <p className="text-lg font-semibold leading-tight">Emmanuel Inambao</p>
              <p className="mt-1 text-xs text-white/50">Engineering workspace</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center border border-[#CBB08A]/40 text-[#CBB08A]">
              EI
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Admin navigation">
        <div className="space-y-6">
          {groups.map(group => (
            <div key={group.label}>
              <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">{group.label}</p>
              <div className="mt-2 space-y-1">
                {group.items.map(item => {
                  const Icon = item.icon
                  const active = item.id === activeTab
                  return (
                    <button
                      key={item.id}
                      onClick={() => selectTab(item.id)}
                      className={
                        'group flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition ' +
                        (active
                          ? 'bg-[#F7F3EC] text-[#000B26]'
                          : 'text-white/60 hover:bg-white/[0.06] hover:text-white')
                      }
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1 font-medium">{item.label}</span>
                      {item.badge && item.badge > 0 ? (
                        <span className={
                          'min-w-5 px-1.5 py-0.5 text-center text-[10px] font-bold ' +
                          (active ? 'bg-[#000B26] text-[#F7F3EC]' : 'bg-[#7CA7EB] text-[#000B26]')
                        }>
                          {item.badge > 99 ? '99+' : item.badge}
                        </span>
                      ) : active ? (
                        <ChevronRight className="h-3.5 w-3.5" />
                      ) : null}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 px-2">
          <p className="truncate text-xs font-medium text-white/70">{userEmail || 'Administrator'}</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-white/30">Signed in</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/"
            target="_blank"
            className="border border-white/20 px-3 py-2 text-center text-xs font-semibold text-white/70 transition hover:border-[#7CA7EB] hover:text-[#7CA7EB]"
          >
            View site
          </Link>
          <button
            onClick={onLogout}
            className="flex items-center justify-center gap-2 border border-white/20 px-3 py-2 text-xs font-semibold text-white/70 transition hover:border-red-400/60 hover:text-red-300"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-[#000B26]/95 px-4 backdrop-blur lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="border border-white/20 p-2 text-[#F7F3EC]"
          aria-label="Open admin navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7CA7EB]">Portfolio Control</p>
          <p className="text-sm font-semibold text-[#F7F3EC]">Admin</p>
        </div>
        <Link href="/" target="_blank" className="border border-white/20 p-2 text-[#F7F3EC]" aria-label="View portfolio">
          <Settings className="h-5 w-5" />
        </Link>
      </div>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/10 lg:block">
        {panel}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            className="absolute inset-0 bg-black/70"
            onClick={() => setMobileOpen(false)}
            aria-label="Close admin navigation"
          />
          <aside className="absolute inset-y-0 left-0 w-[86%] max-w-80 border-r border-white/10 shadow-2xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-4 top-4 z-10 border border-white/20 bg-[#000B26] p-2 text-white"
              aria-label="Close navigation"
            >
              <X className="h-4 w-4" />
            </button>
            {panel}
          </aside>
        </div>
      )}
    </>
  )
}
