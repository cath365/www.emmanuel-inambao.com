export interface SkillItemData {
  name: string
  description: string
}

export interface SkillGroupData {
  id: string
  title: string
  description: string
  skills: SkillItemData[]
}

export interface ProfessionalRole {
  title: string
  description: string
}

export type ProjectFilter =
  | 'All'
  | 'AI'
  | 'IoT'
  | 'Robotics'
  | 'Mobile'
  | 'Embedded Systems'
  | 'Full-Stack'

export type ProjectScreenVariant =
  | 'assistant'
  | 'walking'
  | 'oil'
  | 'quotation'
  | 'livestock'
  | 'robotics'

export interface ProjectCaseStudy {
  overview: string
  problem: string
  solution: string
  technologies: string[]
  hardware: string[]
  workflow: string[]
  role: string
  status: string
  challenges: string[]
  futureImprovements: string[]
}

export interface ShowcaseProject {
  slug: string
  name: string
  categories: string[]
  description: string
  screenVariant: ProjectScreenVariant
  screenItems: string[]
  caseStudy: ProjectCaseStudy
}

export const skillGroups: SkillGroupData[] = [
  {
    id: 'ai-software',
    title: 'AI and Software',
    description:
      'Software engineering for intelligent products, data-driven features and connected applications.',
    skills: [
      {
        name: 'Artificial Intelligence',
        description: 'Designing AI-assisted product features and practical intelligent workflows.',
      },
      {
        name: 'Machine Learning',
        description: 'Applying ML concepts where prediction, classification or automation adds value.',
      },
      {
        name: 'Computer Vision',
        description: 'Using camera-based processing for recognition, monitoring and device interaction.',
      },
      {
        name: 'Mobile App Development',
        description: 'Building mobile experiences for monitoring, control and connected services.',
      },
      {
        name: 'Full-Stack Web Development',
        description: 'Developing complete interfaces, APIs and data-backed business workflows.',
      },
      {
        name: 'React and Next.js',
        description: 'Creating modern component-based web applications and production interfaces.',
      },
      {
        name: 'TypeScript and Node.js',
        description: 'Building typed front-end and server-side application logic.',
      },
      {
        name: 'PostgreSQL and Prisma',
        description: 'Structuring relational data and application data access with typed models.',
      },
      {
        name: 'Cloud and API Integration',
        description: 'Connecting applications, devices and cloud services through secure APIs.',
      },
      {
        name: 'UI/UX Design',
        description: 'Designing clear interfaces for technical systems and everyday users.',
      },
    ],
  },
  {
    id: 'iot-embedded',
    title: 'IoT and Embedded Systems',
    description:
      'Connected electronics that combine sensing, communication, control and reliable device software.',
    skills: [
      {
        name: 'IoT Systems',
        description: 'Designing connected-device workflows from field hardware to dashboards.',
      },
      {
        name: 'Embedded Systems',
        description: 'Developing firmware and device logic for resource-constrained hardware.',
      },
      {
        name: 'ESP32 and Arduino',
        description: 'Building prototypes and control systems with common microcontroller platforms.',
      },
      {
        name: 'GPS and Communication Systems',
        description: 'Integrating location, cellular, Wi-Fi, Bluetooth and serial communication.',
      },
    ],
  },
  {
    id: 'robotics-automation',
    title: 'Robotics and Automation',
    description:
      'Sensor-driven machines and control systems designed around repeatable physical workflows.',
    skills: [
      {
        name: 'Robotics and Automation',
        description: 'Combining sensors, actuators and control logic for practical automation.',
      },
      {
        name: 'Sensors and Actuators',
        description: 'Integrating sensing, motors, relays, servos and feedback into physical systems.',
      },
      {
        name: 'Device Control Interfaces',
        description: 'Creating manual and automatic controls for robots and embedded devices.',
      },
    ],
  },
  {
    id: 'delivery',
    title: 'Product and Project Delivery',
    description:
      'Turning technical ideas into scoped, testable systems with clear implementation priorities.',
    skills: [
      {
        name: 'Technical Project Management',
        description: 'Coordinating technical requirements, implementation tasks and delivery decisions.',
      },
      {
        name: 'Systems Architecture',
        description: 'Planning how hardware, software, communications and users fit together.',
      },
      {
        name: 'Technical Documentation',
        description: 'Documenting system behavior, integration requirements and operating workflows.',
      },
    ],
  },
]

export const professionalRoles: ProfessionalRole[] = [
  {
    title: 'Systems Engineer',
    description:
      'Designing complete technical systems that connect hardware, software, communications, data and user-facing interfaces.',
  },
  {
    title: 'IoT and Robotics Developer',
    description:
      'Building sensor-driven devices, connected control systems and practical automation using microcontrollers and embedded electronics.',
  },
  {
    title: 'Full-Stack Developer',
    description:
      'Developing responsive web applications, APIs, databases and business workflows that support real products and operations.',
  },
  {
    title: 'Mobile Application Developer',
    description:
      'Creating mobile experiences for monitoring, control, communication and service delivery across connected products.',
  },
  {
    title: 'Technical Project Manager',
    description:
      'Translating requirements into implementation plans, coordinating technical work and keeping delivery focused on the real problem.',
  },
]

export const projectFilters: ProjectFilter[] = [
  'All',
  'AI',
  'IoT',
  'Robotics',
  'Mobile',
  'Embedded Systems',
  'Full-Stack',
]

export const showcaseProjects: ShowcaseProject[] = [
  {
    slug: 'denuel-one-pro-ai-x',
    name: 'Denuel One Pro AI X',
    categories: ['AI', 'IoT', 'Embedded Systems', 'Mobile'],
    description:
      'An intelligent ESP32-based smart-device operating system with an AI assistant, camera controls, Wi-Fi, Bluetooth, SIM communication, OTA updates and real-time device status.',
    screenVariant: 'assistant',
    screenItems: ['AI assistant', 'Camera', 'Battery', 'Wi-Fi', 'Bluetooth', 'SIM status'],
    caseStudy: {
      overview:
        'Denuel One Pro AI X brings device controls, connectivity and intelligent assistance into one embedded smart-device experience.',
      problem:
        'Embedded prototypes often split camera controls, connectivity, device status and user interaction across separate interfaces, making the product harder to operate and maintain.',
      solution:
        'A unified ESP32-based device layer coordinates connectivity, camera functions, status reporting, AI-assisted interaction and update handling behind a single user experience.',
      technologies: [
        'ESP32',
        'Embedded C/C++',
        'Wi-Fi',
        'Bluetooth',
        'SIM communication',
        'OTA update workflow',
        'Mobile/device interface',
      ],
      hardware: [
        'ESP32 controller',
        'Camera module',
        'Battery and power subsystem',
        'SIM communication module',
      ],
      workflow: [
        'Boot and initialise device services',
        'Establish available connectivity',
        'Expose camera and device controls',
        'Process user or AI-assisted commands',
        'Report battery, network and device status',
        'Apply controlled OTA updates when available',
      ],
      role: 'Systems architecture, embedded development and product integration.',
      status: 'Prototype / under active development.',
      challenges: [
        'Managing several device services within embedded resource limits',
        'Keeping connectivity states understandable to the user',
        'Maintaining safe update and recovery behavior',
      ],
      futureImprovements: [
        'Stronger device identity and secure provisioning',
        'Expanded local AI capabilities',
        'Further power and memory optimisation',
      ],
    },
  },
  {
    slug: 'smart-walking-stick',
    name: 'Smart Walking Stick',
    categories: ['AI', 'Accessibility', 'IoT', 'Mobile'],
    description:
      'An AI-enabled assistive system that helps visually impaired users navigate safely using a smart stick, sensors, mobile communication and voice guidance.',
    screenVariant: 'walking',
    screenItems: ['Safe walking route', 'Obstacle detection', 'Voice guidance', 'Map', 'Smart stick', 'Assistance'],
    caseStudy: {
      overview:
        'The Smart Walking Stick combines local sensing with a connected mobile experience to support safer, more informed navigation.',
      problem:
        'A traditional walking aid provides physical feedback but cannot always communicate obstacle context, route information or remote assistance.',
      solution:
        'Sensors on the stick detect nearby obstacles while the connected application presents navigation, voice guidance, device state and assistance controls.',
      technologies: [
        'Embedded sensing',
        'Mobile application',
        'AI-assisted guidance concepts',
        'GPS/location services',
        'Voice feedback',
        'Wireless communication',
      ],
      hardware: [
        'Smart-stick controller',
        'Distance/obstacle sensors',
        'Feedback actuator or speaker',
        'Portable power system',
      ],
      workflow: [
        'Detect obstacles around the walking path',
        'Interpret distance and safety state',
        'Provide immediate local feedback',
        'Share relevant state with the mobile application',
        'Present route and voice guidance',
        'Expose assistance controls when needed',
      ],
      role: 'Assistive-system design, embedded integration and connected application development.',
      status: 'Prototype / continuing development.',
      challenges: [
        'Keeping alerts useful without overwhelming the user',
        'Balancing battery life with continuous sensing',
        'Designing dependable behavior when connectivity is limited',
      ],
      futureImprovements: [
        'More contextual obstacle classification',
        'Improved offline navigation support',
        'Expanded accessibility testing with users and organisations',
      ],
    },
  },
  {
    slug: 'cooking-oil-dispenser',
    name: 'Cooking Oil Dispenser',
    categories: ['IoT', 'Automation', 'Mobile', 'Payments'],
    description:
      'An automated dispensing system that records every transaction, supports small-value dispensing and provides business reports through a connected mobile application.',
    screenVariant: 'oil',
    screenItems: ['Dispensed quantity', 'Transactions', 'Payments', 'Reports', 'Pump status'],
    caseStudy: {
      overview:
        'The Cooking Oil Dispenser combines measured dispensing, transaction recording and connected reporting in one small-retail automation system.',
      problem:
        'Manual small-value dispensing can make quantity control, transaction records and business reporting difficult to standardise.',
      solution:
        'The dispenser converts an entered value into a target quantity, controls the pump, counts flow-sensor pulses, stops at the target and records the transaction for reporting.',
      technologies: [
        'ESP32',
        'Embedded C/C++',
        'REST API integration',
        'Offline queueing',
        'Mobile/web reporting',
        'Cellular communication',
      ],
      hardware: [
        'ESP32 WROOM-32D',
        'Flow sensor',
        'Pump and relay',
        '4x4 keypad',
        '16x2 I2C LCD',
        'SIM800 communication module',
      ],
      workflow: [
        'Operator enters or validates a dispensing value',
        'System calculates the target quantity',
        'Pump starts and flow pulses are measured',
        'Automatic cut-off stops dispensing at the target',
        'Transaction is stored locally',
        'Records synchronise to the reporting system when connectivity is available',
      ],
      role: 'Embedded firmware, device workflow, telemetry integration and product-system development.',
      status: 'Working prototype / active product development.',
      challenges: [
        'Flow-sensor calibration and repeatable measurement',
        'Reliable operation during poor network conditions',
        'Safe recovery after interrupted power or dispensing',
      ],
      futureImprovements: [
        'Further calibration and compliance testing',
        'Expanded payment and voucher integration',
        'More detailed fleet and operator reporting',
      ],
    },
  },
  {
    slug: 'quotation-management-system',
    name: 'Quotation Management System',
    categories: ['Full-Stack', 'Business Automation', 'Mobile', 'Web'],
    description:
      'A complete quotation and order management platform for businesses, including product management, customer orders, employee follow-up and receipts.',
    screenVariant: 'quotation',
    screenItems: ['Product catalogue', 'New quotation', 'Customer details', 'Order status', 'Receipt preview'],
    caseStudy: {
      overview:
        'The Quotation Management System centralises products, customer quotations, order follow-up and receipt handling in one responsive business workflow.',
      problem:
        'When quotations, products, customer details and order follow-up are handled in separate documents or chats, business records become difficult to track consistently.',
      solution:
        'A responsive full-stack platform organises catalogue data, quotation creation, customer information, order state and receipt output around one structured workflow.',
      technologies: [
        'Full-stack web application',
        'Responsive mobile interface',
        'Database-backed workflow',
        'API-based application architecture',
      ],
      hardware: [],
      workflow: [
        'Manage products and catalogue information',
        'Create a new customer quotation',
        'Track customer and order details',
        'Update follow-up or order status',
        'Generate and review the receipt record',
      ],
      role: 'Full-stack application architecture, interface development and business workflow design.',
      status: 'Working software platform / continuing development.',
      challenges: [
        'Keeping business records consistent across workflow stages',
        'Designing forms that remain efficient on mobile devices',
        'Supporting clear hand-off between staff responsibilities',
      ],
      futureImprovements: [
        'Expanded reporting and audit history',
        'Deeper customer follow-up automation',
        'Additional accounting and payment integrations',
      ],
    },
  },
  {
    slug: 'livestock-collar-tracker',
    name: 'Livestock Collar Tracker',
    categories: ['IoT', 'GPS', 'Agriculture', 'Mobile'],
    description:
      'A smart livestock monitoring system using GPS, health data, geofencing and mobile alerts to support farmers.',
    screenVariant: 'livestock',
    screenItems: ['Animal location', 'Geofence', 'Temperature', 'Battery', 'Health status', 'Map'],
    caseStudy: {
      overview:
        'The Livestock Collar Tracker is a connected agriculture concept for monitoring animal position, selected health signals and geofence state from a mobile interface.',
      problem:
        'Farmers can lose visibility of animal location and may not notice movement outside a safe area or changes in monitored health indicators quickly.',
      solution:
        'A battery-powered collar collects location and sensor data, evaluates geofence state and communicates useful updates to a mobile monitoring interface.',
      technologies: [
        'GPS',
        'IoT telemetry',
        'Mobile monitoring',
        'Geofencing',
        'Sensor data',
        'Wireless communication',
      ],
      hardware: [
        'GPS receiver',
        'Temperature sensor',
        'Battery-powered controller',
        'Communication module',
        'Collar enclosure',
      ],
      workflow: [
        'Read location and available sensor data',
        'Compare location against the configured geofence',
        'Package device health and battery state',
        'Transmit updates when communication is available',
        'Show animal status and location in the mobile application',
        'Raise an alert for relevant geofence or health conditions',
      ],
      role: 'IoT concept architecture, device integration planning and mobile monitoring design.',
      status: 'Prototype concept / under development.',
      challenges: [
        'Battery life for long-duration field use',
        'Communication coverage across large farming areas',
        'Building a durable, animal-safe enclosure',
      ],
      futureImprovements: [
        'Low-power communication options',
        'Ruggedised collar prototypes',
        'Longer-term field validation of sensor signals',
      ],
    },
  },
  {
    slug: 'robotics-embedded-systems',
    name: 'Robotics and Embedded Systems',
    categories: ['Robotics', 'Embedded Systems', 'ESP32', 'Arduino', 'Sensors'],
    description:
      'Practical robotics and embedded-system projects using sensors, microcontrollers, automation and real-world control systems.',
    screenVariant: 'robotics',
    screenItems: ['ESP32 connection', 'Sensor readings', 'Robot controls', 'Temperature', 'Humidity', 'Manual / Auto'],
    caseStudy: {
      overview:
        'This collection covers practical robots and embedded prototypes built around sensing, actuation, local interfaces and automatic control.',
      problem:
        'Real-world automation requires hardware, firmware and user controls to behave as one reliable system rather than isolated experiments.',
      solution:
        'Reusable embedded patterns connect microcontrollers, sensors, motor drivers, actuators and local/web controls into complete working prototypes.',
      technologies: [
        'ESP32',
        'Arduino',
        'Embedded C/C++',
        'Local web interfaces',
        'Serial communication',
        'Sensor integration',
      ],
      hardware: [
        'ESP32 and Arduino boards',
        'Distance and environmental sensors',
        'Motor drivers',
        'DC motors and servos',
        'Relays, buzzers and indicator LEDs',
      ],
      workflow: [
        'Read connected sensors',
        'Evaluate manual or automatic operating mode',
        'Apply control logic',
        'Drive motors, relays or other actuators',
        'Report live state to the operator interface',
        'Stop or change behavior when safety conditions require it',
      ],
      role: 'Embedded programming, electronics integration, robotics control and prototype testing.',
      status: 'Ongoing portfolio of working prototypes and development projects.',
      challenges: [
        'Electrical noise and reliable sensor readings',
        'Safe motor and power-control behavior',
        'Keeping local controls responsive on constrained devices',
      ],
      futureImprovements: [
        'More modular firmware architecture',
        'Expanded telemetry and diagnostics',
        'Improved enclosures and production-ready electronics',
      ],
    },
  },
]

export function getShowcaseProject(slug: string) {
  return showcaseProjects.find((project) => project.slug === slug)
}
