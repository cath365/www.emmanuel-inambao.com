import type { ShowcaseProject } from '@/data/portfolio'

interface PixelPhoneMockupProps {
  project: ShowcaseProject
}

const screenConfig = {
  assistant: {
    eyebrow: 'Device OS',
    title: 'AI Assistant',
    feature: 'Ready for device commands',
    status: 'Camera · Wi-Fi · Bluetooth · SIM',
  },
  walking: {
    eyebrow: 'Assistive Navigation',
    title: 'Safe Route',
    feature: 'Obstacle guidance active',
    status: 'Map · Voice · Smart stick',
  },
  oil: {
    eyebrow: 'Dispensing',
    title: 'Device Dashboard',
    feature: 'Pump and transaction control',
    status: 'Quantity · Payments · Reports',
  },
  quotation: {
    eyebrow: 'Business Workspace',
    title: 'New Quotation',
    feature: 'Customer and order workflow',
    status: 'Catalogue · Status · Receipt',
  },
  livestock: {
    eyebrow: 'Livestock Monitor',
    title: 'Animal Location',
    feature: 'Geofence monitoring',
    status: 'Map · Health · Battery',
  },
  robotics: {
    eyebrow: 'Robot Control',
    title: 'ESP32 Connected',
    feature: 'Manual and automatic control',
    status: 'Sensors · Temperature · Humidity',
  },
} as const

export default function PixelPhoneMockup({ project }: PixelPhoneMockupProps) {
  const config = screenConfig[project.screenVariant]

  return (
    <div
      className="relative mx-auto w-full max-w-[19rem] select-none sm:max-w-[20rem]"
      aria-hidden="true"
    >
      <div className="absolute -inset-5 rounded-full bg-brand-sky/10 blur-3xl" />

      <div className="relative rounded-[3.25rem] border border-brand-navy/10 bg-brand-chocolate p-[0.55rem] shadow-[0_30px_80px_rgba(0,11,38,0.25)] dark:border-brand-cream/10">
        <div className="pointer-events-none absolute left-1/2 top-4 z-20 flex h-9 w-[58%] -translate-x-1/2 items-center justify-center gap-2 rounded-full border border-brand-cream/10 bg-brand-navy shadow-lg">
          <span className="h-4 w-4 rounded-full border border-brand-sky/30 bg-[#071535]" />
          <span className="h-4 w-4 rounded-full border border-brand-sky/30 bg-[#071535]" />
          <span className="h-2.5 w-2.5 rounded-full bg-brand-camel" />
        </div>

        <div className="relative aspect-[9/19.5] overflow-hidden rounded-[2.75rem] bg-brand-cream">
          <div className="flex h-full flex-col px-4 pb-4 pt-16">
            <div className="flex items-center justify-between text-[0.58rem] font-semibold uppercase tracking-[0.13em] text-brand-chocolate/60">
              <span>Emmanuel Systems</span>
              <span>Connected</span>
            </div>

            <div className="mt-4 rounded-[1.5rem] bg-brand-navy p-4 text-brand-cream">
              <p className="text-[0.56rem] font-bold uppercase tracking-[0.2em] text-brand-camel">
                {config.eyebrow}
              </p>
              <p className="mt-2 font-serif text-2xl font-semibold leading-none text-brand-cream">
                {config.title}
              </p>
              <p className="mt-3 text-[0.7rem] leading-5 text-brand-cream/60">
                {config.feature}
              </p>

              <div className="mt-4 h-16 overflow-hidden rounded-2xl border border-brand-sky/20 bg-brand-sky/10 p-3">
                <div className="grid h-full grid-cols-5 items-end gap-1">
                  {[42, 70, 54, 84, 63].map((height, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-brand-sky"
                      style={{ height: String(height) + '%' }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {project.screenItems.slice(0, 4).map((item, index) => (
                <div
                  key={item}
                  className={
                    'rounded-2xl border p-3 ' +
                    (index === 0
                      ? 'border-brand-sky/30 bg-brand-sky/20'
                      : 'border-brand-navy/10 bg-white')
                  }
                >
                  <span
                    className={
                      'mb-2 block h-2 w-2 rounded-full ' +
                      (index === 0 ? 'bg-brand-sky' : 'bg-brand-camel')
                    }
                  />
                  <p className="text-[0.62rem] font-semibold leading-4 text-brand-navy">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-2xl border border-brand-navy/10 bg-white p-3">
              <p className="text-[0.52rem] font-bold uppercase tracking-[0.15em] text-brand-chocolate/50">
                Live interface
              </p>
              <p className="mt-1 text-[0.68rem] font-semibold text-brand-navy">{config.status}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.screenItems.slice(4).map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-brand-cream px-2 py-1 text-[0.52rem] font-semibold text-brand-chocolate"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-auto flex items-center justify-center gap-1.5 pb-1 pt-3">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-navy/25" />
              <span className="h-1.5 w-5 rounded-full bg-brand-navy" />
              <span className="h-1.5 w-1.5 rounded-full bg-brand-navy/25" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
