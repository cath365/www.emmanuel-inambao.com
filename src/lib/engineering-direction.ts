/** Public roadmap: goals and priorities, not claims of completed work. */
export interface EngineeringDirection {
  eyebrow: string
  heading: string
  intro: string
  horizons: { title: string; description: string; image?: string }[]
}

export const defaultEngineeringDirection: EngineeringDirection = {
  eyebrow: 'Engineering with a long-term purpose',
  heading: 'Building useful systems, not demonstrations alone.',
  intro: 'From 2026 to 2036, my goal is to turn practical engineering work into reliable, maintainable technology for people and organisations in Zambia and beyond. These are priorities and ambitions, not completed results.',
  horizons: [
    { title: 'Now — evidence and reliability', description: 'Document working demonstrations, current status, actual contributions, limitations and measured tests. Show what is working and what still needs validation.' },
    { title: 'Next — pilots and repeatable delivery', description: 'Work with real users and partners, improve security and maintenance, test real-world costs, and verify outcomes before making scale claims.' },
    { title: 'Long term — African technology that lasts', description: 'Build supported products and partnerships in IoT, automation, accessibility and engineering education, designed for local constraints and responsible global growth.' },
  ],
}

export function readEngineeringDirection(value: unknown): EngineeringDirection {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return defaultEngineeringDirection
  const raw = value as Partial<EngineeringDirection>
  return {
    eyebrow: typeof raw.eyebrow === 'string' ? raw.eyebrow : defaultEngineeringDirection.eyebrow,
    heading: typeof raw.heading === 'string' ? raw.heading : defaultEngineeringDirection.heading,
    intro: typeof raw.intro === 'string' ? raw.intro : defaultEngineeringDirection.intro,
    horizons: Array.isArray(raw.horizons) ? raw.horizons.filter(item => item && typeof item.title === 'string' && typeof item.description === 'string') : defaultEngineeringDirection.horizons,
  }
}
