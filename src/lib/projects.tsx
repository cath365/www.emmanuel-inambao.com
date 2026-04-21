'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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
  githubUrl?: string
  liveUrl?: string
  appStoreUrl?: string
  playStoreUrl?: string
  websiteUrl?: string
  docsUrl?: string
  videoUrl?: string
}

const defaultProjects: Project[] = [
  {
    id: 'smart-irrigation',
    title: 'Smart Irrigation System',
    purpose: 'Automated water management for agricultural efficiency',
    image: '/images/projects/smart-irrigation.svg',
    techStack: ['ESP32', 'Soil Moisture Sensors', 'Relay Module', 'Solar Panel', 'Next.js Dashboard', 'Firebase'],
    problemSolved: 'Farmers in Zambia often over-irrigate or under-irrigate crops due to lack of real-time soil data. This wastes water, reduces crop yield, and increases labor costs. Manual irrigation also requires constant physical presence.',
    systemLogic: 'Soil moisture sensors continuously monitor ground conditions and send data to an ESP32 microcontroller. When moisture drops below a threshold, the system automatically activates water pumps via relay modules. The web dashboard displays real-time moisture levels, pump status, and historical data. The system works offline and syncs when connectivity is available.',
    outcome: 'Reduced water consumption by 40% while improving crop health. Farmers can now monitor and control irrigation remotely, saving 15+ hours of manual labor per week. System deployed on 3 farms in Lusaka region.',
    featured: true,
    githubUrl: 'https://github.com/bolo3574/smart-irrigation',
  },
  {
    id: 'esp32-cutter-robot',
    title: 'ESP32 Cutter Robot',
    purpose: 'Web-controlled precision cutting automation',
    image: '/images/projects/cutter-robot.svg',
    techStack: ['ESP32', 'L298N Motor Driver', 'DC Motors', 'Web Server', 'HTML/CSS/JS', 'Limit Switches'],
    problemSolved: 'Industrial cutting processes often require manual operation, leading to inconsistent cuts, operator fatigue, and safety hazards. Remote operation capability was needed for hazardous environments.',
    systemLogic: 'ESP32 hosts a local web server accessible via Wi-Fi. The interface provides precise control over cutting mechanisms using PWM signals to the L298N motor driver. Limit switches prevent over-travel. Real-time status feedback is sent to the web interface. Multiple operation modes: manual, semi-auto, and programmed sequences.',
    outcome: 'Achieved 0.5mm cutting precision with full remote control capability. Eliminated direct operator exposure to cutting hazards. Web interface allows operation from any device on the local network.',
    featured: true,
    githubUrl: 'https://github.com/bolo3574/cutter-robot',
  },
  {
    id: 'bottle-sorting-system',
    title: 'Automated Bottle Sorting System',
    purpose: 'Dual ultrasonic sensor-based sorting by size',
    image: '/images/projects/bottle-sorting.svg',
    techStack: ['Arduino Mega', 'HC-SR04 Ultrasonic x2', 'Servo Motors', 'Conveyor Belt', 'Relay Module', 'LCD Display'],
    problemSolved: 'Recycling facilities and bottling plants need to sort bottles by size quickly and accurately. Manual sorting is slow, error-prone, and not scalable for high-volume operations.',
    systemLogic: 'Two ultrasonic sensors positioned at different heights detect bottle presence and measure height simultaneously. Arduino processes sensor data to classify bottles into small, medium, and large categories. Servo-actuated gates direct bottles to appropriate collection bins. LCD displays current count and sorting statistics. Conveyor speed adjusts based on throughput.',
    outcome: 'Processes 120+ bottles per hour with 98% classification accuracy. Reduced manual sorting labor by 75%. Currently installed in a local recycling facility, processing 1000+ bottles daily.',
    featured: true,
    githubUrl: 'https://github.com/bolo3574/bottle-sorting',
  },
  {
    id: 'oil-level-monitoring',
    title: 'Oil Level Monitoring System',
    purpose: 'Real-time industrial oil tank monitoring with dashboard',
    image: '/images/projects/oil-monitoring.svg',
    techStack: ['ESP32', 'Ultrasonic Sensor', 'Temperature Sensor', 'Next.js', 'REST API', 'MQTT', 'Alert System'],
    problemSolved: 'Industrial facilities need continuous monitoring of oil storage tanks. Manual level checks are dangerous, infrequent, and don\'t provide trend data for predictive maintenance. Unexpected shortages cause costly production stops.',
    systemLogic: 'Ultrasonic sensor mounted on tank measures oil level every 30 seconds. ESP32 processes readings, applies temperature compensation, and sends data via MQTT to a cloud broker. Next.js dashboard displays real-time levels, trend charts, and consumption analytics. Automated alerts via email/SMS when levels reach warning thresholds.',
    outcome: 'Zero unexpected oil shortages since deployment. Maintenance team receives advance warning 48+ hours before refill needed. Dashboard adopted by 2 industrial clients for fleet of 12 tanks.',
    featured: false,
    githubUrl: 'https://github.com/bolo3574/oil-monitoring',
    liveUrl: 'https://oil-monitor-demo.vercel.app',
  },
  {
    id: 'smart-walking-stick',
    title: 'Smart Walking Stick',
    purpose: 'Assistive technology for visually impaired navigation',
    image: '/images/projects/smart-stick.svg',
    techStack: ['Arduino Nano', 'Ultrasonic Sensor', 'Vibration Motor', 'Buzzer', '3.7V LiPo', 'Custom PCB'],
    problemSolved: 'Visually impaired individuals face challenges detecting obstacles at different heights, including overhead obstructions that traditional canes miss. Existing solutions are expensive or require smartphone connectivity.',
    systemLogic: 'Ultrasonic sensor detects obstacles from ground level up to head height with a 3-meter range. Distance data is converted to haptic feedback via vibration motor - faster vibration means closer obstacle. Audio alerts activate for very close obstacles. All processing happens on-device with no external connectivity required. Rechargeable battery provides 12+ hours of operation.',
    outcome: 'Donated 5 units to Zambia Association for the Blind. Users report 80% improvement in navigation confidence. Battery life exceeds 12 hours. Total build cost under $25 per unit, making it accessible for NGO distribution.',
    featured: true,
    githubUrl: 'https://github.com/bolo3574/smart-walking-stick',
  },
]

interface ProjectsContextType {
  projects: Project[]
  addProject: (project: Omit<Project, 'id'>) => void
  updateProject: (id: string, project: Partial<Project>) => void
  deleteProject: (id: string) => void
  getProject: (id: string) => Project | undefined
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined)

function saveToServer(data: Project[]) {
  fetch('/api/portfolio-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'projects', data }),
  }).catch(e => console.error('Failed to save projects:', e))
}

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(defaultProjects)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/portfolio-data?key=projects')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data)
        } else {
          const stored = localStorage.getItem('portfolio_projects')
          if (stored) {
            try {
              const parsed = JSON.parse(stored)
              if (Array.isArray(parsed) && parsed.length > 0) setProjects(parsed)
            } catch {}
          }
        }
      })
      .catch(() => {
        const stored = localStorage.getItem('portfolio_projects')
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            if (Array.isArray(parsed) && parsed.length > 0) setProjects(parsed)
          } catch {}
        }
      })
      .finally(() => setIsLoaded(true))
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('portfolio_projects', JSON.stringify(projects))
    }
  }, [projects, isLoaded])

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject: Project = { ...project, id: `project-${Date.now()}` }
    setProjects(prev => {
      const updated = [...prev, newProject]
      saveToServer(updated)
      return updated
    })
  }

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...updates } : p)
      saveToServer(updated)
      return updated
    })
  }

  const deleteProject = (id: string) => {
    setProjects(prev => {
      const updated = prev.filter(p => p.id !== id)
      saveToServer(updated)
      return updated
    })
  }

  const getProject = (id: string) => projects.find(p => p.id === id)

  return (
    <ProjectsContext.Provider value={{ projects, addProject, updateProject, deleteProject, getProject }}>
      {children}
    </ProjectsContext.Provider>
  )
}

export function useProjects() {
  const context = useContext(ProjectsContext)
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider')
  }
  return context
}
