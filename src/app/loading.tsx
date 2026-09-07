export default function Loading() {
  return (
    <main className="min-h-screen bg-dark-950 px-4 py-24 text-dark-100">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary-400">Emmanuel Inambao · Systems Engineer</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold text-white sm:text-5xl">
          AI, IoT, robotics, embedded systems and full-stack engineering.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-dark-400">
          Loading the interactive portfolio. Project, case-study and contact content remains available as server-rendered routes.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3" aria-hidden="true">
          {[1, 2, 3].map(item => (
            <div key={item} className="h-32 animate-pulse rounded-2xl border border-dark-800 bg-dark-900/60" />
          ))}
        </div>
      </div>
    </main>
  )
}
