import Link from 'next/link'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react'

const blogPosts: Record<string, {
  title: string
  content: string[]
  category: string
  publishedAt: string
  readingTime: string
  tags: string[]
}> = {
  'getting-started-with-esp32': {
    title: 'Getting Started with ESP32 for IoT Projects',
    category: 'IoT',
    publishedAt: '2026-01-05',
    readingTime: '8 min read',
    tags: ['ESP32', 'IoT', 'Tutorial', 'Arduino'],
    content: [
      'The ESP32 is one of the most versatile microcontrollers available today for IoT projects. With built-in Wi-Fi and Bluetooth, dual-core processing, and a rich set of peripherals, it is the go-to choice for connected devices.',
      'In this guide, I walk you through setting up your development environment with PlatformIO, wiring your first sensor (a DHT22 temperature/humidity sensor), and publishing data over MQTT to a cloud dashboard.',
      'Hardware you will need: an ESP32 DevKit board, a DHT22 sensor, a breadboard, jumper wires, and a USB-C cable. Total cost is under $15.',
      'Step 1: Install PlatformIO in VS Code. This gives you a professional embedded development workflow with library management, serial monitoring, and OTA update support.',
      'Step 2: Create a new project targeting the ESP32 Dev Module. Add the DHT sensor library and PubSubClient (MQTT) library to your platformio.ini.',
      'Step 3: Wire the DHT22 — connect VCC to 3.3V, GND to GND, and the data pin to GPIO4. Add a 10kΩ pull-up resistor between VCC and the data pin.',
      'Step 4: Write firmware that reads temperature and humidity every 30 seconds and publishes JSON payloads to an MQTT broker. I recommend using a free broker like HiveMQ for testing.',
      'Step 5: Set up a simple Next.js dashboard that subscribes to your MQTT topic via WebSocket and displays the readings in real-time charts.',
      'This is the foundation of every IoT project I build. From here, you can add more sensors, implement deep sleep for battery operation, or add OTA updates for remote firmware management.',
    ],
  },
  'smart-irrigation-system': {
    title: 'Building a Smart Irrigation System for African Farms',
    category: 'Projects',
    publishedAt: '2025-12-20',
    readingTime: '12 min read',
    tags: ['Agriculture', 'IoT', 'Automation', 'Case Study'],
    content: [
      'Water scarcity is one of the biggest challenges facing agriculture in sub-Saharan Africa. In Zambia, many farmers rely on manual irrigation methods that waste water and deliver inconsistent results.',
      'I designed a smart irrigation system that uses soil moisture sensors, an ESP32 controller, and solar power to automate watering schedules based on real-time soil conditions.',
      'The system architecture consists of three layers: the sensor layer (soil moisture, temperature, and rain sensors), the control layer (ESP32 with relay modules driving solenoid valves), and the monitoring layer (a Next.js web dashboard).',
      'Key design decisions included using capacitive soil moisture sensors instead of resistive ones (they last longer in the field), powering the system with a 20W solar panel and 18650 lithium batteries, and implementing offline operation with data sync when connectivity is available.',
      'The ESP32 reads sensor values every 5 minutes and makes irrigation decisions based on configurable thresholds. When soil moisture drops below 30%, the pump activates. It stops when moisture reaches 60%. This prevents both under-watering and over-watering.',
      'Results after 6 months of deployment on 3 farms in the Lusaka region: 40% reduction in water usage, measurable improvement in crop health, and farmers saving 15+ hours per week of manual labor.',
      'The total build cost per unit is approximately $45, making it accessible for small-scale farmers. I am working with local NGOs to subsidize distribution to farming cooperatives.',
      'Lessons learned: ruggedize all outdoor enclosures with IP65 cases, use LoRa for long-range field communication instead of Wi-Fi, and always include a manual override switch.',
    ],
  },
  'pcb-design-best-practices': {
    title: 'PCB Design Best Practices for Embedded Systems',
    category: 'Hardware',
    publishedAt: '2025-12-10',
    readingTime: '10 min read',
    tags: ['PCB', 'Hardware', 'Best Practices', 'Design'],
    content: [
      'After designing dozens of PCBs for production embedded systems, I have compiled my most important lessons learned into this guide.',
      'Rule 1: Ground plane first. Always use a solid ground plane on at least one layer. This reduces EMI, provides a low-impedance return path, and improves signal integrity.',
      'Rule 2: Decouple every IC. Place 100nF ceramic capacitors as close as possible to every IC power pin. For microcontrollers, add a 10µF bulk cap near the power input.',
      'Rule 3: Keep analog and digital grounds separate but connected at a single point. This prevents digital noise from contaminating your analog measurements.',
      'Rule 4: Trace width matters. Use online calculators to determine the correct trace width for your current requirements. A 10mil trace can only handle about 300mA safely on an inner layer.',
      'Rule 5: Think about manufacturing. Maintain minimum clearances (6mil for most fab houses), avoid acid traps, and add fiducial markers for pick-and-place assembly.',
      'Rule 6: Review your design with a DRC (Design Rule Check) and manually inspect the 3D view. I have caught component collision issues that DRC missed by visually inspecting the board.',
      'My tool of choice is KiCad — it is free, open-source, and has improved dramatically in recent years. For simple boards, EasyEDA is also excellent and integrates directly with JLCPCB for manufacturing.',
      'Finally, always order a prototype run before committing to production quantities. A $5 prototype can save you thousands in rework costs.',
    ],
  },
  'nextjs-for-iot-dashboards': {
    title: 'Building Real-Time IoT Dashboards with Next.js',
    category: 'Web Dev',
    publishedAt: '2025-11-28',
    readingTime: '15 min read',
    tags: ['Next.js', 'React', 'IoT', 'Dashboard'],
    content: [
      'Every IoT system needs a dashboard, and Next.js has become my framework of choice for building them. In this article, I explain my architecture for real-time IoT data visualization.',
      'The stack: Next.js for the frontend, MQTT over WebSocket for real-time data, Chart.js for visualizations, and a simple REST API for historical data queries.',
      'Architecture overview: IoT devices publish sensor data to an MQTT broker. The Next.js app subscribes to relevant topics via a WebSocket connection. Incoming data updates React state, which triggers chart re-renders.',
      'For the MQTT connection, I use the mqtt.js library wrapped in a custom React hook called useMQTT. This handles connection management, automatic reconnection, and topic subscription lifecycle.',
      'For charts, Chart.js with react-chartjs-2 provides excellent performance for real-time data. The key is maintaining a rolling window of data points (I typically keep the last 100 readings) and using requestAnimationFrame for smooth updates.',
      'For historical data, I store readings in a time-series format and expose a REST API endpoint that accepts date range queries. This powers the "zoom out" functionality where users can view hourly, daily, or weekly trends.',
      'Performance tips: debounce rapid MQTT messages (some sensors publish every second), use React.memo on chart components, and implement virtual scrolling for device lists with 100+ entries.',
      'Authentication matters too. I use NextAuth.js with role-based access so that device owners see only their data, and admin users get a fleet-wide overview.',
      'This architecture has served me well across multiple projects, from single-device home monitoring to multi-site industrial deployments with hundreds of sensors.',
    ],
  },
}

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts[slug]
  
  if (!post) {
    return { title: 'Blog Post Not Found' }
  }
  
  return {
    title: `${post.title} | Blog | Prof. Emmanuel Inambao`,
    description: post.content[0],
  }
}

export function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({ slug }))
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params
  const post = blogPosts[slug]

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-dark-950 light:bg-slate-50 pt-24 pb-16">
      <article className="section-container max-w-3xl">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Article header */}
        <header className="mb-10">
          <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20 mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white light:text-slate-900 mb-4">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-dark-400 light:text-slate-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readingTime}
            </span>
          </div>
        </header>

        {/* Article content */}
        <div className="prose prose-invert light:prose-slate max-w-none">
          {post.content.map((paragraph, i) => (
            <p key={i} className="text-dark-300 light:text-slate-600 leading-relaxed mb-6">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Tags */}
        <div className="mt-10 pt-6 border-t border-dark-800 light:border-slate-200">
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="w-4 h-4 text-dark-500" />
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs rounded-full bg-dark-800 light:bg-slate-100 text-dark-300 light:text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Author footer */}
        <div className="mt-8 p-6 bg-dark-900/50 light:bg-white border border-dark-800 light:border-slate-200 rounded-xl">
          <p className="text-sm text-dark-400 light:text-slate-500 mb-1">Written by</p>
          <p className="text-white light:text-slate-900 font-semibold">Emmanuel Inambao</p>
          <p className="text-sm text-dark-400 light:text-slate-500">
            Electronic Engineer &amp; IoT Developer based in Lusaka, Zambia.
          </p>
        </div>
      </article>
    </main>
  )
}
