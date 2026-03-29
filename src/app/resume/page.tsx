'use client'

import { motion } from 'framer-motion'
import {
  Download, MapPin, Mail, Phone, Github, Linkedin,
  Briefcase, GraduationCap, Award, Code, Globe, Cpu,
  ChevronRight, Calendar, ExternalLink
} from 'lucide-react'
import Link from 'next/link'

const personalInfo = {
  name: 'Prof. Emmanuel Inambao',
  title: 'Electronic Engineer | IoT & Robotics Developer | Full-Stack Systems Engineer',
  location: 'Lusaka, Zambia',
  email: 'denuelinambao@gmail.com',
  phone: '+260 973 914 432',
  github: 'github.com/bolo3574',
  linkedin: 'linkedin.com/in/emmanuelinambao',
  website: 'emmanuelinambao.com',
}

const experience = [
  {
    title: 'Lead IoT Engineer & Full-Stack Developer',
    company: 'Freelance / Independent Consultant',
    period: '2021 - Present',
    location: 'Lusaka, Zambia',
    achievements: [
      'Designed and deployed 15+ IoT systems for agricultural monitoring, industrial automation, and smart buildings',
      'Built full-stack web applications using Next.js, React, and Node.js for real-time data visualization',
      'Developed custom PCB designs and embedded firmware for ESP32, STM32, and Arduino platforms',
      'Implemented MQTT-based communication networks supporting 500+ concurrent sensor nodes',
      'Reduced client energy costs by 35% through smart automation and monitoring systems',
    ],
  },
  {
    title: 'Electronics Instructor & Technical Mentor',
    company: 'Technical Education Programs',
    period: '2020 - Present',
    location: 'Lusaka, Zambia',
    achievements: [
      'Trained 200+ students in embedded systems, PCB design, and IoT development',
      'Created comprehensive curriculum for Arduino, ESP32, and PLC programming',
      'Mentored 30+ junior engineers through hands-on project-based learning',
      'Developed open-source educational resources used by institutions across Zambia',
    ],
  },
]

const education = [
  {
    degree: 'Advanced Diploma in Electronic Engineering',
    institution: 'University of Zambia',
    period: '2018 - 2021',
    highlights: ['Specialization in Industrial Automation', 'Thesis: Smart Irrigation Systems using IoT'],
  },
]

const skills = {
  'Hardware & Embedded': ['Arduino', 'ESP32', 'STM32', 'Raspberry Pi', 'PLC Programming', 'PCB Design (KiCad/Eagle)', 'Soldering & Assembly'],
  'Software & Web': ['TypeScript', 'React/Next.js', 'Node.js', 'Python', 'C/C++', 'REST APIs', 'MQTT'],
  'IoT & Protocols': ['LoRa', 'BLE', 'Wi-Fi', 'Modbus', 'RS-485', 'MQTT', 'HTTP/WebSocket'],
  'Tools & Cloud': ['Git/GitHub', 'Docker', 'AWS IoT', 'Firebase', 'PlatformIO', 'Vercel', 'Cloudinary'],
}

const certifications = [
  'Certified IoT Developer — Cisco Networking Academy',
  'Arduino Professional Certification',
  'AWS IoT Core Fundamentals',
  'PLC Programming — Siemens TIA Portal',
]

const languages = [
  { name: 'English', level: 'Native' },
  { name: 'French', level: 'Professional' },
  { name: 'Portuguese', level: 'Conversational' },
]

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-dark-950 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header / Print Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Link href="/" className="text-dark-400 hover:text-white transition-colors text-sm flex items-center gap-1">
            <ChevronRight className="w-4 h-4 rotate-180" /> Back to Portfolio
          </Link>
          <a
            href="/cv/Emmanuel_Inambao_CV.pdf"
            target="_blank"
            className="btn-primary text-sm"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </a>
        </motion.div>

        {/* Resume Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-900 border border-dark-700 rounded-2xl overflow-hidden"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-8 sm:p-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {personalInfo.name}
            </h1>
            <p className="text-primary-100 text-lg mb-6">
              {personalInfo.title}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-primary-200">
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {personalInfo.location}
              </span>
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> {personalInfo.email}
              </span>
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> {personalInfo.phone}
              </span>
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4" /> {personalInfo.website}
              </span>
              <span className="flex items-center gap-2">
                <Github className="w-4 h-4" /> {personalInfo.github}
              </span>
              <span className="flex items-center gap-2">
                <Linkedin className="w-4 h-4" /> {personalInfo.linkedin}
              </span>
            </div>
          </div>

          <div className="p-8 sm:p-10 space-y-10">
            {/* Professional Summary */}
            <section>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4 pb-2 border-b border-dark-700">
                <Cpu className="w-5 h-5 text-primary-400" />
                Professional Summary
              </h2>
              <p className="text-dark-300 leading-relaxed">
                Passionate Electronic Engineer with 5+ years of experience designing and deploying
                IoT systems, embedded solutions, and full-stack applications. Specialized in bridging
                hardware and software to create intelligent systems that solve real-world challenges
                across Africa. Proven track record of delivering production-grade industrial automation,
                smart agriculture systems, and real-time monitoring platforms.
              </p>
            </section>

            {/* Experience */}
            <section>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6 pb-2 border-b border-dark-700">
                <Briefcase className="w-5 h-5 text-primary-400" />
                Professional Experience
              </h2>
              <div className="space-y-8">
                {experience.map((exp, index) => (
                  <motion.div
                    key={exp.company}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white">{exp.title}</h3>
                      <span className="text-sm text-primary-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {exp.period}
                      </span>
                    </div>
                    <p className="text-dark-400 text-sm mb-3">
                      {exp.company} — {exp.location}
                    </p>
                    <ul className="space-y-2">
                      {exp.achievements.map((achievement) => (
                        <li key={achievement} className="flex items-start gap-2 text-sm text-dark-300">
                          <ChevronRight className="w-3 h-3 text-primary-400 shrink-0 mt-1.5" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6 pb-2 border-b border-dark-700">
                <GraduationCap className="w-5 h-5 text-primary-400" />
                Education
              </h2>
              {education.map((edu) => (
                <div key={edu.degree}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">{edu.degree}</h3>
                    <span className="text-sm text-primary-400">{edu.period}</span>
                  </div>
                  <p className="text-dark-400 text-sm mb-2">{edu.institution}</p>
                  <ul className="flex flex-wrap gap-2">
                    {edu.highlights.map((h) => (
                      <li key={h} className="tech-badge text-xs">{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            {/* Skills */}
            <section>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6 pb-2 border-b border-dark-700">
                <Code className="w-5 h-5 text-primary-400" />
                Technical Skills
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Object.entries(skills).map(([category, items]) => (
                  <div key={category}>
                    <h4 className="text-sm font-semibold text-primary-400 mb-2">{category}</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((skill) => (
                        <span key={skill} className="tech-badge text-xs">{skill}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Certifications */}
            <section>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4 pb-2 border-b border-dark-700">
                <Award className="w-5 h-5 text-primary-400" />
                Certifications
              </h2>
              <ul className="space-y-2">
                {certifications.map((cert) => (
                  <li key={cert} className="flex items-center gap-2 text-sm text-dark-300">
                    <ChevronRight className="w-3 h-3 text-primary-400" />
                    {cert}
                  </li>
                ))}
              </ul>
            </section>

            {/* Languages */}
            <section>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4 pb-2 border-b border-dark-700">
                <Globe className="w-5 h-5 text-primary-400" />
                Languages
              </h2>
              <div className="flex flex-wrap gap-4">
                {languages.map((lang) => (
                  <span key={lang.name} className="text-sm text-dark-300">
                    <span className="font-medium text-white">{lang.name}</span> — {lang.level}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
