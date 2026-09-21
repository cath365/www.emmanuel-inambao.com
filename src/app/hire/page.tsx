import type { Metadata } from 'next'
import HireClient from './HireClient'

export const metadata: Metadata = {
  title: 'Hire Emmanuel Inambao | Embedded Systems, IoT, Robotics & Full-Stack Engineering',
  description: 'Review Emmanuel Inambao’s engineering capabilities, proof-of-work and collaboration options for remote roles, contract projects and technical partnerships worldwide.',
  alternates: { canonical: '/hire' },
}

export default function HirePage() {
  return <HireClient />
}
