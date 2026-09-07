const focusAreas = [
  'Community and accessibility',
  'Agriculture and field systems',
  'Education and robotics',
  'Business and automation',
]

export default function About() {
  return (
    <section
      id="about"
      className="bg-brand-sky py-16 text-brand-chocolate sm:py-20 lg:py-24"
      aria-labelledby="about-heading"
    >
      <div className="section-container">
        <div className="grid gap-8 border-t border-brand-chocolate/20 pt-10 lg:grid-cols-[0.32fr_0.68fr] lg:gap-16">
          <div>
            <h2 id="about-heading" className="text-sm font-bold uppercase tracking-[0.18em] text-brand-chocolate/75">
              About
            </h2>
          </div>

          <div>
            <p className="max-w-4xl text-xl leading-9 text-brand-chocolate sm:text-2xl sm:leading-10">
              I am Emmanuel Inambao, a systems engineer and technology builder from Zambia. I design and develop practical solutions using software, artificial intelligence, IoT, robotics and embedded systems.
            </p>
            <p className="mt-5 max-w-3xl text-base leading-8 text-brand-chocolate/75">
              My work focuses on solving real problems in communities, agriculture, accessibility, education, business and automation.
            </p>

            <div className="mt-8 grid gap-x-8 gap-y-3 border-t border-brand-chocolate/20 pt-5 text-sm font-medium text-brand-chocolate/75 sm:grid-cols-2">
              {focusAreas.map((area) => (
                <p key={area}>{area}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
