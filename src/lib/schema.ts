// JSON-LD Schema markup for better SEO
// Import and use in layout.tsx

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://emmanuelinambao.com'

export function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Emmanuel Inambao',
    alternateName: 'Emmanuel Inambao',
    description: 'Robotics & IoT Engineer, Full-Stack Systems Developer and Technical Project Manager based in Lusaka, Zambia',
    jobTitle: 'Robotics & IoT Engineer | Full-Stack Systems Developer | Technical Project Manager',
    url: SITE_URL,
    email: 'denuelinambao@gmail.com',
    telephone: '+260973914432',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lusaka',
      addressCountry: 'Zambia',
    },
    sameAs: [
      'https://github.com/cath365',
      'https://linkedin.com/in/emmanuelinambao',
    ],
    knowsAbout: [
      'Embedded Systems',
      'Internet of Things (IoT)',
      'Robotics',
      'Arduino',
      'ESP32',
      'Full-Stack Development',
      'Technical Project Management',
      'Project-Based STEM Programmes',
      'Water Monitoring Systems',
      'Assistive Technology',
      'Agricultural IoT',
      'Civic Technology',
      'Industrial Automation',
    ],
  }
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Emmanuel Inambao Portfolio',
    url: SITE_URL,
    description: 'Professional portfolio of Emmanuel Inambao - solving real-world problems through robotics, IoT, embedded systems, full-stack software and technical project delivery',
    author: {
      '@type': 'Person',
      name: 'Emmanuel Inambao',
    },
  }
}

export function generateProfessionalServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Emmanuel Inambao Engineering Services',
    description: 'Robotics, embedded systems, IoT, full-stack software and technical project delivery services',
    provider: {
      '@type': 'Person',
      name: 'Emmanuel Inambao',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Zambia',
    },
    serviceType: [
      'Embedded Systems Development',
      'IoT Solutions',
      'Industrial Automation',
      'Web Application Development',
      'Technical Project Management',
      'STEM Project Planning',
      'Technical Consulting',
    ],
  }
}
