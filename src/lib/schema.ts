// JSON-LD Schema markup for better SEO
// Import and use in layout.tsx

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://emmanuelinambao.com'

export function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Professor Emmanuel Inambao',
    alternateName: 'Emmanuel Inambao',
    description: 'Electronic Engineer, IoT & Robotics Developer, Full-Stack Systems Engineer based in Lusaka, Zambia',
    jobTitle: 'Electronic Engineer & IoT Developer',
    url: SITE_URL,
    email: 'denuelinambao@gmail.com',
    telephone: '+260973914432',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lusaka',
      addressCountry: 'Zambia',
    },
    sameAs: [
      'https://github.com/bolo3574',
      'https://linkedin.com/in/emmanuelinambao',
    ],
    knowsAbout: [
      'Embedded Systems',
      'Internet of Things (IoT)',
      'Robotics',
      'Arduino',
      'ESP32',
      'Full-Stack Development',
      'Industrial Automation',
      'PCB Design',
    ],
  }
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Emmanuel Inambao Portfolio',
    url: SITE_URL,
    description: 'Professional portfolio of Professor Emmanuel Inambao - Electronic Engineer, IoT & Robotics Developer',
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
    description: 'Embedded systems development, IoT solutions, industrial automation, and full-stack engineering services',
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
      'PCB Design',
      'Technical Consulting',
    ],
  }
}
