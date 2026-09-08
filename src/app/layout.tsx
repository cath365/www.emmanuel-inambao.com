import type { Metadata } from 'next'
import { DM_Serif_Display, Inter, Noto_Sans_Arabic, Noto_Sans_SC } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'
import Providers from '@/components/Providers'
import VisitorTracker from '@/components/ui/VisitorTracker'
import { generatePersonSchema, generateWebsiteSchema } from '@/lib/schema'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const editorial = DM_Serif_Display({ subsets: ['latin'], variable: '--font-editorial', weight: '400' })
const notoArabic = Noto_Sans_Arabic({ subsets: ['arabic'], variable: '--font-arabic', weight: ['400', '500', '600', '700'] })
const notoSC = Noto_Sans_SC({ subsets: ['latin'], variable: '--font-chinese', weight: ['400', '500', '600', '700'] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://emmanuel-inambao-eight.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'Emmanuel Inambao Engineering Portfolio',
  title: {
    default: 'Emmanuel Inambao | Systems Engineer · AI · IoT · Robotics',
    template: '%s | Emmanuel Inambao',
  },
  description: 'Engineering portfolio of Emmanuel Inambao in Lusaka, Zambia — AI, IoT, robotics, embedded systems, mobile applications and full-stack platforms.',
  keywords: [
    'Emmanuel Inambao',
    'Systems Engineer Zambia',
    'IoT Developer Zambia',
    'Robotics Developer',
    'Embedded Systems',
    'ESP32',
    'Next.js Developer',
    'Industrial Automation',
    'AI Engineer',
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
    title: 'Emmanuel Inambao | Systems Engineer',
    description: 'AI, IoT, robotics, embedded systems and full-stack engineering for real-world systems.',
    siteName: 'Emmanuel Inambao Engineering Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emmanuel Inambao | Systems Engineer',
    description: 'AI, IoT, robotics, embedded systems and full-stack engineering.',
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
    <html
      lang="en"
      className={'scroll-smooth dark overflow-x-hidden ' + inter.variable + ' ' + editorial.variable + ' ' + notoArabic.variable + ' ' + notoSC.variable}
      suppressHydrationWarning
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000B26" />
        <link rel="alternate" type="application/rss+xml" title="Emmanuel Inambao Blog" href="/api/rss" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generatePersonSchema()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWebsiteSchema()) }} />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
          <VisitorTracker />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
