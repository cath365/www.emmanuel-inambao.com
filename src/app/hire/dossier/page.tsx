import type { Metadata } from 'next'
import DossierClient from './DossierClient'

export const metadata: Metadata = {
  title: 'Professional Engineering Profile | Emmanuel Inambao',
  description: 'A concise professional profile for recruiters, clients, institutions and technical partners evaluating Emmanuel Inambao for engineering roles and projects.',
  alternates: { canonical: '/hire/dossier' },
}

export default function DossierPage() {
  return <DossierClient />
}
