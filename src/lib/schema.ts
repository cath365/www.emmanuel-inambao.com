const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://emmanuelinambao.com'

export function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Emmanuel Inambao',
    description:
      'Systems Engineer based in Lusaka, Zambia working across artificial intelligence, IoT, robotics, embedded systems, mobile applications and full-stack development.',
    jobTitle: 'Systems Engineer',
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
      'Artificial Intelligence',
      'Machine Learning',
      'Computer Vision',
      'Internet of Things',
      'Embedded Systems',
      'ESP32',
      'Arduino',
      'Robotics',
      'Mobile Application Development',
      'Full-Stack Development',
      'Technical Project Management',
    ],
  }
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Emmanuel Inambao Portfolio',
    url: SITE_URL,
    description:
      'Professional technology portfolio of Emmanuel Inambao, Systems Engineer in Lusaka, Zambia.',
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
    description:
      'Systems engineering, IoT, embedded systems, robotics, mobile application and full-stack development services.',
    provider: {
      '@type': 'Person',
      name: 'Emmanuel Inambao',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Zambia',
    },
    serviceType: [
      'Systems Engineering',
      'IoT Solutions',
      'Embedded Systems Development',
      'Robotics and Automation',
      'Mobile Application Development',
      'Full-Stack Web Development',
      'Technical Consulting',
    ],
  }
}
