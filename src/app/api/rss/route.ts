import { NextResponse } from 'next/server'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://emmanuelinambao.com'

const blogPosts = [
  {
    title: 'Getting Started with ESP32 for Industrial IoT',
    slug: 'esp32-industrial-iot',
    description: 'A comprehensive guide to using ESP32 microcontrollers for industrial Internet of Things applications, from sensor integration to cloud connectivity.',
    date: '2024-12-15',
    category: 'IoT',
  },
  {
    title: 'Building Smart Irrigation Systems with Arduino',
    slug: 'smart-irrigation-arduino',
    description: 'How I designed and built an automated irrigation system using Arduino, soil moisture sensors, and a mobile app for real-time monitoring.',
    date: '2024-11-28',
    category: 'Embedded Systems',
  },
  {
    title: 'PCB Design Best Practices for Beginners',
    slug: 'pcb-design-best-practices',
    description: 'Essential tips and techniques for designing professional-grade printed circuit boards, from schematic capture to manufacturing.',
    date: '2024-11-10',
    category: 'Hardware',
  },
  {
    title: 'Real-Time IoT Dashboards with Next.js and MQTT',
    slug: 'iot-dashboards-nextjs-mqtt',
    description: 'Building real-time data visualization dashboards for IoT devices using Next.js, MQTT protocol, and Chart.js.',
    date: '2024-10-22',
    category: 'Web Development',
  },
]

function generateRSSFeed(): string {
  const items = blogPosts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <category>${post.category}</category>
    </item>`
    )
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Emmanuel Inambao - Engineering Blog</title>
    <link>${SITE_URL}</link>
    <description>Insights on IoT, embedded systems, robotics, and full-stack engineering from Lusaka, Zambia.</description>
    <language>en</language>
    <managingEditor>denuelinambao@gmail.com (Emmanuel Inambao)</managingEditor>
    <webMaster>denuelinambao@gmail.com (Emmanuel Inambao)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/api/rss" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/icons/icon-192.png</url>
      <title>Emmanuel Inambao</title>
      <link>${SITE_URL}</link>
    </image>
    ${items}
  </channel>
</rss>`
}

export async function GET() {
  const feed = generateRSSFeed()
  return new NextResponse(feed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
