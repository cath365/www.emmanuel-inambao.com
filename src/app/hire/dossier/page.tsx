import type { Metadata } from 'next'
import DossierClient from './DossierClient'

export const metadata: Metadata = {
  title: 'Resume | Emmanuel Inambao',
  description: 'Professional resume of Emmanuel Inambao — Robotics & IoT Engineer, Full-Stack Systems Developer and Technical Project Manager.',
  alternates: { canonical: '/hire/dossier' },
}

export default function DossierPage() {
  return <DossierClient />
}
