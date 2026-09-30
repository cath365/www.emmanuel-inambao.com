export interface CaseStudy {
  slug: string
  title: string
  subtitle: string
  overview: string
  status: string
  timeline: string
  role: string
  projectType?: string
  organization?: string
  contribution?: string
  context?: string
  requirements?: string[]
  planning?: string[]
  testing?: string[]
  outcome?: string
  futureImprovements?: string[]
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
    role: 'Embedded Systems & Full-Stack Developer',
    projectType: 'Research & Development',
    organization: 'Independent R&D',
    contribution: 'Built and developed by me',
    context: 'The project addresses small and medium retail dispensing where accurate measurement, operator accountability and continuity during weak connectivity matter.',
    requirements: [
      'Dispense by requested amount or volume and stop automatically at the target.',
      'Associate transactions with an operator and keep usable records.',
      'Continue core dispensing behaviour when connectivity is unavailable.',
      'Provide a web management layer for sales, device status and reporting.',
    ],
    planning: [
      'Separate the embedded dispensing state machine from cloud synchronization so a network failure does not block a sale.',
      'Plan the hardware around ESP32 control, flow measurement, pump switching, local UI and GSM/Wi-Fi communications.',
      'Treat calibration, power handling, enclosure design and field reliability as prototype-to-product risks.',
    ],
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
    testing: [
      'Calibrate flow measurement against known volumes before relying on automatic cut-off.',
      'Test amount/volume dispensing, pump stop behaviour and operator PIN flows.',
      'Test offline transaction queuing and later synchronization under interrupted connectivity.',
    ],
    outcome: 'A working prototype architecture combining embedded dispensing control, operator access, local continuity and a web-management path. Commercial deployment still requires calibration, enclosure, field and reliability validation.',
    futureImprovements: [
      'Complete repeatable flow calibration across different oil viscosities and operating conditions.',
      'Harden the power, pump-driver and enclosure design for sustained field use.',
      'Expand reporting and voucher/payment workflows only after the dispensing core is validated.',
    ],
    results: [
      { value: 'Automatic', label: 'Target cut-off', description: 'The prototype logic stops the pump based on measured dispensing progress rather than operator timing.' },
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
    role: 'Platform Engineer',
    projectType: 'Internal Project',
    organization: 'Independent product',
    contribution: 'Built and developed by me',
    context: 'The project explores a Zambia-focused deployment control plane with local billing concepts and modular infrastructure management.',
    requirements: [
      'Model organizations, projects, deployments, domains, environment variables and managed resources.',
      'Keep access control and audit concepts explicit for multi-user operation.',
      'Separate deployment orchestration from the presentation layer so compute workflows can evolve independently.',
    ],
    planning: [
      'Build the control-plane data model before adding infrastructure complexity.',
      'Treat Git integration, deployment queues, workloads, usage and billing as separate modules.',
    ],
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
    testing: [
      'Validate organization membership and role boundaries across protected workflows.',
      'Test project/deployment API behaviour independently from the user interface.',
      'Exercise queue and deployment-state transitions before introducing external compute workers.',
    ],
    outcome: 'An active-development control-plane foundation for organizations, projects, Git-connected deployments, workloads, usage and local billing concepts. It is not presented as a finished hosting platform.',
    futureImprovements: [
      'Connect deployment orchestration to production-grade worker infrastructure.',
      'Expand observability, billing and managed-service workflows after control-plane validation.',
    ],
    results: [
      { value: 'RBAC', label: 'Organizations', description: 'Role-based membership and audit concepts are part of the current platform foundation.' },
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
    projectType: 'Production',
    organization: 'Independent product',
    contribution: 'Built and developed by me',
    context: 'The marketplace is designed around a simple path for farmers to list products and for buyers to discover them on mobile devices.',
    requirements: [
      'Keep farmer onboarding and product listing simple on common mobile screens.',
      'Support public product discovery without requiring a complex seller workflow.',
      'Leave room for later payments, messaging and verification without coupling them to the first release.',
    ],
    planning: [
      'Prioritize marketplace liquidity and onboarding before adding monetization complexity.',
      'Keep the application modular so transactional features can be introduced in later phases.',
    ],
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
    testing: [
      'Check farmer registration, product listing and public discovery flows on mobile screen sizes.',
      'Validate deployment and navigation before adding more transactional features.',
    ],
    outcome: 'A deployed marketplace product for farmer onboarding and buyer discovery. Growth, transaction volume and commercial outcomes are not claimed without verified data.',
    futureImprovements: [
      'Add payments, messaging and seller verification only when product usage justifies the added complexity.',
      'Use real onboarding feedback to refine the seller workflow.',
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
    projectType: 'Prototype',
    organization: 'Independent R&D',
    contribution: 'Built and tested by me',
    context: 'The prototype explores an offline quality-control sequence for products whose powder level must be stabilised before measurement and acceptance/rejection decisions.',
    requirements: [
      'Detect a product, stop the conveyor and level the powder before measurement.',
      'Measure against defined acceptance thresholds and trigger a rejection path when needed.',
      'Operate without depending on internet connectivity.',
      'Provide operator counters and history for review.',
    ],
    planning: [
      'Separate presence sensing from the measurement stage.',
      'Use a deterministic sequence for conveyor stop, vibration, measurement, decision and rejection.',
    ],
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
    testing: [
      'Repeat presence-detection and measurement cycles across different container positions.',
      'Check vibration timing and threshold stability before relying on automated rejection.',
      'Validate local dashboard counters and history export without internet access.',
    ],
    outcome: 'A working offline prototype demonstrating coordinated sensing, conveyor control, vibration, measurement and rejection logic. Production calibration and mechanical validation remain future work.',
    futureImprovements: [
      'Run repeatability tests with representative production material and containers.',
      'Refine mechanical alignment and sensor mounting before industrial deployment.',
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
  {
    slug: 'smart-walking-stick',
    title: 'AI Smart Walking Stick',
    subtitle: 'Assistive navigation R&D combining obstacle sensing, camera input, smartphone intelligence and spoken guidance',
    overview: 'The Smart Walking Stick is an assistive-technology R&D project focused on going beyond a simple obstacle alarm. The design uses sensors and a camera on the stick, a paired smartphone as the main compute layer, and headset audio to return guidance to the user.',
    status: 'Prototype / Active Development',
    timeline: 'Iterative R&D and prototype testing',
    role: 'Robotics & IoT Engineer',
    projectType: 'Research & Development',
    organization: 'Robotix Institute',
    contribution: 'Team / R&D contribution',
    context: 'The project is being developed in an assistive-technology context where visually impaired users need practical guidance without relying on holding a phone during movement.',
    requirements: [
      'Detect nearby obstacles and provide useful directional information rather than only a proximity warning.',
      'Keep sensing and camera hardware on the walking stick while using the phone as the stronger compute platform.',
      'Return guidance through audio so the user can keep hands free.',
      'Support a fast local detection path and a deeper AI-assisted scene-analysis path where connectivity allows.',
    ],
    planning: [
      'Separate sensing, communication, phone processing and audio guidance into clear system layers.',
      'Prototype obstacle sensing first before expanding scene understanding and guidance logic.',
      'Treat user safety, latency, battery use and unreliable connectivity as design constraints.',
    ],
    challenge: [
      'Obstacle distance alone does not explain which direction is safer.',
      'Image processing can be too demanding for a small microcontroller if all intelligence is placed on the stick.',
      'Guidance must be timely and simple enough to be useful while the user is moving.',
    ],
    solution: [
      'Use ultrasonic and camera inputs on the stick for environmental sensing.',
      'Send selected sensor data and image frames to a paired smartphone over local wireless communication.',
      'Use the phone for on-device detection and optional cloud-assisted analysis before producing spoken guidance.',
    ],
    testing: [
      'Validate ultrasonic obstacle detection at different distances and angles.',
      'Test local communication reliability between stick and smartphone.',
      'Evaluate guidance timing and clarity in controlled walking scenarios before broader pilot use.',
    ],
    outcome: 'A working prototype architecture and sensor-development path for directional assistive guidance. The project remains in active development and does not claim completed clinical or safety validation.',
    futureImprovements: [
      'Improve directional guidance logic using more structured obstacle and scene information.',
      'Continue user-centred testing with visually impaired participants under controlled conditions.',
      'Optimize battery use and offline operation before any wider field deployment.',
    ],
    results: [
      { value: 'Prototype', label: 'Current stage', description: 'The project is in active assistive-technology R&D rather than being presented as a finished commercial product.' },
      { value: 'Phone bridge', label: 'Compute strategy', description: 'The smartphone carries the heavier processing so the stick can remain a practical sensing device.' },
      { value: 'Audio', label: 'User feedback', description: 'Guidance is designed to return through a wireless headset instead of requiring screen interaction.' },
    ],
    technologies: ['ESP32', 'Camera', 'Ultrasonic Sensors', 'Wi-Fi/BLE', 'Mobile App', 'On-device AI', 'Cloud AI', 'Wireless Headset'],
    architecture: ['Obstacle sensors + camera', 'ESP32 communications', 'Smartphone compute bridge', 'Local detection', 'Optional cloud analysis', 'Audio guidance'],
  },
  {
    slug: 'ai-water-leak-detection',
    title: 'AI Water Leak Detection R&D',
    subtitle: 'Sensor-based water-loss detection and pilot planning using hydraulic modelling, anomaly detection and field validation',
    overview: 'This R&D project explores how flow, pressure and related operational measurements can be combined with hydraulic modelling and anomaly-detection methods to identify abnormal water loss, estimate leak severity and narrow the likely affected section.',
    status: 'Research & Development / Pilot Design',
    timeline: 'Methodology design and pilot planning',
    role: 'IoT Systems Architect / Technical Project Planner',
    projectType: 'Research & Development',
    organization: 'R&D project',
    contribution: 'Planned and designed by me',
    context: 'The work is structured around a defined pilot section so measurements and AI outputs can be compared with known operating conditions instead of making unsupported network-wide claims.',
    requirements: [
      'Measure flow at the inlet and pressure at selected points, with tank level included where relevant.',
      'Distinguish abnormal loss from authorised consumption, tank filling, supply interruptions and other operating events.',
      'Support leak detection, leak-rate estimation and approximate location for a pilot area.',
      'Validate analytical or AI alerts against field evidence.',
    ],
    planning: [
      'Select a pilot section with known inlets, outlets and pipe connections.',
      'Define sensor positions, accuracy, recording intervals and operating assumptions before model training.',
      'Use EPANET and WNTR to simulate leak scenarios and test sensor-placement choices before field deployment.',
      'Compare simple water-balance rules and anomaly detection before deciding whether ANN/RNN models add measurable value.',
    ],
    challenge: [
      'Water loss can be confused with legitimate demand or operational events if the measurement boundary is unclear.',
      'AI performance depends on data quality, sensor placement and having enough representative normal and leak conditions.',
      'Leak location estimates must be presented as approximate unless field validation supports greater precision.',
    ],
    solution: [
      'Combine rule-based water balance with sensor time-series analysis.',
      'Use EPANET/WNTR simulation to generate and study controlled hydraulic scenarios.',
      'Evaluate scikit-learn anomaly detection and compare neural-network approaches only where they improve measurable performance.',
    ],
    testing: [
      'Run simulated normal and leak scenarios with known leak positions and rates.',
      'Compare alert outputs against water-balance calculations and hydraulic expectations.',
      'Verify selected alerts in the field before treating them as confirmed leaks.',
    ],
    outcome: 'A structured R&D methodology and pilot architecture for detecting and prioritising suspected leaks. The work is not presented as a fully validated utility-wide production system.',
    futureImprovements: [
      'Collect real pilot data for model calibration and validation.',
      'Quantify false-positive and detection performance after labelled field events are available.',
      'Refine sensor placement based on hydraulic sensitivity analysis.',
    ],
    results: [
      { value: 'Pilot', label: 'Scope', description: 'The methodology is intentionally bounded to a pilot area for validation.' },
      { value: 'Hybrid', label: 'Detection approach', description: 'Rule-based water balance and anomaly detection are compared before more complex models are justified.' },
      { value: 'EPANET/WNTR', label: 'Simulation', description: 'Hydraulic simulation supports sensor-placement and leak-scenario analysis.' },
    ],
    technologies: ['Flow Sensors', 'Pressure Sensors', 'ESP32 / IoT', 'EPANET', 'WNTR', 'scikit-learn', 'Python', 'Time-Series Analytics'],
    architecture: ['Field measurements', 'Pilot/DMA boundary', 'Hydraulic simulation', 'Water-balance rules', 'Anomaly detection', 'Dashboard / investigation output'],
  },
  {
    slug: 'the-spot-app',
    title: 'The Spot App',
    subtitle: 'Production mobile application work across cycle tracking, user experience, administration and Android/iOS deployment',
    overview: 'The Spot App is a client mobile project in the women’s-health space. My contribution focused on application development and improvement, cycle-related user flows, administrative communication and production deployment support for Android and iOS.',
    status: 'Production / Released',
    timeline: 'Client development and production release',
    role: 'Mobile App & Deployment Developer',
    projectType: 'Client Project',
    organization: 'Client project',
    contribution: 'Contributed to development and deployment',
    context: 'The client needed a more reliable production mobile experience and a clear route for maintaining and releasing the application on major mobile platforms.',
    requirements: [
      'Support mobile cycle-tracking and educational content flows.',
      'Improve interface reliability and usability on common mobile devices.',
      'Support administrative communication where required.',
      'Prepare and release production builds for Android and iOS.',
    ],
    planning: [
      'Separate product changes from store/deployment work so release risks can be handled clearly.',
      'Test production builds before submission and maintain platform-specific deployment steps.',
    ],
    challenge: [
      'Mobile release work depends on platform signing, build configuration and store requirements in addition to application code.',
      'Health-related interfaces need clear wording and reliable navigation without overstating medical capability.',
    ],
    solution: [
      'Improve application flows and cycle-related user interfaces.',
      'Maintain the Expo / React Native build path and production configuration.',
      'Support admin communication and deployment workflows.',
    ],
    testing: [
      'Validate production builds on Android and iOS release paths.',
      'Check key cycle-tracking and content navigation flows before deployment.',
    ],
    outcome: 'A released client mobile application with production deployment support and application improvements. No medical-outcome claims are made.',
    futureImprovements: [
      'Continue product iteration based on verified client and user feedback.',
      'Maintain store compatibility and release configuration as platform requirements change.',
    ],
    results: [
      { value: 'Production', label: 'Release status', description: 'The project has been released as a client mobile application.' },
      { value: 'Android + iOS', label: 'Platforms', description: 'Deployment work covers both major mobile platforms.' },
    ],
    technologies: ['React Native', 'Expo', 'Android', 'iOS', 'Mobile UX', 'Admin Dashboard'],
    architecture: ['Mobile application', 'Cycle tracking', 'Educational content', 'Admin communication', 'Android release path', 'iOS release path'],
  },
  {
    slug: 'constituency226',
    title: 'Constituency226 Civic Information Platform',
    subtitle: 'Production civic platform for candidate discovery, constituency information, public content and mobile-first navigation',
    overview: 'Constituency226 is a live civic-information platform. My contribution focused on platform development, responsive public interfaces, structured civic content, candidate and office discovery, media-management workflows and administrative functionality.',
    status: 'Production / Live',
    timeline: 'Iterative production development',
    role: 'Full-Stack Platform Developer',
    projectType: 'Production',
    organization: 'Constituency226',
    contribution: 'Contributed to platform development',
    context: 'The system needs to make complex public civic information easier to discover on mobile devices while supporting structured editorial and administrative workflows.',
    requirements: [
      'Support office-first and constituency-based public navigation.',
      'Provide candidate discovery and public-information pages in a mobile-friendly interface.',
      'Support media and content administration without exposing internal management workflows publicly.',
      'Keep project claims focused on the platform functionality rather than political endorsement or prediction.',
    ],
    planning: [
      'Structure public data around offices, constituencies, candidates and related civic content.',
      'Separate public discovery interfaces from admin and media-management workflows.',
    ],
    challenge: [
      'Large civic datasets can become difficult to navigate if information architecture is not designed around how users search.',
      'Public political information requires neutral presentation and clear separation between platform functionality and editorial claims.',
    ],
    solution: [
      'Use mobile-first navigation and searchable public records.',
      'Create structured candidate, constituency and election-content flows.',
      'Provide admin/media workflows for maintaining public content.',
    ],
    testing: [
      'Check responsive behaviour across common phone widths.',
      'Verify public navigation and candidate/constituency discovery flows.',
      'Review content presentation for neutral, structured information display.',
    ],
    outcome: 'A live responsive civic-information platform with structured public discovery and administrative content workflows.',
    futureImprovements: [
      'Continue improving data quality, source context and accessibility as the public dataset grows.',
      'Refine information architecture based on observed user navigation needs.',
    ],
    results: [
      { value: 'Live', label: 'Status', description: 'The platform is publicly deployed.' },
      { value: 'Mobile-first', label: 'Interface', description: 'Public discovery is designed for responsive use on phones and larger screens.' },
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'Responsive UI', 'Content Management', 'Search', 'Vercel'],
    architecture: ['Public search', 'Candidate discovery', 'Constituency navigation', 'Civic content', 'Editorial workflows', 'Admin/media management'],
    links: [{ label: 'Visit Constituency226', href: 'https://constituency226.org/' }],
  },
]

export const caseStudiesBySlug = Object.fromEntries(caseStudies.map(study => [study.slug, study])) as Record<string, CaseStudy>
