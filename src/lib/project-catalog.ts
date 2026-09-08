export interface ProjectMedia {
  id: string
  type: 'image' | 'video'
  url: string
  title?: string
  caption?: string
}

export interface ProjectDocument {
  id: string
  title: string
  url: string
  type: 'case-study' | 'technical' | 'presentation' | 'report' | 'other'
  fileName?: string
  fileSize?: string
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
  documents?: ProjectDocument[]
  publishStatus?: 'draft' | 'published'
  caseStudy?: string
  cvHighlights?: string[]
  createdAt?: string
  updatedAt?: string
}

export const defaultProjects: Project[] = [
  {
    id: 'smart-cooking-oil-dispenser',
    title: 'Smart Cooking Oil Dispenser',
    purpose: 'Automated pay-by-amount or pay-by-volume dispensing with operator accountability and cloud telemetry',
    image: '',
    techStack: ['ESP32 WROOM-32D', 'Flow Sensor', 'SIM800', '4×4 Keypad', 'I2C LCD', 'Next.js', 'REST API', 'NVS'],
    problemSolved: 'Small and medium cooking-oil retailers need accurate dispensing, clear operator accountability, and reliable sales records even when internet connectivity is unstable.',
    systemLogic: 'An operator signs in with a PIN, selects an amount or target volume, and the ESP32 converts the request into a dispensing target. Flow pulses are measured continuously, the pump stops automatically at the target, and sales data is queued locally when offline before syncing to the web platform.',
    outcome: 'A commercial-ready IoT architecture combining embedded control, offline recovery, operator sales tracking, telemetry, receipts, and a web management dashboard.',
    featured: true,
    role: 'Lead Embedded & Full-Stack Engineer',
    status: 'Prototype / Commercial Development',
    architecture: ['Operator keypad + LCD', 'ESP32 control layer', 'Flow sensor + pump driver', 'Offline NVS queue', 'REST telemetry API', 'Owner dashboard'],
    highlights: ['Automatic target cut-off', 'Operator PIN verification', 'Offline-first operation', 'Sales and telemetry records'],
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
    featured: true,
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
    featured: true,
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
    featured: true,
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
    title: 'Quotation & Operations Platform',
    purpose: 'Web application for operational documents, quotation workflows and dashboard-based administration',
    image: '',
    techStack: ['Next.js', 'React', 'Dashboard UI', 'Document Workflows', 'Vercel'],
    problemSolved: 'Manual document and quotation workflows become difficult to track as operational volume grows, especially when files move between reporting and administrative processes.',
    systemLogic: 'The system centralizes dashboard workflows, document handling and operational actions inside a browser-based interface designed for repeatable administrative use.',
    outcome: 'A deployed web platform that demonstrates practical workflow digitization and dashboard-driven operations.',
    featured: false,
    role: 'Full-Stack Developer',
    status: 'Deployed',
    architecture: ['Dashboard UI', 'Document workflow', 'Operational actions', 'Web deployment'],
    highlights: ['Centralized workflow', 'Browser-based administration', 'Deployed application'],
    liveUrl: 'https://quotetion.vercel.app/dashboard/',
  },
]

export const legacyProjectIds = new Set([
  'smart-irrigation',
  'bottle-sorting-system',
  'oil-level-monitoring',
  'smart-walking-stick',
])

export function isProjectPublished(project: Project) {
  return project.publishStatus !== 'draft'
}

export function mergeWithCurrentCatalog(data: unknown): Project[] {
  if (!Array.isArray(data)) return defaultProjects

  const incoming = data.filter(
    (item): item is Project => Boolean(item && typeof item === 'object' && 'id' in item)
  )

  const mergedDefaults = defaultProjects.map(current => {
    const saved = incoming.find(project => project.id === current.id)
    return saved ? { ...current, ...saved } : current
  })

  const customProjects = incoming.filter(
    project =>
      !legacyProjectIds.has(project.id) &&
      !defaultProjects.some(current => current.id === project.id)
  )

  return [...mergedDefaults, ...customProjects]
}
