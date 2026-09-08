'use client'

import { CircuitBoard, Lightbulb, Rocket, Users } from 'lucide-react'

const programs = [
  {
    icon: Rocket,
    title: 'Robotics for young inventors',
    audience: 'Ages 6–16',
    description: 'Hands-on robotics sessions built around simple machines, sensors, movement and playful engineering challenges.',
  },
  {
    icon: CircuitBoard,
    title: 'Arduino & electronics',
    audience: 'Project-based learning',
    description: 'Breadboards, LEDs, sensors, motors and microcontrollers are introduced through things students can build, test and explain.',
  },
  {
    icon: Users,
    title: 'Project mentorship',
    audience: 'Learners & junior builders',
    description: 'Guidance from idea selection through wiring, coding, debugging, documentation and demonstration.',
  },
]

const principles = [
  ['Build first, explain deeply', 'Learners interact with a real circuit or mechanism, then connect what happened to the engineering idea behind it.'],
  ['Problem before technology', 'The project starts with a useful challenge instead of choosing hardware just because it looks impressive.'],
  ['Safe, understandable systems', 'Projects use age-appropriate components and emphasize clear wiring, testing and responsible handling.'],
  ['Confidence through iteration', 'Students are encouraged to test, fail safely, debug and improve instead of expecting the first version to be perfect.'],
]

export default function Education() {
  return (
    <section id="education" className="bg-[#7CA7EB] py-20 text-[#000B26] lg:py-28" aria-labelledby="education-heading">
      <div className="section-container">
        <div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
          <div>
            <p className="eyebrow text-[#000B26]/55">Engineering beyond products</p>
            <h2 id="education-heading" className="editorial-serif mt-4 text-4xl leading-none sm:text-5xl">
              Building systems. Teaching future builders.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#000B26]/60 sm:text-base">
              Robotics education is part of the same engineering practice: make complex ideas tangible, testable and useful. The focus is practical learning, not impressive-looking theory.
            </p>
          </div>

          <div>
            <div className="grid gap-px bg-[#000B26]/18 md:grid-cols-3">
              {programs.map(({ icon: Icon, title, audience, description }) => (
                <article key={title} className="bg-[#7CA7EB] p-6">
                  <Icon className="h-5 w-5 text-[#402924]" />
                  <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#000B26]/45">{audience}</p>
                  <h3 className="editorial-serif mt-2 text-2xl leading-tight">{title}</h3>
                  <p className="mt-4 text-sm leading-6 text-[#000B26]/58">{description}</p>
                </article>
              ))}
            </div>

            <div className="mt-10 border-t border-[#000B26]/20">
              <div className="flex items-center gap-2 py-5">
                <Lightbulb className="h-4 w-4 text-[#402924]" />
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#000B26]/48">Teaching principles</p>
              </div>
              {principles.map(([title, description]) => (
                <div key={title} className="grid gap-3 border-t border-[#000B26]/15 py-5 sm:grid-cols-[0.72fr_1.28fr]">
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-sm leading-6 text-[#000B26]/58">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
