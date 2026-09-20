import type { Metadata } from 'next'
import InstitutionalRequestClient from './InstitutionalRequestClient'

export const metadata: Metadata = {
  title: 'Institutional Project / RFQ Brief | Emmanuel Inambao',
  description: 'Submit a structured government, aviation, corporate or institutional engineering project brief for technical review.',
  alternates: { canonical: '/capabilities/request' },
}

export default function InstitutionalRequestPage() {
  return <InstitutionalRequestClient />
}
