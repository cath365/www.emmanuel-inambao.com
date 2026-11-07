import { NextResponse } from 'next/server'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://emmanuel-inambao-eight.vercel.app'

// Keep slugs and titles in sync with src/app/blog/[slug]/page.tsx. Leave date empty
// until a post has a real publication date; pubDate is then omitted from the feed.
const blogPosts = [
  {
    title: 'Getting Started with ESP32 for IoT Projects',
    slug: 'getting-started-with-esp32',
    description: 'A comprehensive guide to setting up your first ESP32 project, from hardware selection to your first sensor reading.',
    date: '',
    category: 'IoT',
  },
  {
    title: 'Planning a Smart Irrigation Prototype for Field Conditions',
    slug: 'smart-irrigation-system',
    description: 'A design note on planning an offline-capable irrigation prototype using sensing, control logic and field-friendly connectivity.',
    date: '',
    category: 'Engineering Notes',
  },
  {
    title: 'PCB Design Review Checklist for Embedded Systems',
    slug: 'pcb-design-best-practices',
    description: 'A practical checklist of grounding, trace routing, component placement and design-review considerations for embedded boards.',
    date: '',
    category: 'Hardware',
  },
  {
    title: 'Building Real-Time IoT Dashboards with Next.js',
    slug: 'nextjs-for-iot-dashboards',
    description: 'How to create responsive, real-time dashboards for monitoring IoT devices using Next.js, WebSockets, and Chart.js.',
    date: '',
    category: 'Web Dev',
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
      ${post.date ? `<pubDate>${new Date(post.date).toUTCString()}</pubDate>` : ''}
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
