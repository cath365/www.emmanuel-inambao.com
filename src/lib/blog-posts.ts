// Shared by the blog pages and the sitemap.
export const blogPosts: Record<string, {
  title: string
  content: string[]
  category: string
  publishedAt?: string
  readingTime: string
  tags: string[]
}> = {
  'getting-started-with-esp32': {
    title: 'Getting Started with ESP32 for IoT Projects',
    category: 'IoT',
    publishedAt: '',
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
      'This provides a useful foundation for learning how sensing, connectivity and a dashboard fit together. From here, a project can add more sensors, power management or OTA updates where the requirements justify them.',
    ],
  },
  'smart-irrigation-system': {
    title: 'Planning a Smart Irrigation Prototype for Field Conditions',
    category: 'Engineering Notes',
    publishedAt: '',
    readingTime: '8 min read',
    tags: ['Agriculture', 'IoT', 'Automation', 'Prototype Planning'],
    content: [
      'A smart-irrigation prototype can combine soil-moisture sensing, an ESP32-class controller, pump or valve control and a simple monitoring interface.',
      'The engineering problem is not only switching a pump. The design needs to consider sensor reliability, power, manual override, connectivity, enclosure protection and what should happen when the network is unavailable.',
      'A practical architecture separates sensing, control and monitoring. The local controller should be able to make safe decisions without depending on a cloud connection.',
      'Before field deployment, sensor readings should be calibrated against the actual soil and installation conditions. Thresholds should be treated as project-specific values rather than universal numbers.',
      'Testing should cover sensor failure, loss of connectivity, low power, manual override and repeated valve or pump cycles before the system is treated as dependable.',
      'This article is an engineering design note, not a claim of measured farm-level water savings or commercial deployment.',
    ],
  },
  'pcb-design-best-practices': {
    title: 'PCB Design Review Checklist for Embedded Systems',
    category: 'Hardware',
    publishedAt: '',
    readingTime: '8 min read',
    tags: ['PCB', 'Hardware', 'Design Review'],
    content: [
      'PCB design quality depends on the electrical requirements, manufacturing process and operating environment of the specific system.',
      'A useful review starts with power distribution, grounding, decoupling, connector orientation, component clearance and the current carried by high-load traces.',
      'Sensitive analogue measurements should be protected from noisy switching and motor-control paths through careful placement, routing and grounding decisions.',
      'Design-rule checks are necessary but they do not replace a manual review of component orientation, connector access, mechanical fit and likely assembly problems.',
      'Prototype quantities should be tested before committing to larger production runs, especially when a board includes new power, sensing or communication sections.',
      'This note is a general engineering checklist and does not claim a specific number of production PCB designs.',
    ],
  },
  'nextjs-for-iot-dashboards': {
    title: 'Building Real-Time IoT Dashboards with Next.js',
    category: 'Web Dev',
    publishedAt: '',
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
      'The same architectural pattern can be adapted from a small prototype to larger deployments, but message rate, storage, security and scaling decisions should be validated for the actual number of devices.',
    ],
  },
}
