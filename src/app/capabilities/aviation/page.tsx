import type { Metadata } from 'next'
import CapabilitySectorClient from '@/components/capabilities/CapabilitySectorClient'
import { capabilitySectorBySlug } from '@/lib/institutional-capabilities'

export const metadata: Metadata = {
  title: 'Aviation & High-Reliability Systems Capability | Emmanuel Inambao',
  description: 'Embedded monitoring, telemetry, asset tracking, operational software and non-flight-critical connected systems for aviation-adjacent operations.',
  alternates: { canonical: '/capabilities/aviation' },
}

export default function AviationCapabilityPage() {
  return <CapabilitySectorClient sector={capabilitySectorBySlug.aviation} />
}
