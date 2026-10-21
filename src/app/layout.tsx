import type { Metadata, Viewport } from 'next'
// Production deployment refresh: portfolio + AI quotation release
import { Analytics } from '@vercel/analytics/react'
import './globals.css'
import Providers from '@/components/Providers'
import VisitorTracker from '@/components/ui/VisitorTracker'
import { generatePersonSchema, generateWebsiteSchema } from '@/lib/schema'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://emmanuel-inambao-eight.vercel.app'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#020617',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'Emmanuel Inambao Engineering Portfolio',
  title: {
    default: 'Emmanuel Inambao | Robotics & IoT Engineer · Full-Stack Systems Developer · Technical Project Manager',
    template: '%s | Emmanuel Inambao',
  },
  description: 'Emmanuel Inambao is a Zambia-based robotics, IoT, embedded systems and full-stack engineer who designs practical solutions for water, accessibility, education, agriculture, civic information and business operations.',
  keywords: [
    'Emmanuel Inambao',
    'Robotics Engineer Zambia',
    'IoT Engineer Zambia',
    'Embedded Systems Engineer',
    'Full-Stack Developer Zambia',
    'Technical Project Manager',
    'IoT Developer Zambia',
    'Robotics Developer',
    'Embedded Systems',
    'ESP32',
    'Next.js Developer',
    'Industrial Automation',
    'Technology Product Builder Zambia',
    'AI and Data Systems',
    'Lusaka Zambia',
  ],
  authors: [{ name: 'Emmanuel Inambao' }],
  creator: 'Emmanuel Inambao',
  category: 'technology',
  alternates: {
    canonical: '/',
    languages: {
      en: '/?lang=en',
      fr: '/?lang=fr',
      pt: '/?lang=pt',
      es: '/?lang=es',
      de: '/?lang=de',
      ar: '/?lang=ar',
      zh: '/?lang=zh',
      'x-default': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'Emmanuel Inambao | Robotics & IoT Engineer',
    description: 'Problem-focused engineering across robotics, IoT, embedded systems and full-stack software for water, accessibility, education, agriculture and business systems.',
    siteName: 'Emmanuel Inambao Engineering Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emmanuel Inambao | Robotics & IoT Engineer',
    description: 'Building practical software, IoT, embedded and robotics systems around real-world operating problems.',
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth dark overflow-x-hidden" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="alternate" type="application/rss+xml" title="Emmanuel Inambao Blog" href="/api/rss" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generatePersonSchema()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWebsiteSchema()) }} />
      </head>
      <body className="bg-[#F7F5EF] font-sans text-[#293442] dark:bg-dark-950 dark:text-dark-100">
        <Providers>
          {children}
          <VisitorTracker />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
