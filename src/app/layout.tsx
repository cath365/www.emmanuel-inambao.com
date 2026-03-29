import type { Metadata } from 'next'
import { Inter, Noto_Sans_Arabic, Noto_Sans_SC } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const notoArabic = Noto_Sans_Arabic({ subsets: ['arabic'], variable: '--font-arabic', weight: ['400', '500', '600', '700'] })
const notoSC = Noto_Sans_SC({ subsets: ['latin'], variable: '--font-chinese', weight: ['400', '500', '600', '700'] })

// Multilingual SEO metadata
export const metadata: Metadata = {
  title: {
    default: 'Prof. Emmanuel Inambao | Electronic Engineer & IoT Developer',
    template: '%s | Emmanuel Inambao',
  },
  description: 'Professional portfolio of Professor Emmanuel Inambao - Electronic Engineer, IoT & Robotics Developer, Full-Stack Systems Engineer based in Lusaka, Zambia. Specializing in embedded systems, industrial automation, and smart solutions.',
  keywords: [
    'Emmanuel Inambao',
    'Electronic Engineer',
    'IoT Developer',
    'Robotics',
    'Embedded Systems',
    'Arduino',
    'ESP32',
    'Full-Stack Developer',
    'Zambia',
    'Industrial Automation',
    'Smart Systems',
    // Multilingual keywords
    'Ingénieur Électronique',
    'Développeur IoT',
    'Ingeniero Electrónico',
    'Elektroingenieur',
    '电子工程师',
    '物联网开发者',
    'مهندس إلكترونيات',
  ],
  authors: [{ name: 'Emmanuel Inambao' }],
  creator: 'Emmanuel Inambao',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://emmanuelinambao.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/?lang=en',
      'fr': '/?lang=fr',
      'pt': '/?lang=pt',
      'es': '/?lang=es',
      'de': '/?lang=de',
      'ar': '/?lang=ar',
      'zh': '/?lang=zh',
      'x-default': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['fr_FR', 'pt_BR', 'es_ES', 'de_DE', 'ar_SA', 'zh_CN'],
    url: 'https://emmanuelinambao.com',
    title: 'Prof. Emmanuel Inambao | Electronic Engineer & IoT Developer',
    description: 'Electronic Engineer, IoT & Robotics Developer, Full-Stack Systems Engineer. Building intelligent systems that solve real-world problems.',
    siteName: 'Emmanuel Inambao Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prof. Emmanuel Inambao | Electronic Engineer & IoT Developer',
    description: 'Electronic Engineer, IoT & Robotics Developer, Full-Stack Systems Engineer. Building intelligent systems that solve real-world problems.',
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

import { generatePersonSchema, generateWebsiteSchema } from '@/lib/schema'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`scroll-smooth dark overflow-x-hidden ${inter.variable} ${notoArabic.variable} ${notoSC.variable}`} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6366f1" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        {/* RSS Feed */}
        <link rel="alternate" type="application/rss+xml" title="Emmanuel Inambao Blog" href="/api/rss" />
        {/* Preconnect to Google Fonts for Arabic and Chinese */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
      <body className={`${inter.className} bg-dark-950 text-dark-100 light:bg-slate-50 light:text-slate-900`}>
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
