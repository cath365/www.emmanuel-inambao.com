import type { Metadata } from 'next'
import CapabilitiesClient from './CapabilitiesClient'

export const metadata: Metadata = {
  title: 'Engineering & Digital Systems Capability | Emmanuel Inambao',
  description: 'Institutional engineering capability across embedded systems, IoT, digital applications, systems integration, monitoring, offline field systems and technical handover.',
  alternates: { canonical: '/capabilities' },
}

export default function CapabilitiesPage() {
  return <CapabilitiesClient />
}
