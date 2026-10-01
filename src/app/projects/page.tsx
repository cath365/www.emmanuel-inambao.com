import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ProjectsDirectory from './ProjectsDirectory'

export const metadata: Metadata = {
  title: 'Engineering Projects',
  description: 'Explore real-world problems Emmanuel Inambao is addressing through robotics, IoT, embedded systems and software, with project roles, evidence, impact and current status.',
}

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-dark-950 pb-20 pt-24">
      <div className="section-container">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-dark-400 hover:text-primary-300">
          <ArrowLeft className="h-4 w-4" /> Back to portfolio
        </Link>

        <div className="mb-12 max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary-400">Project archive</p>
          <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">Problems, solutions, evidence and engineering decisions.</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-dark-400">
            Each project explains the real-world problem, who is affected, the solution approach, Emmanuel’s role, available evidence, expected or measured impact and the current development stage.
          </p>
        </div>

        <ProjectsDirectory />
      </div>
    </main>
  )
}
