export default function Loading() {
  return (
    <main className="min-h-screen bg-dark-950 light:bg-[#F7F5EF] px-4 py-24 text-dark-100" aria-busy="true">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary-400">Emmanuel Inambao · Robotics & IoT Engineer</p>
        <p className="mt-4 max-w-4xl text-4xl font-bold text-white light:text-[#10243E] sm:text-5xl">
          Robotics, IoT, embedded systems and full-stack engineering.
        </p>
        <p className="sr-only" role="status">Loading…</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3" aria-hidden="true">
          {[1, 2, 3].map(item => (
            <div key={item} className="h-32 animate-pulse rounded-2xl border border-dark-800 bg-dark-900/60 light:border-[#DDD7CC] light:bg-white/60" />
          ))}
        </div>
      </div>
    </main>
  )
}
