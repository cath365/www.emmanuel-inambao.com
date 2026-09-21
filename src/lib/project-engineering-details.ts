export interface EngineeringDecision {
  title: string
  rationale: string
}

export interface EngineeringProjectDetail {
  projectId: string
  focus: string
  hardware: string[]
  software: string[]
  flow: string[]
  decisions: EngineeringDecision[]
  validation: string[]
  constraints: string[]
  nextMilestones: string[]
  safetyNote?: string
}

export const engineeringProjectDetails: Record<string, EngineeringProjectDetail> = {
  'smart-cooking-oil-dispenser': {
    projectId: 'smart-cooking-oil-dispenser',
    focus: 'A transaction-controlled dispensing system that must remain accurate and usable even when connectivity is unreliable.',
    hardware: [
      'ESP32 WROOM-32D controller',
      'Flow sensor for pulse-based volume measurement',
      '12V liquid pump with electrically isolated switching stage',
      '4×4 keypad for operator input',
      'I2C LCD for local prompts and transaction feedback',
      'SIM800-series GSM module for cellular connectivity',
      'Regulated power rails for logic and pump-side loads',
    ],
    software: [
      'Embedded transaction state machine',
      'Operator PIN validation',
      'Amount-to-volume / target calculation logic',
      'Flow pulse counting and automatic cut-off',
      'Non-volatile offline transaction queue',
      'REST API integration',
      'Owner/admin web dashboard',
    ],
    flow: [
      'Operator signs in',
      'Amount or target volume is entered',
      'ESP32 calculates the dispensing target',
      'Pump starts',
      'Flow pulses are measured continuously',
      'Pump stops when the target is reached',
      'Transaction is recorded locally',
      'Queued data synchronizes to the web platform when connectivity is available',
    ],
    decisions: [
      {
        title: 'Measure product flow, not pump-on time',
        rationale: 'A fixed pump duration is vulnerable to supply voltage, pump wear and fluid-flow variation. Pulse-based measurement provides a stronger control signal for target cut-off.',
      },
      {
        title: 'Keep the sale path offline-first',
        rationale: 'The physical sale should not fail simply because internet or GSM connectivity is unavailable. Local state and queued synchronization protect continuity.',
      },
      {
        title: 'Identify the operator locally',
        rationale: 'PIN-based operator access makes individual dispensing events attributable without requiring a cloud round trip before every sale.',
      },
      {
        title: 'Separate embedded control from business reporting',
        rationale: 'The ESP32 owns the real-time dispensing loop while the API/dashboard handles longer-lived sales records, reporting and management.',
      },
    ],
    validation: [
      'Calibrate flow pulses against a known measured volume',
      'Measure cut-off overshoot at several target volumes',
      'Verify wrong-PIN and interrupted-transaction behavior',
      'Power-cycle during an unsynchronized sale and confirm queue recovery',
      'Run offline transactions, reconnect, and verify records synchronize once',
      'Test pump switching for ESP32 resets or electrical noise',
      'Compare dashboard totals against local transaction records',
    ],
    constraints: [
      'Flow calibration can change with plumbing, pump characteristics and liquid properties.',
      'Pump current and GSM transmit bursts require careful power design around the ESP32.',
      'Offline synchronization must avoid duplicate sales when reconnecting.',
      'Commercial deployment requires enclosure, food-contact and electrical-safety considerations appropriate to the installation.',
    ],
    nextMilestones: [
      'Lock calibration procedure and acceptable dispensing tolerance',
      'Finalize protected pump/GSM power architecture',
      'Add field-ready enclosure and service access',
      'Run repeated offline/reconnect transaction testing',
      'Complete voucher/payment and reporting workflows only after dispensing reliability is stable',
    ],
  },

  'smart-walking-stick': {
    projectId: 'smart-walking-stick',
    focus: 'An assistive navigation system designed to guide a visually impaired user toward a safer direction, not merely announce nearby objects.',
    hardware: [
      'ESP32-class controller on the stick',
      'Stick-mounted camera',
      'Ultrasonic obstacle sensors',
      'Battery-powered portable electronics',
      'Local Wi-Fi and/or Bluetooth link to smartphone',
      'Wireless headset for private audio guidance',
    ],
    software: [
      'Smartphone companion application',
      'Fast on-device object/obstacle detection path',
      'Cloud AI path for deeper scene interpretation',
      'Bidirectional stick ↔ phone messaging',
      'Spoken navigation guidance',
      'Connection and device-state handling',
    ],
    flow: [
      'Stick sensors measure the nearby environment',
      'Camera captures selected image frames',
      'ESP32 forwards sensor/image data to the paired phone',
      'Phone runs fast local detection',
      'Cloud AI is used only when deeper scene reasoning is needed',
      'Phone converts the result into directional guidance',
      'Guidance is delivered through the wireless headset',
      'User commands can return through the app to the stick workflow',
    ],
    decisions: [
      {
        title: 'Keep the camera on the stick',
        rationale: 'The user should not need to walk while visibly holding the phone. The stick remains the sensing interface while the phone stays protected and acts as the compute bridge.',
      },
      {
        title: 'Use the phone for heavy compute',
        rationale: 'A smartphone provides substantially more compute, memory and connectivity than an ESP32 while allowing the stick electronics to remain smaller and more power-efficient.',
      },
      {
        title: 'Local AI first, cloud AI second',
        rationale: 'Immediate obstacle detection needs low latency. Cloud reasoning is better reserved for more complex scene interpretation when connectivity is available.',
      },
      {
        title: 'Give directional guidance rather than object lists',
        rationale: 'The useful output is a safe action such as move left, keep right or stop—not a stream of object names with no navigation context.',
      },
    ],
    validation: [
      'Measure end-to-end guidance latency from sensor/camera event to headset output',
      'Test ultrasonic readings at common walking distances and surface angles',
      'Verify behavior when Wi-Fi/Bluetooth drops during use',
      'Test local-AI operation with no internet connection',
      'Evaluate false-positive and missed-obstacle behavior in controlled routes',
      'Measure practical battery runtime for stick electronics and camera use',
      'Run supervised usability tests before any uncontrolled road-use trials',
    ],
    constraints: [
      'Cloud scene analysis may be unavailable or too slow on weak mobile data.',
      'Camera guidance quality changes with lighting, motion blur and occlusion.',
      'Obstacle detection alone is not enough for safe road-crossing decisions.',
      'Audio prompts must be concise so they do not overload or distract the user.',
    ],
    nextMilestones: [
      'Stabilize stick-to-phone pairing and reconnect behavior',
      'Define a compact directional command vocabulary',
      'Validate local detection latency before expanding cloud features',
      'Add confidence thresholds and safe fallback prompts',
      'Conduct supervised route testing with clearly defined acceptance criteria',
    ],
    safetyNote: 'This remains an assistive prototype. Navigation guidance should supplement established mobility techniques and supervised testing; it should not independently authorize road crossing or replace a trained mobility aid.',
  },

  'denuel-one-pro-ai-x': {
    projectId: 'denuel-one-pro-ai-x',
    focus: 'A modular ESP32 smart-device platform that combines a touch interface, camera, cellular communication, local wireless connectivity, OTA updates and AI-ready services.',
    hardware: [
      'ESP32 main controller',
      'Touch display',
      'ESP32-CAM camera module',
      'SIM800 GSM module',
      'Wi-Fi radio',
      'Bluetooth radio',
      'Battery / portable power subsystem',
    ],
    software: [
      'Embedded touch UI and navigation',
      'Status-bar / device-state layer',
      'Camera integration service',
      'SIM800 calls and SMS service',
      'Wi-Fi and Bluetooth service modules',
      'OTA update path',
      'AI assistant integration layer',
    ],
    flow: [
      'Touch UI receives the user action',
      'Application layer routes the action to a device service',
      'Camera, GSM, Wi-Fi or Bluetooth module performs the operation',
      'Service state is returned to the UI/status layer',
      'OTA path updates firmware without rebuilding the physical device',
      'AI integration consumes selected device/app context rather than owning low-level hardware control',
    ],
    decisions: [
      {
        title: 'Use modular device services',
        rationale: 'Camera, GSM, wireless, UI and OTA features can be debugged independently instead of turning the firmware into one tightly coupled loop.',
      },
      {
        title: 'Keep the UI separate from hardware drivers',
        rationale: 'The interface should request actions through service boundaries so display changes do not require rewriting communication or camera logic.',
      },
      {
        title: 'Treat OTA as a core subsystem',
        rationale: 'A multi-feature smart device becomes difficult to maintain if every firmware change requires physical access to the board.',
      },
      {
        title: 'Add AI above the device-control layer',
        rationale: 'AI should interpret context and assist the user while deterministic embedded logic remains responsible for calls, SMS, connectivity and hardware state.',
      },
    ],
    validation: [
      'Verify every touch target and screen transition repeatedly',
      'Test camera initialization, capture and recovery after failures',
      'Place and receive SIM800 calls and SMS under varying signal conditions',
      'Test Wi-Fi connect/disconnect/reconnect behavior',
      'Test Bluetooth pairing persistence and recovery',
      'Perform OTA update and confirm the device returns to a usable state',
      'Validate status indicators against the real hardware state',
      'Measure power behavior while GSM, camera and display are active together',
    ],
    constraints: [
      'ESP32 memory and processing resources must be shared across UI, connectivity and camera-related work.',
      'SIM800 transmit bursts can destabilize the device if the power subsystem is undersized.',
      'Camera and rich UI features can increase memory pressure and responsiveness issues.',
      'OTA needs a safe recovery strategy before it can be considered field-ready.',
    ],
    nextMilestones: [
      'Stabilize touch, camera and SIM800 as independent tested modules',
      'Complete Wi-Fi/Bluetooth reconnect handling',
      'Validate battery and status indicators against real measurements',
      'Prove a reliable OTA update/recovery cycle',
      'Integrate the AI assistant only after the core device services meet acceptance tests',
    ],
  },
}
