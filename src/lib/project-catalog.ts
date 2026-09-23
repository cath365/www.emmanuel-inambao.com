export interface ProjectMedia {
  src: string
  alt: string
  caption?: string
  type?: 'photo' | 'screenshot' | 'diagram'
  fit?: 'cover' | 'contain'
}

export interface Project {
  id: string
  title: string
  purpose: string
  image: string
  techStack: string[]
  problemSolved: string
  systemLogic: string
  outcome: string
  featured: boolean
  role?: string
  status?: string
  architecture?: string[]
  highlights?: string[]
  githubUrl?: string
  liveUrl?: string
  appStoreUrl?: string
  playStoreUrl?: string
  websiteUrl?: string
  docsUrl?: string
  videoUrl?: string
  media?: ProjectMedia[]
}

export const defaultProjects: Project[] = [
  {
    id: 'smart-cooking-oil-dispenser',
    title: 'Smart Cooking Oil Dispenser',
    purpose: 'Automated pay-by-amount or pay-by-volume dispensing with operator accountability and cloud telemetry',
    image: '/images/projects/cooking-oil-prototype.webp',
    techStack: ['ESP32 WROOM-32D', 'Flow Sensor', 'SIM800', '4×4 Keypad', 'I2C LCD', 'Next.js', 'REST API', 'NVS'],
    problemSolved: 'Small and medium cooking-oil retailers need accurate dispensing, clear operator accountability, and reliable sales records even when internet connectivity is unstable.',
    systemLogic: 'An operator signs in with a PIN, selects an amount or target volume, and the ESP32 converts the request into a dispensing target. Flow pulses are measured continuously, the pump stops automatically at the target, and sales data is queued locally when offline before syncing to the web platform.',
    outcome: 'A commercial-ready IoT architecture combining embedded control, offline recovery, operator sales tracking, telemetry, receipts, and a web management dashboard.',
    featured: true,
    role: 'Lead Embedded & Full-Stack Engineer',
    status: 'Prototype / Commercial Development',
    architecture: ['Operator keypad + LCD', 'ESP32 control layer', 'Flow sensor + pump driver', 'Offline NVS queue', 'REST telemetry API', 'Owner dashboard'],
    highlights: ['Automatic target cut-off', 'Operator PIN verification', 'Offline-first operation', 'Sales and telemetry records'],
    media: [
      {
        src: '/images/projects/cooking-oil-prototype.webp',
        alt: 'Internal prototype of the Smart Cooking Oil Dispenser showing the embedded controller, LCD, GSM module and pump-control hardware',
        caption: 'Internal hardware prototype used to validate the embedded dispensing architecture and device integration.',
        type: 'photo',
        fit: 'cover',
      },
    ],
  },
  {
    id: 'denuel-one-pro-ai-x',
    title: 'Denuel One Pro AI X',
    purpose: 'ESP32 smart-device platform integrating touch UI, camera, GSM, Wi-Fi/Bluetooth, OTA and AI-assistant capabilities',
    image: '',
    techStack: ['ESP32', 'Touch Display', 'ESP32-CAM', 'SIM800', 'Wi-Fi', 'Bluetooth', 'OTA', 'Embedded UI'],
    problemSolved: 'Low-cost embedded devices often become isolated prototypes. This project explores how one compact platform can combine local UI, connectivity, camera, communication and AI-ready services in a maintainable embedded architecture.',
    systemLogic: 'The ESP32 runs the device interface and coordinates modular services for touch input, connectivity, camera access, GSM communication and status indicators. Features are separated so camera, calls/SMS, Wi-Fi/Bluetooth, OTA and AI-assistant integration can evolve without rewriting the entire interface.',
    outcome: 'An active R&D smart-device platform that demonstrates a reusable embedded architecture for connected products rather than a single-purpose microcontroller demo.',
    featured: true,
    role: 'Embedded Systems & Product Developer',
    status: 'Active R&D / Prototype',
    architecture: ['Touch UI + status layer', 'ESP32 application layer', 'Wi-Fi + Bluetooth services', 'ESP32-CAM integration', 'SIM800 calls/SMS path', 'OTA + AI integration layer'],
    highlights: ['Touch UI foundation', 'Modular communications architecture', 'Camera + GSM integration path', 'OTA and AI-ready design'],
  },
  {
    id: 'smart-walking-stick',
    title: 'AI Smart Walking Stick',
    purpose: 'AI-assisted navigation system for visually impaired users using a camera-equipped stick, sensors, smartphone AI and headset guidance',
    image: '/images/projects/walking-stick-sensor-prototype.webp',
    techStack: ['ESP32', 'Camera', 'Ultrasonic Sensors', 'Wi-Fi/BLE', 'Mobile App', 'On-device AI', 'Cloud AI', 'Wireless Headset'],
    problemSolved: 'A basic obstacle alarm only tells a visually impaired user that something is nearby. Safer mobility requires understanding the scene, selecting a safer direction and delivering guidance without requiring the user to hold a phone visibly.',
    systemLogic: 'The stick captures sensor data and selected image frames, then sends them to the paired smartphone over local Wi-Fi or Bluetooth. The phone performs fast on-device detection and can use cloud AI for deeper scene analysis before returning spoken navigation guidance through a wireless headset.',
    outcome: 'An assistive-technology prototype architecture focused on directional guidance and safer navigation rather than simple proximity alerts.',
    featured: true,
    role: 'IoT & Assistive Systems Developer',
    status: 'Prototype / Active Development',
    architecture: ['Camera + obstacle sensors on stick', 'ESP32 local communications', 'Phone app as compute bridge', 'On-device AI detection', 'Cloud AI scene analysis', 'Wireless headset guidance'],
    highlights: ['Camera remains on the stick', 'Phone acts as the compute bridge', 'Fast local detection path', 'Cloud-assisted scene reasoning'],
    media: [
      {
        src: '/images/projects/walking-stick-sensor-prototype.webp',
        alt: 'HC-SR04 ultrasonic sensor mounted on a prototype assembly for obstacle-detection testing',
        caption: 'Obstacle-detection sensor prototype detail used for ultrasonic ranging tests in the assistive-device development work.',
        type: 'photo',
        fit: 'cover',
      },
    ],
  },
  {
    id: 'the-spot-app',
    title: 'The Spot App',
    purpose: 'Production women’s-health mobile application for cycle education, tracking, phase information and administrative communication',
    image: '/images/projects/the-spot-hero.webp',
    techStack: ['React Native', 'Expo', 'Android', 'iOS', 'Google Play', 'App Store', 'Mobile UX', 'Admin Dashboard'],
    problemSolved: 'The product needed a more reliable mobile experience, clearer cycle-tracking information and a stable path to production distribution on both major mobile platforms.',
    systemLogic: 'The application combines cycle tracking and prediction, menstrual-phase education and user-facing content with an administrative communication layer. Deployment work includes production build stabilization and release workflows for Android and iOS.',
    outcome: 'A production mobile application released on Android and iOS after stabilization, deployment and product improvements.',
    featured: true,
    role: 'Mobile App & Deployment Developer',
    status: 'Production / Released',
    architecture: ['Mobile application', 'Cycle tracking + prediction', 'Educational content layer', 'Admin communication workflow', 'Android release pipeline', 'iOS release pipeline'],
    highlights: ['Android production release', 'iOS production release', 'Cycle-tracking improvements', 'Admin communication workflow'],
    media: [
      {
        src: '/images/projects/the-spot-hero.webp',
        alt: 'The Spot App mobile screens showing the home, health library and period-tracking interfaces',
        caption: 'Production mobile interface showing the home, health-library and cycle-tracking flows.',
        type: 'screenshot',
        fit: 'cover',
      },
    ],
  },
  {
    id: 'denuel-dev',
    title: 'Denuel-dev Cloud Platform',
    purpose: 'A Zambia-focused platform-as-a-service control plane for application deployments and managed infrastructure',
    image: '',
    techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Neon', 'GitHub', 'Queues', 'REST APIs', 'RBAC'],
    problemSolved: 'Local developers and teams need a simpler deployment platform with organization access control, deployment workflows, local billing concepts, and infrastructure abstractions that can grow beyond a basic hosting dashboard.',
    systemLogic: 'The control plane models organizations, projects, repositories, deployments, domains, environment variables, workloads, databases, usage records, subscriptions and audit logs. Git integration feeds deployment jobs into a queue-oriented workflow.',
    outcome: 'A modular control-plane foundation with authentication, organization RBAC, audit logging, GitHub integration, deployment APIs, queue concepts and a Lusaka region model.',
    featured: false,
    role: 'Founder & Platform Engineer',
    status: 'Active Development',
    architecture: ['Next.js control plane', 'RBAC + audit layer', 'GitHub integration', 'Deployment queue', 'PostgreSQL data model', 'Compute/workload abstraction'],
    highlights: ['Organization RBAC', 'Deployment API', 'ZMW billing model', 'Region model: zm-lus-1'],
    liveUrl: 'https://denuel-dev-control-plane.vercel.app/',
  },
  {
    id: 'kulima-farm-marketplace',
    title: 'Kulima Farm Marketplace',
    purpose: 'A digital marketplace designed to help farmers publish products and connect with buyers',
    image: '',
    techStack: ['Next.js', 'React', 'TypeScript', 'Responsive UI', 'Vercel', 'Marketplace UX'],
    problemSolved: 'Farmers need a low-friction way to present products online, reach more buyers, and participate in a digital marketplace without requiring complex technical setup.',
    systemLogic: 'The platform organizes farmer onboarding, product listings and buyer discovery into a mobile-friendly marketplace flow. The launch strategy prioritizes free registration to build supply and demand before introducing monetization.',
    outcome: 'A deployed marketplace product focused on Zambian agricultural commerce, farmer onboarding and future transaction-based growth.',
    featured: false,
    role: 'Product & Full-Stack Engineer',
    status: 'Deployed / Growth Stage',
    architecture: ['Farmer onboarding', 'Product catalogue', 'Marketplace discovery', 'Responsive web application', 'Vercel deployment'],
    highlights: ['Farmer-first onboarding', 'Mobile-responsive experience', 'Public deployment', 'Growth-focused launch model'],
    liveUrl: 'https://kulimafarm-com.vercel.app/',
  },
  {
    id: 'industrial-powder-measuring-system',
    title: 'Industrial Powder Measuring & Sorting System',
    purpose: 'Offline ESP32 automation for product presence detection, powder leveling, measurement and accept/reject sorting',
    image: '',
    techStack: ['ESP32', 'HC-SR04', 'L298N', 'Servo', 'Conveyor', 'Vibration Motor', 'Local Web Server', 'CSV'],
    problemSolved: 'Manual powder-level inspection is inconsistent and difficult to audit. A repeatable process is needed to detect a product, level the powder, measure it and automatically classify the result.',
    systemLogic: 'A presence sensor stops the conveyor, a vibration stage levels the powder for a fixed interval, and a second ultrasonic sensor measures the level. The controller applies acceptance thresholds, drives indicators and a reject servo, then records the cycle to the local dashboard.',
    outcome: 'An offline-first industrial prototype with automatic and manual modes, session tracking, accepted/rejected counters, CSV history and local browser control.',
    featured: false,
    role: 'Embedded Systems Engineer',
    status: 'Working Prototype',
    architecture: ['Presence sensing', 'Conveyor control', '5-second leveling stage', 'Level measurement', 'Decision engine', 'Reject actuator', 'Offline dashboard'],
    highlights: ['Dual-sensor workflow', 'Automatic sorting sequence', 'Offline web dashboard', 'Exportable history'],
  },
  {
    id: 'esp32-cutter-robot',
    title: 'ESP32 Cutter Robot',
    purpose: 'Wi-Fi controlled mobile robotics platform with obstacle awareness and safety feedback',
    image: '',
    techStack: ['ESP32', 'L298N', 'Ultrasonic Sensors', 'Servo', 'LDR', 'Web UI', 'LEDs', 'Buzzer'],
    problemSolved: 'Remote mobile equipment needs reliable directional control, clear status feedback and obstacle awareness without depending on cloud connectivity.',
    systemLogic: 'The ESP32 creates a local control interface for driving and machine functions. Rear obstacle sensing protects reversing, while a front sensor can support autonomous avoidance. LEDs and buzzer patterns communicate direction and safety states.',
    outcome: 'A modular robotics control platform combining local Wi-Fi control, motor driving, obstacle detection, feedback indicators and autonomous fallback concepts.',
    featured: false,
    role: 'Robotics & Embedded Developer',
    status: 'Prototype',
    architecture: ['Local Wi-Fi control', 'ESP32 motion controller', 'Dual ultrasonic sensing', 'Servo scanning', 'Motor driver', 'LED/buzzer feedback'],
    highlights: ['Local web control', 'Rear reverse protection', 'Autonomous fallback design', 'Status lighting'],
  },
  {
    id: 'aquawatch-nrw',
    title: 'AquaWatch NRW Intelligence',
    purpose: 'Water-loss monitoring architecture for DMA-based non-revenue-water analysis and leak prioritisation',
    image: '',
    techStack: ['ESP32', 'Flow/Pressure Sensors', 'DMA Analytics', 'Next.js', 'Time-Series Data', 'Decision Engine'],
    problemSolved: 'Water utilities need better visibility into district-level losses so field teams can prioritize investigations instead of relying only on reactive leak reporting.',
    systemLogic: 'Field nodes collect measurement data, DMA inlet values are compared against consumption and expected behaviour, and an analytics layer flags abnormal patterns for investigation and reporting.',
    outcome: 'A field-to-dashboard concept covering sensing, NRW calculation, anomaly analysis, decision support and operational reporting.',
    featured: false,
    role: 'IoT Systems Architect',
    status: 'Engineering Concept / Pilot Design',
    architecture: ['Field sensor nodes', 'DMA ingestion', 'NRW calculation', 'Time-series analytics', 'Decision engine', 'Operations dashboard'],
    highlights: ['DMA-oriented design', 'Field IoT architecture', 'Anomaly prioritisation', 'Operational reporting'],
  },
  {
    id: 'quotation-platform',
    title: 'Astro City CRM — Quotation & Operations Platform',
    purpose: 'End-to-end business operations platform for customer management, quotations, orders, payments, receipts, reporting and administrative workflows',
    image: '/images/projects/quotation-platform-hero.webp',
    techStack: ['Next.js', 'React', 'TypeScript', 'Dashboard UI', 'Business Workflows', 'Reporting', 'Responsive Web App', 'Vercel'],
    problemSolved: 'Growing businesses lose visibility when quotations, customer records, payments, receipts, orders and follow-ups are spread across manual documents and disconnected tools.',
    systemLogic: 'The platform brings customer onboarding, products and services, quotations, discount requests, orders, invoices, receipts, payments, reporting, inventory and administration into one workspace. The dashboard surfaces revenue, outstanding balances, active orders, recent activity and sales-pipeline information, while the navigation organizes day-to-day operational workflows.',
    outcome: 'A deployed mobile-responsive CRM and quotation platform that consolidates sales and administrative workflows into a single business workspace.',
    featured: true,
    role: 'Full-Stack Developer',
    status: 'Production / Deployed',
    architecture: ['Authentication & customer onboarding', 'Customer records', 'Products & services', 'Quotation & order workflows', 'Payments, receipts & invoices', 'Reporting, inventory & administration'],
    highlights: ['Business dashboard with financial and operational summaries', 'Quotation and customer workflows', 'Payments, receipts and invoice modules', 'Sales pipeline and activity history', 'Inventory, reporting and company administration', 'Mobile-responsive workspace'],
    liveUrl: 'https://quotetion.vercel.app/',
    websiteUrl: 'https://quotetion.vercel.app/store/denuel-2',
    media: [
      {
        src: '/images/projects/quotation-platform-hero.webp',
        alt: 'Astro City CRM screens showing the login experience, business dashboard and quotation activity workspace',
        caption: 'Real production screens from the Astro City CRM quotation and business-operations platform.',
        type: 'screenshot',
        fit: 'cover',
      },
    ],
  },
  {
    id: 'constituency226',
    title: 'Constituency226 Civic Information Platform',
    purpose: 'Mobile-first civic information platform for candidate discovery, constituency information, election pages, manifesto profiles and civic education',
    image: '/images/projects/constituency226-hero.webp',
    techStack: ['Next.js', 'React', 'TypeScript', 'Responsive UI', 'Content Management', 'Search', 'Editorial Workflows', 'Vercel'],
    problemSolved: 'Public civic information can be fragmented across different sources and difficult to navigate on mobile devices. The platform needed a clear structure for discovering candidates, constituencies, election information, civic guides and related public records.',
    systemLogic: 'The platform organizes public information into candidate, constituency, election, manifesto, civic-education and development-tracking experiences. Search and mobile-first navigation help visitors move between published records, while editorial workflows support structured content presentation and source/context fields.',
    outcome: 'A deployed responsive civic-information website that turns a large set of public records and civic content into a structured, searchable user experience.',
    featured: false,
    role: 'Web Platform Developer',
    status: 'Production / Live',
    architecture: ['Public homepage & search', 'Candidate discovery', 'Constituency navigation', 'Election & manifesto pages', 'Civic education content', 'Editorial/admin content workflows'],
    highlights: ['Mobile-first civic information layout', 'Candidate and constituency discovery', 'Election and manifesto content sections', 'Searchable published records', 'Civic education and development-tracker sections', 'Responsive design across public pages'],
    liveUrl: 'https://constituency226.org/',
    websiteUrl: 'https://constituency226.org/',
    media: [
      {
        src: '/images/projects/constituency226-hero.webp',
        alt: 'Constituency226 mobile screens showing the civic homepage, candidate discovery and manifesto information sections',
        caption: 'Real mobile screens from Constituency226 showing civic discovery, candidate information and public-information interfaces.',
        type: 'screenshot',
        fit: 'cover',
      },
    ],
  },

]

export const legacyProjectIds = new Set([
  'smart-irrigation',
  'bottle-sorting-system',
  'oil-level-monitoring',
])

export function mergeWithCurrentCatalog(data: unknown): Project[] {
  if (!Array.isArray(data)) return defaultProjects

  const incoming = data.filter((item): item is Project => Boolean(item && typeof item === 'object' && 'id' in item))
  const customProjects = incoming.filter(project => !legacyProjectIds.has(project.id) && !defaultProjects.some(current => current.id === project.id))

  return [...defaultProjects, ...customProjects]
}
