export interface CapabilityArea {
  title: string
  description: string
}

export interface CapabilitySector {
  slug: 'government' | 'aviation'
  eyebrow: string
  title: string
  subtitle: string
  audience: string[]
  capabilityAreas: CapabilityArea[]
  useCases: CapabilityArea[]
  deliveryPriorities: string[]
  relevantProjectIds: string[]
  boundaryTitle: string
  boundaryText: string
}

export const coreCapabilities: CapabilityArea[] = [
  {
    title: 'Embedded & IoT systems',
    description: 'Microcontroller-based control, sensing, local interfaces, GSM, Wi-Fi/Bluetooth, telemetry and offline device behavior.',
  },
  {
    title: 'Digital applications & portals',
    description: 'Web and mobile applications, dashboards, workflow tools, administration interfaces and responsive user experiences.',
  },
  {
    title: 'Systems integration',
    description: 'REST APIs, application-to-application data exchange, connected-device backends and integration around existing operations.',
  },
  {
    title: 'Monitoring & automation',
    description: 'Remote telemetry, alerts, equipment state, sensor data, dashboards and controlled physical outputs.',
  },
  {
    title: 'Offline & field resilience',
    description: 'Local-first workflows, queued synchronization, GSM-connected systems and designs that tolerate intermittent internet access.',
  },
  {
    title: 'Technical documentation & handover',
    description: 'Architecture, implementation notes, test evidence, user guidance, deployment documentation and training-oriented handover.',
  },
]

export const capabilitySectors: CapabilitySector[] = [
  {
    slug: 'government',
    eyebrow: 'Government & Public-Sector ICT',
    title: 'Digital systems for public-service operations and institutional modernization.',
    subtitle: 'Relevant capability for ministries, agencies, statutory bodies, councils, public universities, utilities, hospitals, development programs and other institutions that need dependable ICT systems and practical digital-service implementation.',
    audience: [
      'ICT and digital-transformation departments',
      'Government ministries and agencies',
      'Statutory bodies and regulators',
      'Councils and local authorities',
      'Public universities and research institutions',
      'Utilities, hospitals and development programs',
    ],
    capabilityAreas: [
      {
        title: 'ICT operations & support',
        description: 'Device support, software configuration, user access, troubleshooting and the operational discipline required to keep digital services usable.',
      },
      {
        title: 'Networks & connectivity',
        description: 'LAN/WAN-aware systems, Wi-Fi, field connectivity, remote devices and troubleshooting where application reliability depends on the network.',
      },
      {
        title: 'Digital services & workflows',
        description: 'Citizen/user portals, internal workflow tools, dashboards, administrative systems and mobile-friendly digital-service experiences.',
      },
      {
        title: 'Interoperability & APIs',
        description: 'Connecting existing systems through APIs and data exchange so departments avoid isolated applications and duplicated information.',
      },
      {
        title: 'Cybersecurity-aware delivery',
        description: 'Access control, confidentiality, role separation, secure integration thinking and responsible handling of operational data.',
      },
      {
        title: 'Monitoring & field systems',
        description: 'IoT telemetry, remote monitoring, data capture, alerts and offline-capable systems for infrastructure or distributed operations.',
      },
      {
        title: 'Business continuity',
        description: 'Offline queues, recovery behavior, graceful connectivity failure and workflows that continue operating during network interruptions.',
      },
      {
        title: 'Documentation & capacity building',
        description: 'Technical reports, system documentation, handover, staff guidance and training for non-technical and technical stakeholders.',
      },
    ],
    useCases: [
      {
        title: 'Service delivery portal',
        description: 'Public or internal forms, case workflows, status tracking, administration and notifications around a defined government service.',
      },
      {
        title: 'Asset / infrastructure monitoring',
        description: 'Sensors or connected devices reporting equipment, environmental or infrastructure status to a secure dashboard.',
      },
      {
        title: 'Field data collection',
        description: 'Mobile or embedded workflows that continue offline and synchronize when connectivity becomes available.',
      },
      {
        title: 'Systems integration layer',
        description: 'API services that connect departmental applications, databases or device systems and reduce manual data duplication.',
      },
      {
        title: 'Operational dashboard',
        description: 'Role-based views for incidents, usage, telemetry, service requests, reports and management decision support.',
      },
      {
        title: 'ICT workflow automation',
        description: 'Internal approvals, support requests, inventory or technical service processes moved from manual tracking into auditable digital workflows.',
      },
    ],
    deliveryPriorities: [
      'Requirements traced to the institution’s operational process',
      'Role-based access and data-minimization decisions',
      'Interoperability with existing systems before unnecessary replacement',
      'Offline/recovery planning where service continuity matters',
      'Test evidence, documentation and controlled handover',
      'Training and support material appropriate to the users',
      'Procurement and statutory requirements verified against the specific tender or vacancy',
    ],
    relevantProjectIds: [
      'smart-cooking-oil-dispenser',
      'the-spot-app',
      'smart-walking-stick',
      'denuel-one-pro-ai-x',
    ],
    boundaryTitle: 'Institutional eligibility and procurement',
    boundaryText: 'This capability profile demonstrates engineering relevance. It does not claim automatic eligibility for every government grade, tender or supplier category. Degree level, professional registration, tax/procurement documentation, citizenship, references, financial requirements and other mandatory conditions must be checked against the official specification before submission.',
  },
  {
    slug: 'aviation',
    eyebrow: 'Aviation & High-Reliability Operations',
    title: 'Embedded monitoring, telemetry and operational software for aviation-adjacent systems.',
    subtitle: 'Relevant to airlines, airports, maintenance organizations, ground-service companies, logistics operators and aviation technology teams that need connected equipment, monitoring, asset visibility or operational software outside certified flight-critical avionics.',
    audience: [
      'Airports and airport operators',
      'Airlines and operations teams',
      'Maintenance, repair and overhaul organizations',
      'Ground-support equipment operators',
      'Aviation logistics and fleet teams',
      'Aviation technology and digital-transformation teams',
    ],
    capabilityAreas: [
      {
        title: 'Ground equipment telemetry',
        description: 'Sensor and device systems that report status, usage, environment or fault conditions from non-flight-critical ground equipment.',
      },
      {
        title: 'Asset tracking & geofencing',
        description: 'GPS/GSM/IoT concepts for tracking vehicles, portable equipment or field assets with alerts and operational dashboards.',
      },
      {
        title: 'Hangar / facility monitoring',
        description: 'Environmental, power, access or equipment-condition monitoring with local sensing and remote visibility.',
      },
      {
        title: 'Maintenance workflow software',
        description: 'Internal applications for inspections, defect records, work status, inventory, evidence capture and reporting workflows.',
      },
      {
        title: 'Operational dashboards',
        description: 'Role-based views combining device telemetry, alerts, maintenance data or operational records into a usable interface.',
      },
      {
        title: 'Offline field applications',
        description: 'Mobile or connected-device workflows designed to capture and retain data when connectivity is interrupted.',
      },
      {
        title: 'Systems integration',
        description: 'APIs and middleware for moving approved operational data between dashboards, applications and connected equipment.',
      },
      {
        title: 'Prototype instrumentation',
        description: 'ESP32/Arduino-class sensing, local displays, communications and test fixtures for controlled R&D or ground-use prototypes.',
      },
    ],
    useCases: [
      {
        title: 'Ground-support equipment monitor',
        description: 'Track runtime, battery/power condition, temperature or selected equipment-state signals and present them to maintenance personnel.',
      },
      {
        title: 'Airport asset tracker',
        description: 'GPS/GSM-enabled tracking and geofence alerts for approved ground assets, vehicles or portable equipment.',
      },
      {
        title: 'Hangar environment dashboard',
        description: 'Monitor temperature, humidity, access or other facility conditions and retain timestamped operational records.',
      },
      {
        title: 'Inspection / maintenance app',
        description: 'Mobile-friendly inspection checklists, evidence capture, defect status and supervisor dashboards for non-certified workflow support.',
      },
      {
        title: 'Equipment fault notification',
        description: 'Connected sensing and rule-based alerts for selected ground-equipment states, with an auditable event history.',
      },
      {
        title: 'Operations integration prototype',
        description: 'A controlled proof-of-concept connecting sensors, APIs and dashboards before an organization decides on production architecture.',
      },
    ],
    deliveryPriorities: [
      'Explicit separation between prototype, ground-use and certified aircraft functions',
      'Requirements, interfaces and failure behavior documented before implementation',
      'Deterministic device control kept separate from higher-level analytics or AI',
      'Power, connectivity and recovery behavior tested under realistic conditions',
      'Traceable test evidence and configuration documentation',
      'Security boundaries for connected devices and operational data',
      'Formal aviation certification work left to appropriately qualified and approved organizations/personnel',
    ],
    relevantProjectIds: [
      'denuel-one-pro-ai-x',
      'smart-cooking-oil-dispenser',
      'smart-walking-stick',
      'the-spot-app',
    ],
    boundaryTitle: 'Aviation safety and certification boundary',
    boundaryText: 'This portfolio does not claim certified flight-critical avionics, aircraft modification approval or compliance with standards such as DO-178C/DO-254. Any system that can affect aircraft safety, certified maintenance release, navigation, flight controls or other regulated aircraft functions must be engineered, verified and approved through the applicable aviation standards and appropriately authorized organizations and personnel.',
  },
]

export const capabilitySectorBySlug = Object.fromEntries(
  capabilitySectors.map(sector => [sector.slug, sector])
) as Record<CapabilitySector['slug'], CapabilitySector>
