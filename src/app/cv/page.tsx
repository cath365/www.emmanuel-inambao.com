import type { Metadata } from 'next'
import CVClient from './CVClient'

export const metadata: Metadata = {
  title: 'Curriculum Vitae | Emmanuel Inambao',
  description:
    'Detailed curriculum vitae of Emmanuel Inambao — Robotics & IoT Engineer, Full-Stack Systems Developer and Technical Project Manager in Lusaka, Zambia.',
  alternates: { canonical: '/cv' },
}

export default function CVPage() {
  return <CVClient />
}
