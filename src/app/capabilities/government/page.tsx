import type { Metadata } from 'next'
import CapabilitySectorClient from '@/components/capabilities/CapabilitySectorClient'
import { capabilitySectorBySlug } from '@/lib/institutional-capabilities'

export const metadata: Metadata = {
  title: 'Government & Public-Sector ICT Capability | Emmanuel Inambao',
  description: 'ICT systems, digital services, systems integration, monitoring, field technology, documentation and institutional delivery capability for public-sector organizations.',
  alternates: { canonical: '/capabilities/government' },
}

export default function GovernmentCapabilityPage() {
  return <CapabilitySectorClient sector={capabilitySectorBySlug.government} />
}
