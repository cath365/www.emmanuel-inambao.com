import type { ShowcaseProject } from '@/data/portfolio'

interface PixelPhoneMockupProps {
  project: ShowcaseProject
}

const screenConfig = {
  assistant: { eyebrow: 'Denuel One Pro AI X', title: 'AI Assistant', metric: 'ONLINE', feature: 'Ready for intelligent device commands', status: 'Camera · Wi-Fi · Bluetooth · SIM' },
  walking: { eyebrow: 'Assistive Navigation', title: 'Safe Route', metric: 'CLEAR', feature: 'Obstacle guidance and voice support active', status: 'Map · Voice · Smart stick' },
  oil: { eyebrow: 'Dispensing System', title: 'Device Control', metric: 'READY', feature: 'Pump, quantity and transaction workflow', status: 'Quantity · Payments · Reports' },
  quotation: { eyebrow: 'Business Workspace', title: 'New Quotation', metric: 'DRAFT', feature: 'Customer and order workflow in one place', status: 'Catalogue · Status · Receipt' },
  livestock: { eyebrow: 'Livestock Monitor', title: 'Animal Location', metric: 'SAFE', feature: 'Geofence and field monitoring', status: 'Map · Health · Battery' },
  robotics: { eyebrow: 'Robot Control', title: 'ESP32 Connected', metric: 'LIVE', feature: 'Manual and automatic control interface', status: 'Sensors · Temperature · Humidity' },
} as const

export default function PixelPhoneMockup({ project }: PixelPhoneMockupProps) {
  const config = screenConfig[project.screenVariant]

  return (
    <div className="relative mx-auto w-full max-w-[18rem] select-none sm:max-w-[20rem]" aria-hidden="true">
      <div className="absolute -inset-8 rounded-full bg-brand-sky/15 blur-3xl" />
      <div className="absolute -right-5 top-20 h-24 w-24 rounded-full bg-brand-camel/35 blur-2xl" />

      <div className="relative rounded-[3.35rem] border border-brand-navy/15 bg-[#1a1417] p-[0.52rem] shadow-[0_36px_90px_rgba(0,11,38,0.30)] dark:border-brand-cream/10">
        <div className="pointer-events-none absolute left-1/2 top-4 z-20 flex h-9 w-[58%] -translate-x-1/2 items-center justify-center gap-2 rounded-full border border-white/10 bg-brand-navy shadow-lg">
          <span className="h-4 w-4 rounded-full border border-brand-sky/25 bg-[#071535]" />
          <span className="h-4 w-4 rounded-full border border-brand-sky/25 bg-[#071535]" />
          <span className="h-2.5 w-2.5 rounded-full bg-brand-camel" />
        </div>

        <div className="relative aspect-[9/19.5] overflow-hidden rounded-[2.82rem] bg-brand-cream">
          <div className="absolute inset-x-0 top-0 h-32 bg-brand-sky/10" />
          <div className="relative flex h-full flex-col px-4 pb-4 pt-16">
            <div className="flex items-center justify-between text-[0.54rem] font-semibold uppercase tracking-[0.16em] text-brand-chocolate/55">
              <span>EI Systems</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-brand-sky" /> Connected</span>
            </div>

            <div className="mt-4 rounded-[1.65rem] bg-brand-navy p-4 text-brand-cream shadow-[0_18px_40px_rgba(0,11,38,0.22)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[0.52rem] font-bold uppercase tracking-[0.2em] text-brand-camel">{config.eyebrow}</p>
                  <p className="mt-2 font-serif text-[1.55rem] font-semibold leading-none">{config.title}</p>
                </div>
                <span className="rounded-full bg-brand-sky px-2 py-1 text-[0.46rem] font-bold tracking-[0.12em] text-brand-navy">{config.metric}</span>
              </div>
              <p className="mt-3 text-[0.66rem] leading-5 text-brand-cream/65">{config.feature}</p>

              <div className="mt-4 rounded-2xl border border-brand-cream/10 bg-white/5 p-3">
                <div className="flex items-end justify-between gap-1.5">
                  {[35, 62, 48, 78, 58, 88, 66].map((height, index) => (
                    <span key={index} className="w-full rounded-full bg-brand-sky" style={{ height: `${height / 2}px` }} />
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-[0.43rem] uppercase tracking-[0.12em] text-brand-cream/35">
                  <span>Input</span><span>System activity</span><span>Output</span>
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {project.screenItems.slice(0, 4).map((item, index) => (
                <div key={item} className={`rounded-2xl border p-3 shadow-sm ${index === 0 ? 'border-brand-sky/30 bg-brand-sky/20' : 'border-brand-navy/10 bg-white'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`block h-2 w-2 rounded-full ${index === 0 ? 'bg-brand-sky' : 'bg-brand-camel'}`} />
                    <span className="text-[0.44rem] font-bold uppercase tracking-[0.12em] text-brand-chocolate/35">0{index + 1}</span>
                  </div>
                  <p className="mt-3 text-[0.61rem] font-semibold leading-4 text-brand-navy">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-2xl border border-brand-navy/10 bg-white p-3 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[0.49rem] font-bold uppercase tracking-[0.16em] text-brand-chocolate/45">System layer</p>
                <span className="h-1.5 w-10 rounded-full bg-brand-camel" />
              </div>
              <p className="mt-1.5 text-[0.66rem] font-semibold text-brand-navy">{config.status}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.screenItems.slice(4).map((item) => (
                  <span key={item} className="rounded-full bg-brand-camel/30 px-2 py-1 text-[0.49rem] font-semibold text-brand-chocolate">{item}</span>
                ))}
              </div>
            </div>

            <div className="mt-auto flex items-center justify-center gap-1.5 pb-1 pt-3">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-navy/20" />
              <span className="h-1.5 w-6 rounded-full bg-brand-navy" />
              <span className="h-1.5 w-1.5 rounded-full bg-brand-navy/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
