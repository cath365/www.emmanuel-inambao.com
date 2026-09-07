export interface CaseStudy {
  slug: string
  title: string
  subtitle: string
  overview: string
  status: string
  timeline: string
  role: string
  challenge: string[]
  solution: string[]
  results: { value: string; label: string; description: string }[]
  technologies: string[]
  architecture: string[]
  links?: { label: string; href: string }[]
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'smart-cooking-oil-dispenser',
    title: 'Smart Cooking Oil Dispenser',
    subtitle: 'Offline-first embedded dispensing with operator control, flow measurement and web telemetry',
    overview: 'This system combines an ESP32-based dispenser controller with a web management layer. The design focuses on accurate target-based dispensing, operator accountability, offline continuity and auditable sales records for cooking-oil retail operations.',
    status: 'Prototype / Commercial Development',
    timeline: 'Multi-phase product development',
    role: 'Lead Embedded & Full-Stack Engineer',
    challenge: [
      'Dispensing must stop automatically at a requested amount or volume instead of relying on manual timing.',
      'Operators need individual access control so sales can be attributed correctly.',
      'Connectivity can be unreliable, so the device cannot depend on the cloud to complete a sale.',
      'Owners need usable sales and device telemetry without making the embedded workflow fragile.',
    ],
    solution: [
      'Use flow-sensor pulses as the primary measurement input and continuously calculate dispensed volume.',
      'Verify an operator PIN before enabling sales and preserve an offline fallback path where required.',
      'Queue receipts and telemetry locally in non-volatile storage when the network is unavailable.',
      'Expose device configuration, verification, telemetry and receipt workflows through REST endpoints and a web dashboard.',
    ],
    results: [
      { value: 'Automatic', label: 'Target cut-off', description: 'The pump is stopped by measured dispensing progress rather than operator timing.' },
      { value: 'Offline-first', label: 'Continuity', description: 'Local operation and queued synchronization reduce dependency on constant connectivity.' },
      { value: 'Traceable', label: 'Operator sales', description: 'Operator identity can be associated with individual dispensing events.' },
      { value: 'Dual mode', label: 'Sales input', description: 'The design supports selling by requested amount or requested volume.' },
    ],
    technologies: ['ESP32 WROOM-32D', 'Flow Sensor', 'SIM800', '4×4 Keypad', 'I2C LCD', 'NVS', 'Next.js', 'REST API'],
    architecture: ['Keypad + LCD operator interface', 'ESP32 transaction state machine', 'Flow pulse measurement', 'Pump/relay control', 'Offline receipt queue', 'Cloud API + owner dashboard'],
  },
  {
    slug: 'denuel-dev',
    title: 'Denuel-dev Control Plane',
    subtitle: 'A Zambia-focused PaaS architecture for projects, deployments, infrastructure and local billing',
    overview: 'Denuel-dev is designed as a control plane rather than a simple hosting page. The platform models organizations, projects, Git integrations, deployments, workloads, domains, environment variables, databases, usage and billing so it can evolve toward a complete developer platform.',
    status: 'Active Development',
    timeline: 'Phased platform build',
    role: 'Founder & Platform Engineer',
    challenge: [
      'A deployment platform needs strong organization and permission boundaries before compute features scale.',
      'Git integration, deployment orchestration and workload state must remain modular rather than being tightly coupled to the UI.',
      'The product needs concepts that make sense for Zambian teams, including ZMW billing and a Lusaka region model.',
      'Auditability and future managed services need to be part of the data model from the beginning.',
    ],
    solution: [
      'Model users, organizations, membership roles, projects and audit events as first-class entities.',
      'Separate Git integration, deployment records and queue-oriented execution concepts from the presentation layer.',
      'Define compute nodes, workloads, domains, environment variables and database instances as platform resources.',
      'Design subscription, usage, invoice and payment entities around a locally relevant ZMW billing strategy.',
    ],
    results: [
      { value: 'RBAC', label: 'Organizations', description: 'Role-based membership and audit concepts provide a safer multi-tenant foundation.' },
      { value: 'Queue', label: 'Deployments', description: 'Deployment work is modeled for asynchronous worker execution instead of blocking requests.' },
      { value: 'ZMW', label: 'Billing model', description: 'The commercial model is designed around local currency and regional users.' },
      { value: 'zm-lus-1', label: 'Region model', description: 'The architecture starts with a Lusaka-oriented compute region concept.' },
    ],
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Neon', 'GitHub Integration', 'REST APIs', 'Queues', 'RBAC'],
    architecture: ['Authentication + organizations', 'Project control plane', 'Git integration', 'Deployment API + queue', 'Compute/workload model', 'Usage + billing model'],
    links: [{ label: 'Live control plane', href: 'https://denuel-dev-control-plane.vercel.app/' }],
  },
  {
    slug: 'kulima-farm-marketplace',
    title: 'Kulima Farm Marketplace',
    subtitle: 'A farmer-first digital marketplace built around simple onboarding and buyer discovery',
    overview: 'Kulima Farm is a deployed marketplace product intended to help farmers create a digital presence for their products and connect with buyers. The product strategy prioritizes removing onboarding friction first, then building sustainable monetization after marketplace activity grows.',
    status: 'Deployed / Growth Stage',
    timeline: 'Iterative product development',
    role: 'Product & Full-Stack Engineer',
    challenge: [
      'Farmers need a simple path to list products without learning complex e-commerce tooling.',
      'The marketplace must work well on mobile devices where many users will access it.',
      'A new two-sided marketplace needs enough sellers and listings before charging users aggressively.',
      'The product needs a clear local identity instead of feeling like a generic international marketplace template.',
    ],
    solution: [
      'Design a direct farmer registration and product-listing workflow with a mobile-first interface.',
      'Use public product discovery to reduce friction between sellers and potential buyers.',
      'Launch with free registration to prioritize marketplace liquidity and user acquisition.',
      'Build the experience as a modular Next.js application that can add payments, messaging and verification later.',
    ],
    results: [
      { value: 'Live', label: 'Public deployment', description: 'The marketplace is deployed and available for real-world onboarding and product discovery.' },
      { value: 'Free launch', label: 'Adoption strategy', description: 'Early onboarding is optimized for growth before introducing fees.' },
      { value: 'Mobile-first', label: 'User experience', description: 'The interface is designed to remain usable on common mobile screens.' },
      { value: 'Zambia', label: 'Market focus', description: 'Positioning and growth strategy are tailored to local agricultural commerce.' },
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'Responsive UI', 'Vercel', 'Marketplace UX'],
    architecture: ['Farmer onboarding', 'Product catalogue', 'Buyer discovery', 'Responsive frontend', 'Deployment + analytics foundation'],
    links: [{ label: 'Visit Kulima Farm', href: 'https://kulimafarm-com.vercel.app/' }],
  },
  {
    slug: 'industrial-powder-system',
    title: 'Industrial Powder Measuring & Sorting System',
    subtitle: 'Offline ESP32 automation for leveling, measurement, acceptance decisions and rejection handling',
    overview: 'This industrial prototype automates a repeatable quality-control sequence around an open product container. It detects product presence, stops the conveyor, levels the powder using vibration, measures the resulting level and automatically accepts or rejects the item.',
    status: 'Working Prototype',
    timeline: 'Embedded prototyping and calibration',
    role: 'Embedded Systems Engineer',
    challenge: [
      'Powder needs to be levelled before measurement or the ultrasonic reading becomes inconsistent.',
      'The machine must coordinate conveyor motion, vibration, sensing and rejection in the correct order.',
      'The system needs to remain usable without internet access on the production floor.',
      'Operators need clear counters and history for accepted and rejected products.',
    ],
    solution: [
      'Use one ultrasonic sensor for product presence and a second sensor for the measurement stage.',
      'Stop the conveyor and run a fixed vibration cycle before taking the quality measurement.',
      'Apply acceptance thresholds in the ESP32 decision logic and drive LEDs, buzzer and reject servo accordingly.',
      'Host a local web dashboard with automatic/manual modes, counters, session data and CSV export.',
    ],
    results: [
      { value: '2 sensors', label: 'Sensing workflow', description: 'Presence detection and measurement are separated for clearer control logic.' },
      { value: '5 seconds', label: 'Leveling stage', description: 'A fixed vibration stage is used before measurement to improve repeatability.' },
      { value: 'Offline', label: 'Web dashboard', description: 'The operator interface runs locally from the ESP32 access point.' },
      { value: 'CSV', label: 'History', description: 'Production sessions can be recorded and exported for review.' },
    ],
    technologies: ['ESP32', 'HC-SR04', 'L298N', 'Servo', 'Conveyor Motor', 'Vibration Motor', 'HTML/CSS/JS', 'CSV'],
    architecture: ['Presence sensor', 'Conveyor controller', 'Vibration leveling stage', 'Measurement sensor', 'Decision engine', 'Reject mechanism', 'Local dashboard'],
  },
]

export const caseStudiesBySlug = Object.fromEntries(caseStudies.map(study => [study.slug, study])) as Record<string, CaseStudy>
