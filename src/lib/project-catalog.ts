export interface ProjectMedia {
  src: string
  alt: string
  caption?: string
  type?: 'photo' | 'screenshot' | 'diagram'
  fit?: 'cover' | 'contain'
}

export interface ProjectEvidence {
  label: string
  type: 'Prototype' | 'Photo' | 'Video' | 'Live application' | 'Repository' | 'Document' | 'Testing' | 'Deployment' | 'Event' | 'Other'
  description?: string
  url?: string
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
  projectType?: string
  organization?: string
  contribution?: string
  problemTagline?: string
  domain?: string
  targetUsers?: string
  whyItMatters?: string
  solutionSummary?: string
  roleAreas?: string[]
  measuredImpact?: string
  expectedImpact?: string
  constraints?: string[]
  nextMilestone?: string
  evidence?: ProjectEvidence[]
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
    outcome: 'A working prototype architecture combining embedded control, offline recovery, operator sales tracking, telemetry, receipts and a web-management path. Field calibration and production hardening remain future work.',
    featured: false,
    role: 'Embedded Systems & Full-Stack Developer',
    status: 'Prototype / Commercial Development',
    projectType: 'Research & Development',
    organization: 'Independent R&D',
    contribution: 'Built and developed by me',
    problemTagline: 'Making small-scale liquid dispensing more accurate, traceable and resilient when connectivity is unreliable.',
    domain: 'Business Systems & Automation',
    targetUsers: 'Small and medium cooking-oil retailers, operators and business owners who need reliable dispensing and sales records.',
    whyItMatters: 'Manual dispensing can create inconsistent quantities, weak transaction records and poor operator accountability, especially when digital systems depend on continuous internet access.',
    solutionSummary: 'A connected dispenser that measures flow, stops the pump at a defined target, records operator activity and keeps transactions locally when the network is unavailable.',
    roleAreas: ['Problem analysis', 'System architecture', 'Hardware selection', 'Embedded firmware', 'Backend development', 'Dashboard development', 'IoT integration', 'Testing'],
    expectedImpact: 'Designed to improve dispensing consistency, operator accountability and visibility into sales activity without requiring constant connectivity.',
    constraints: ['Flow calibration must be validated under real dispensing conditions.', 'Pump, power and enclosure design require field hardening before commercial deployment.'],
    nextMilestone: 'Complete repeatable flow calibration and field-oriented hardware validation.',
    evidence: [
      { label: 'Embedded dispenser prototype', type: 'Prototype', description: 'Hardware prototype showing the ESP32 controller, display, GSM module and pump-control path.' },
    ],
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
    domain: 'Robotics & Embedded Systems',
    title: 'Denuel One Pro AI X',
    purpose: 'ESP32 smart-device platform integrating touch UI, camera, GSM, Wi-Fi/Bluetooth, OTA and AI-assistant capabilities',
    image: '',
    techStack: ['ESP32', 'Touch Display', 'ESP32-CAM', 'SIM800', 'Wi-Fi', 'Bluetooth', 'OTA', 'Embedded UI'],
    problemSolved: 'Low-cost embedded devices often become isolated prototypes. This project explores how one compact platform can combine local UI, connectivity, camera, communication and AI-ready services in a maintainable embedded architecture.',
    systemLogic: 'The ESP32 runs the device interface and coordinates modular services for touch input, connectivity, camera access, GSM communication and status indicators. Features are separated so camera, calls/SMS, Wi-Fi/Bluetooth, OTA and AI-assistant integration can evolve without rewriting the entire interface.',
    outcome: 'An active R&D smart-device platform that demonstrates a reusable embedded architecture for connected products rather than a single-purpose microcontroller demo.',
    featured: false,
    role: 'Embedded Systems & Product Developer',
    status: 'Active R&D / Prototype',
    projectType: 'Research & Development',
    organization: 'Personal R&D',
    contribution: 'Built by me',
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
    role: 'Robotics & IoT Engineer',
    status: 'Prototype / Active Development',
    projectType: 'Research & Development',
    organization: 'Robotix Institute',
    contribution: 'Team / R&D contribution',
    problemTagline: 'Helping people with visual impairments understand obstacles and receive directional guidance while moving.',
    domain: 'Accessibility',
    targetUsers: 'People with visual impairments who need additional obstacle awareness and navigation support in everyday environments.',
    whyItMatters: 'A simple proximity alarm can indicate that an obstacle exists without explaining what it is or which direction may be safer. Assistive mobility requires timely information that is useful while the person is moving.',
    solutionSummary: 'An assistive mobility prototype combining obstacle sensors and a camera on the stick with smartphone processing and spoken guidance through a wireless headset.',
    roleAreas: ['Problem analysis', 'System architecture', 'Hardware selection', 'Sensor integration', 'IoT integration', 'Mobile/AI workflow planning', 'Prototype testing', 'Technical project coordination'],
    expectedImpact: 'Designed to improve obstacle awareness and provide more useful navigation guidance than a proximity alert alone.',
    constraints: ['Guidance latency must remain low enough for safe use.', 'Computer-vision and cloud features require careful fallback behaviour when connectivity is weak.', 'Assistive guidance requires validation with users before any safety claims can be made.'],
    nextMilestone: 'Continue prototype integration and validate directional guidance behaviour with controlled obstacle scenarios.',
    evidence: [
      { label: 'Obstacle-detection sensor prototype', type: 'Prototype', description: 'Ultrasonic ranging hardware used during obstacle-detection development.' },
    ],
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
    domain: 'Health Technology',
    title: 'The Spot App',
    purpose: 'Production women’s-health mobile application for cycle education, tracking, phase information and administrative communication',
    image: '/images/projects/the-spot-hero.webp',
    techStack: ['React Native', 'Expo', 'Android', 'iOS', 'Google Play', 'App Store', 'Mobile UX', 'Admin Dashboard'],
    problemSolved: 'The product needed a more reliable mobile experience, clearer cycle-tracking information and a stable path to production distribution on both major mobile platforms.',
    systemLogic: 'The application combines cycle tracking and prediction, menstrual-phase education and user-facing content with an administrative communication layer. Deployment work includes production build stabilization and release workflows for Android and iOS.',
    outcome: 'A production mobile application released on Android and iOS after stabilization, deployment and product improvements.',
    featured: false,
    role: 'Mobile App & Deployment Developer',
    status: 'Production / Released',
    projectType: 'Client Project',
    organization: 'Client project',
    contribution: 'Contributed to development and deployment',
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
    domain: 'Developer Infrastructure',
    title: 'Denuel-dev Cloud Platform',
    purpose: 'A Zambia-focused platform-as-a-service control plane for application deployments and managed infrastructure',
    image: '',
    techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Neon', 'GitHub', 'Queues', 'REST APIs', 'RBAC'],
    problemSolved: 'Local developers and teams need a simpler deployment platform with organization access control, deployment workflows, local billing concepts, and infrastructure abstractions that can grow beyond a basic hosting dashboard.',
    systemLogic: 'The control plane models organizations, projects, repositories, deployments, domains, environment variables, workloads, databases, usage records, subscriptions and audit logs. Git integration feeds deployment jobs into a queue-oriented workflow.',
    outcome: 'A modular control-plane foundation with authentication, organization RBAC, audit logging, GitHub integration, deployment APIs, queue concepts and a Lusaka region model.',
    featured: false,
    role: 'Platform Engineer',
    status: 'Active Development',
    projectType: 'Internal Project',
    organization: 'Independent product',
    contribution: 'Built and developed by me',
    architecture: ['Next.js control plane', 'RBAC + audit layer', 'GitHub integration', 'Deployment queue', 'PostgreSQL data model', 'Compute/workload abstraction'],
    highlights: ['Organization RBAC', 'Deployment API', 'ZMW billing model', 'Region model: zm-lus-1'],
    liveUrl: 'https://denuel-dev-control-plane.vercel.app/',
  },
  {
    id: 'kulima-farm-marketplace',
    domain: 'Agriculture',
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
    projectType: 'Production',
    organization: 'Independent product',
    contribution: 'Built and developed by me',
    architecture: ['Farmer onboarding', 'Product catalogue', 'Marketplace discovery', 'Responsive web application', 'Vercel deployment'],
    highlights: ['Farmer-first onboarding', 'Mobile-responsive experience', 'Public deployment', 'Growth-focused launch model'],
    liveUrl: 'https://kulimafarm-com.vercel.app/',
  },
  {
    id: 'industrial-powder-measuring-system',
    domain: 'Automation',
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
    projectType: 'Prototype',
    organization: 'Independent R&D',
    contribution: 'Built and tested by me',
    architecture: ['Presence sensing', 'Conveyor control', '5-second leveling stage', 'Level measurement', 'Decision engine', 'Reject actuator', 'Offline dashboard'],
    highlights: ['Dual-sensor workflow', 'Automatic sorting sequence', 'Offline web dashboard', 'Exportable history'],
  },
  {
    id: 'esp32-cutter-robot',
    domain: 'Robotics & Automation',
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
    projectType: 'Educational / Prototype',
    organization: 'Independent robotics project',
    contribution: 'Built and tested by me',
    architecture: ['Local Wi-Fi control', 'ESP32 motion controller', 'Dual ultrasonic sensing', 'Servo scanning', 'Motor driver', 'LED/buzzer feedback'],
    highlights: ['Local web control', 'Rear reverse protection', 'Autonomous fallback design', 'Status lighting'],
  },
  {
    id: 'aquawatch-nrw',
    title: 'AI Water Leak Detection R&D (AquaWatch NRW)',
    purpose: 'Water-loss monitoring architecture for DMA-based non-revenue-water analysis and leak prioritisation',
    image: '',
    techStack: ['ESP32', 'Flow/Pressure Sensors', 'DMA Analytics', 'Next.js', 'Time-Series Data', 'Decision Engine'],
    problemSolved: 'Water utilities need better visibility into district-level losses so field teams can prioritize investigations instead of relying only on reactive leak reporting.',
    systemLogic: 'Field nodes collect measurement data, DMA inlet values are compared against consumption and expected behaviour, and an analytics layer flags abnormal patterns for investigation and reporting.',
    outcome: 'A field-to-dashboard concept covering sensing, NRW calculation, anomaly analysis, decision support and operational reporting.',
    featured: true,
    role: 'IoT Systems Architect / Technical Project Planner',
    status: 'Research & Development / Pilot Design',
    projectType: 'Research & Development',
    organization: 'R&D project',
    contribution: 'Planned and designed by me',
    problemTagline: 'Identifying abnormal water behaviour earlier so possible losses can be investigated before they become harder to trace.',
    domain: 'Water & Climate',
    targetUsers: 'Water utility operators, technical teams and pilot-area managers responsible for monitoring network behaviour and investigating water loss.',
    whyItMatters: 'Leaks, abnormal consumption, tank behaviour and supply events can remain hidden when operators do not have continuous flow and pressure visibility across a defined zone.',
    solutionSummary: 'A research architecture combining flow, pressure and where applicable tank-level measurements with time-series analysis, water-balance logic and anomaly detection to flag unusual behaviour for investigation.',
    roleAreas: ['Problem analysis', 'Research planning', 'System architecture', 'Sensor planning', 'IoT design', 'Data/AI experimentation', 'Pilot planning', 'Technical documentation'],
    expectedImpact: 'Designed to help technical teams identify abnormal water behaviour earlier, prioritize field investigation and build better evidence about where losses may be occurring.',
    constraints: ['Reliable detection depends on sensor placement, calibration and representative field data.', 'Customer consumption, tank filling, supply interruptions and operational events must be separated from genuine leak behaviour.', 'AI results require field verification before operational use.'],
    nextMilestone: 'Define a pilot section with known inlets/outlets, finalize sensor locations and collect baseline data for field validation.',
    evidence: [
      { label: 'R&D methodology and sensor architecture', type: 'Document', description: 'Project planning covers flow, pressure and tank-level measurements, pilot-zone definition and anomaly-detection validation.' },
    ],
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
    role: 'Full-Stack Systems Developer',
    status: 'Production / Deployed',
    projectType: 'Client Project',
    organization: 'Client project',
    contribution: 'Built and deployed by me',
    problemTagline: 'Replacing fragmented quotation, payment and customer workflows with one operational system.',
    domain: 'Business Systems',
    targetUsers: 'Businesses that manage customer records, quotations, orders, payments, receipts and follow-up across disconnected manual tools.',
    whyItMatters: 'When commercial records are spread across documents and separate tools, staff lose visibility into customer history, outstanding balances and the status of active work.',
    solutionSummary: 'A responsive business operations platform that connects customer records, products/services, quotations, orders, payments, receipts, reporting and administrative workflows.',
    roleAreas: ['Requirements analysis', 'Product planning', 'System architecture', 'Frontend development', 'Backend development', 'Business workflow design', 'Deployment', 'Testing'],
    expectedImpact: 'Designed to reduce duplicated administrative work and give staff a clearer view of customer, quotation, payment and order activity.',
    nextMilestone: 'Continue improving operational reporting and workflow automation based on real administrative use.',
    evidence: [
      { label: 'Live deployed application', type: 'Live application', description: 'Publicly accessible production deployment.', url: 'https://quotetion.vercel.app/' },
      { label: 'Production interface screenshots', type: 'Photo', description: 'Screens from the business dashboard and quotation workflow are included in the project media.' },
    ],
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
    featured: true,
    role: 'Full-Stack Platform Developer',
    status: 'Production / Live',
    projectType: 'Production',
    organization: 'Constituency226',
    contribution: 'Contributed to platform development',
    problemTagline: 'Making constituency and civic information easier to discover and navigate on mobile devices.',
    domain: 'Civic Technology',
    targetUsers: 'People looking for structured constituency, candidate and civic information through a mobile-friendly public interface.',
    whyItMatters: 'Public information can be fragmented across sources and difficult to navigate, making it harder for users to find relevant constituency and civic records in one structured experience.',
    solutionSummary: 'A mobile-first civic information platform organised around constituencies, candidate discovery, election information, manifesto pages and civic education content.',
    roleAreas: ['Frontend development', 'Full-stack platform development', 'Content workflow implementation', 'Responsive UI', 'Search/discovery implementation', 'Deployment support'],
    expectedImpact: 'Designed to make published civic information easier to discover, navigate and understand through a structured mobile-first interface.',
    nextMilestone: 'Continue improving information structure, source/context presentation and mobile discovery as the public content set grows.',
    evidence: [
      { label: 'Live civic information platform', type: 'Live application', description: 'Public deployment of the Constituency226 website.', url: 'https://constituency226.org/' },
      { label: 'Mobile interface screenshots', type: 'Photo', description: 'Project media includes real screens from the public civic-information experience.' },
    ],
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
  {
    id: 'livestock-collar-tracker',
    title: 'Livestock Collar Tracker',
    purpose: 'Solar-assisted GPS and geofencing concept for livestock location monitoring and field alerts',
    image: '',
    techStack: ['ESP32', 'GPS', 'GSM', 'Solar Charging', 'Li-ion Battery', 'Geofencing', 'SMS Alerts'],
    problemSolved: 'Livestock owners need a practical way to monitor animal location and receive alerts when an animal leaves a defined area, especially where continuous internet access is unreliable.',
    systemLogic: 'The collar combines GPS positioning with an ESP32, local power management and cellular communication. Location data is compared with a defined geofence and an alert can be sent when the animal moves outside the permitted area.',
    outcome: 'A documented R&D concept and component architecture for a field-ready livestock tracking prototype.',
    featured: false,
    role: 'Robotics & IoT Engineer / Technical Project Planner',
    status: 'Concept / Prototype Planning',
    projectType: 'Research & Development',
    organization: 'Independent R&D',
    contribution: 'Planned and designed by me',
    problemTagline: 'Helping livestock owners know when animals move outside a defined area where continuous internet access may be limited.',
    domain: 'Agriculture',
    targetUsers: 'Livestock owners and farm operators who need location awareness and geofence alerts for animals in the field.',
    whyItMatters: 'Livestock can move beyond expected grazing areas, while rural connectivity and battery life make continuous cloud tracking difficult.',
    solutionSummary: 'A collar concept combining GPS, ESP32 control, GSM alerts, geofencing and solar-assisted battery power for field monitoring.',
    roleAreas: ['Problem analysis', 'System architecture', 'Hardware selection', 'Power-system planning', 'IoT communication planning', 'Technical project planning'],
    expectedImpact: 'Designed to improve location awareness and provide timely geofence alerts without depending on continuous broadband connectivity.',
    constraints: ['Battery life, solar charging, enclosure durability and cellular coverage require field validation.'],
    nextMilestone: 'Build and field-test the collar prototype with representative battery, GPS and GSM operating conditions.',
    architecture: ['GPS positioning', 'ESP32 control', 'Geofence logic', 'GSM alert path', 'Solar + battery power', 'Mobile monitoring concept'],
    highlights: ['Geofencing', 'SMS alert concept', 'Solar-assisted field power', 'Mobile monitoring path'],
  },
  {
    id: 'zpay',
    domain: 'Business Systems',
    title: 'ZPay Fintech MVP',
    purpose: 'MVP planning for mobile-money payments, transfers, bills, airtime and QR-based merchant payments',
    image: '',
    techStack: ['Next.js', 'React Native', 'REST APIs', 'Authentication', 'Payment Integrations', 'Admin Dashboard'],
    problemSolved: 'A fintech MVP needs a clear first-release scope that can support common payment actions while keeping future bank and provider integrations modular.',
    systemLogic: 'The planned system separates consumer payment flows, merchant QR transactions, provider integrations and administrative oversight so the first release can be implemented in controlled phases.',
    outcome: 'Client-facing MVP scope, feature plan, architecture direction and phased implementation proposal.',
    featured: false,
    role: 'Full-Stack Systems Developer / Technical Project Manager',
    status: 'Client Project / MVP Planning',
    projectType: 'Client Project',
    organization: 'Client project',
    contribution: 'Planned / solution architecture',
    architecture: ['Consumer app', 'Merchant workflow', 'Payment-provider integrations', 'Admin controls', 'API layer', 'Future bank integrations'],
  },
  {
    id: 'edutrack',
    title: 'EduTrack',
    purpose: 'Client education-system planning focused on a structured digital workflow for school or learning operations',
    image: '',
    techStack: ['Next.js', 'TypeScript', 'APIs', 'Authentication', 'Admin Dashboard', 'Database Design'],
    problemSolved: 'The client needs a trustworthy implementation plan that converts education-process requirements into a structured software system.',
    systemLogic: 'The engagement is being handled as a formal client project, beginning with requirements, scope, architecture, milestones, responsibilities and implementation planning before development.',
    outcome: 'Project discovery and client-ready implementation planning in progress.',
    featured: false,
    role: 'Full-Stack Systems Developer / Technical Project Manager',
    status: 'Client Project / Planning',
    projectType: 'Client Project',
    organization: 'Client project',
    contribution: 'Planning and solution design',
    problemTagline: 'Turning education-process requirements into a structured, maintainable digital workflow.',
    domain: 'Education',
    targetUsers: 'Education teams and administrators who need clearer digital workflows for school or learning operations.',
    whyItMatters: 'Education systems can become difficult to implement when roles, data flows, administrative requirements and delivery milestones are not defined before development begins.',
    solutionSummary: 'A client-system planning engagement that converts operational requirements into scope, architecture, role-based workflows, data models and an implementation plan.',
    roleAreas: ['Requirements gathering', 'Scope definition', 'System architecture', 'Data modelling', 'Project planning', 'Documentation'],
    expectedImpact: 'Designed to reduce implementation ambiguity and provide a clear path from education requirements to a usable software system.',
    nextMilestone: 'Confirm remaining client requirements and move the approved scope into phased implementation.',
    architecture: ['Requirements discovery', 'Role-based workflows', 'Application layer', 'Data model', 'Admin workflow', 'Deployment plan'],
  },
  {
    id: 'robotix-institute-digital-platform',
    title: 'Robotix Institute Digital Platform Contribution',
    purpose: 'Ongoing contribution to Robotix Institute website and digital presence alongside engineering and programme work',
    image: '',
    techStack: ['Web Development', 'Content Systems', 'Responsive UI', 'Deployment', 'Digital Platform Support'],
    problemSolved: 'The organisation needs a maintainable digital presence that communicates programmes, technical work and institutional activities clearly.',
    systemLogic: 'Website and digital-platform improvements are handled as part of broader organisational support, with changes aligned to programme communication and operational needs.',
    outcome: 'Ongoing contribution to the organisation\'s website and digital-platform improvement work.',
    featured: false,
    role: 'Full-Stack Systems Developer',
    status: 'Ongoing Contribution',
    projectType: 'Internal Project',
    organization: 'Robotix Institute',
    contribution: 'Contributed to',
    problemTagline: 'Supporting a clearer digital presence for robotics, STEM programmes and institutional activities.',
    domain: 'Education',
    targetUsers: 'Robotix Institute audiences including learners, parents, schools, programme stakeholders and prospective partners.',
    whyItMatters: 'A technical education organisation needs a maintainable digital presence that communicates programmes and activities without relying only on informal channels.',
    solutionSummary: 'Ongoing website and digital-platform improvements aligned with programme communication and organisational needs.',
    roleAreas: ['Frontend development', 'Content-system support', 'Responsive UI', 'Deployment support'],
    expectedImpact: 'Designed to make programme and institutional information easier to access and maintain online.',
    evidence: [
      { label: 'Robotix Institute website', type: 'Live application', description: 'Current public digital-platform reference.', url: 'https://robotix-institute-jade.vercel.app/' },
    ],
    nextMilestone: 'Continue improving the platform as programme and organisational requirements evolve.',
    websiteUrl: 'https://robotix-institute-jade.vercel.app/',
  },
  {
    id: 'smart-irrigation-rd',
    title: 'Smart Irrigation R&D',
    purpose: 'Offline-capable irrigation control concept using field sensing, local automation and practical connectivity for agricultural environments',
    image: '/images/projects/smart-irrigation.svg',
    techStack: ['ESP32', 'Soil Moisture', 'Flow Monitoring', 'Tank Level', 'Pump/Valve Control', 'IoT Dashboard', 'Offline Logic'],
    problemSolved: 'Irrigation water can be wasted when watering decisions are made without reliable information about soil conditions, flow, available water and whether pumps or valves are operating as expected.',
    systemLogic: 'The concept combines soil-moisture, flow and tank-level sensing with an ESP32 control layer. Local rules can operate pumps or valves without cloud connectivity, while connected telemetry and a dashboard provide monitoring when a network is available.',
    outcome: 'A documented engineering design direction for an offline-capable smart-irrigation prototype. It is not presented as a deployed agricultural product.',
    featured: true,
    role: 'Robotics & IoT Engineer / Technical Project Planner',
    status: 'Concept / Prototype Development',
    projectType: 'Research & Development',
    organization: 'Independent R&D',
    contribution: 'Planned and designed by me',
    problemTagline: 'Reducing unnecessary irrigation water use by making field conditions visible and automating decisions locally.',
    domain: 'Agriculture',
    targetUsers: 'Farmers and agricultural operators who need practical irrigation monitoring and control in environments where connectivity may be intermittent.',
    whyItMatters: 'Overwatering, dry-soil periods, empty tanks and pump operation are difficult to manage consistently when field conditions are not measured.',
    solutionSummary: 'An offline-first irrigation system concept combining soil-moisture, flow and tank-level sensing with local pump/valve control and a monitoring dashboard.',
    roleAreas: ['Problem analysis', 'System architecture', 'Sensor planning', 'Embedded control design', 'IoT planning', 'Technical documentation'],
    expectedImpact: 'Designed to reduce avoidable irrigation water use and give operators clearer information about soil, flow and available water before acting.',
    constraints: ['Sensor calibration varies with soil and installation conditions.', 'Pump/valve power design and weatherproofing require field validation.', 'Expected water savings must be measured in a real pilot before any impact figure is claimed.'],
    nextMilestone: 'Build a field prototype and establish a baseline for water-use and soil-moisture comparison.',
    evidence: [
      { label: 'Smart irrigation design note', type: 'Document', description: 'Portfolio blog contains a design note for an offline-capable irrigation prototype.', url: '/blog/smart-irrigation-system' },
    ],
    architecture: ['Soil + flow + tank sensing', 'ESP32 local controller', 'Pump/valve actuation', 'Offline decision rules', 'Telemetry synchronization', 'Monitoring dashboard'],
    highlights: ['Offline-capable control', 'Multi-sensor water monitoring', 'Pump/valve automation concept', 'Pilot-first impact validation'],
  },
  {
    id: 'robotics-stem-project-programmes',
    title: 'Project-Based Robotics & STEM Programmes',
    purpose: 'Planning and supporting practical robotics, coding and engineering projects that students learn through building and testing',
    image: '',
    techStack: ['Arduino', 'ESP32', 'Sensors', 'Motors', 'Electronics', 'Programming', 'Robotics Projects'],
    problemSolved: 'Students can learn technical concepts in theory without enough opportunity to apply electronics, programming and engineering thinking in a complete working project.',
    systemLogic: 'Projects are planned around a learning objective, suitable difficulty level, required components, programming/electronics concepts, staged implementation and a final behaviour that students can build, test and explain.',
    outcome: 'Ongoing project-based STEM programme work through Robotix Institute, with specific programme names, dates and learner numbers kept separate unless verified.',
    featured: true,
    role: 'Robotics & IoT Engineer | Technical Project Manager',
    status: 'Ongoing Educational Project Work',
    projectType: 'Educational Project',
    organization: 'Robotix Institute',
    contribution: 'Project planning and technical programme support',
    problemTagline: 'Giving students practical engineering experience by learning through real robotics, coding and electronics projects.',
    domain: 'Education',
    targetUsers: 'Students participating in robotics, coding and engineering-learning programmes supported through Robotix Institute.',
    whyItMatters: 'Engineering concepts become easier to understand when learners can connect code, electronics and physical behaviour in a project they can test and troubleshoot.',
    solutionSummary: 'Project-based STEM programme planning that defines what learners should build, what concepts they should learn, which components are appropriate and how the work should progress from introduction to testing.',
    roleAreas: ['STEM project planning', 'Learning-objective definition', 'Component planning', 'Programming project design', 'Electronics activity design', 'Technical troubleshooting', 'Programme support'],
    expectedImpact: 'Designed to help learners develop practical understanding of programming, electronics, robotics and engineering problem-solving through hands-on work.',
    constraints: ['Programme details, learner counts and institution-specific outcomes are published only when verified.', 'Project difficulty must match available time, equipment and learner level.'],
    nextMilestone: 'Continue documenting programme-specific projects and evidence in the admin-managed institutional programme records.',
    evidence: [
      { label: 'Robotix Institute programme work', type: 'Other', description: 'The portfolio experience and institutional-program records document Emmanuel’s project-planning and technical-support responsibilities through Robotix Institute.' },
    ],
    architecture: ['Learning objective', 'Project selection', 'Component planning', 'Programming + electronics stages', 'Build and troubleshooting', 'Testing and reflection'],
    highlights: ['Project-based learning', 'Robotics and coding integration', 'Component and difficulty planning', 'Testing as part of learning'],
  }
]

export const legacyProjectIds = new Set([
  'smart-irrigation',
  'bottle-sorting-system',
  'oil-level-monitoring',
])

const legacyFeaturedByProjectId: Record<string, boolean> = {
  'denuel-one-pro-ai-x': true,
  'aquawatch-nrw': false,
}

const legacyRoleByProjectId: Record<string, string> = {
  'smart-cooking-oil-dispenser': 'Lead Embedded & Full-Stack Engineer',
  'smart-walking-stick': 'IoT & Assistive Systems Developer',
  'denuel-dev': 'Founder & Platform Engineer',
  'aquawatch-nrw': 'IoT Systems Architect',
  'quotation-platform': 'Full-Stack Developer',
  'constituency226': 'Web Platform Developer',
}

export function mergeWithCurrentCatalog(data: unknown): Project[] {
  if (!Array.isArray(data)) return defaultProjects

  const incoming = data.filter(
    (item): item is Project => Boolean(item && typeof item === 'object' && 'id' in item)
  )

  const incomingById = new Map(incoming.map(project => [project.id, project]))

  const mergedCatalog = defaultProjects.map(current => {
    const saved = incomingById.get(current.id)
    if (!saved) return current

    const merged = { ...current, ...saved }
    if (legacyRoleByProjectId[current.id] && saved.role === legacyRoleByProjectId[current.id]) {
      merged.role = current.role
    }
    if (
      Object.prototype.hasOwnProperty.call(legacyFeaturedByProjectId, current.id) &&
      saved.featured === legacyFeaturedByProjectId[current.id]
    ) {
      merged.featured = current.featured
    }
    return merged
  })

  const catalogIds = new Set(defaultProjects.map(project => project.id))
  const customProjects = incoming.filter(
    project => !catalogIds.has(project.id) && !legacyProjectIds.has(project.id)
  )

  return [...mergedCatalog, ...customProjects]
}
