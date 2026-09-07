import type { Metadata } from 'next'
import {
  Cormorant_Garamond,
  Inter,
  Noto_Sans_Arabic,
  Noto_Sans_SC,
} from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import { Analytics } from '@vercel/analytics/react'
import { generatePersonSchema, generateWebsiteSchema } from '@/lib/schema'
import VisitorTracker from '@/components/ui/VisitorTracker'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['500', '600', '700'],
})

const notoArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-arabic',
  weight: ['400', '500', '600', '700'],
})

const notoSC = Noto_Sans_SC({
  subsets: ['latin'],
  variable: '--font-chinese',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'Emmanuel Inambao | Systems Engineer',
    template: '%s | Emmanuel Inambao',
  },
  description:
    'Portfolio of Emmanuel Inambao, a Systems Engineer in Lusaka, Zambia building practical solutions across AI, IoT, robotics, embedded systems, mobile applications and full-stack development.',
  keywords: [
    'Emmanuel Inambao',
    'Systems Engineer Zambia',
    'AI Developer Zambia',
    'IoT Developer',
    'Robotics',
    'Embedded Systems',
    'ESP32',
    'Arduino',
    'Mobile App Development',
    'Full-Stack Developer',
    'Lusaka',
    'Zambia',
  ],
  authors: [{ name: 'Emmanuel Inambao' }],
  creator: 'Emmanuel Inambao',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://emmanuelinambao.com',
  ),
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
    alternateLocale: ['fr_FR', 'pt_BR', 'es_ES', 'de_DE', 'ar_SA', 'zh_CN'],
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://emmanuelinambao.com',
    title: 'Emmanuel Inambao | Systems Engineer',
    description:
      'Turning ideas into intelligent real-world solutions through AI, IoT, robotics, embedded systems, mobile applications and full-stack engineering.',
    siteName: 'Emmanuel Inambao Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emmanuel Inambao | Systems Engineer',
    description:
      'Turning ideas into intelligent real-world solutions through AI, IoT, robotics and software engineering.',
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`scroll-smooth dark overflow-x-hidden ${inter.variable} ${cormorant.variable} ${notoArabic.variable} ${notoSC.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/icons/icon-192.png" type="image/png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000B26" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Emmanuel Inambao Blog"
          href="/api/rss"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generatePersonSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateWebsiteSchema()),
          }}
        />
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
