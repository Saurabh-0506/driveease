import clsx from 'clsx'

export function PageShell({ title, subtitle, actions, children }) {
  return (
    <section className="animate-fadeSlide space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white md:text-3xl">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-slate-300">{subtitle}</p> : null}
        </div>
        {actions ? <div>{actions}</div> : null}
      </header>
      {children}
    </section>
  )
}

export function Card({ children, className = '' }) {
  return (
    <div className={clsx('rounded-card border border-slate-700 bg-surface/70 p-4 shadow-card transition hover:-translate-y-0.5', className)}>
      {children}
    </div>
  )
}

export function Button({ children, className = '', variant = 'primary', ...props }) {
  const variants = {
    primary: 'bg-electricBlue text-white hover:bg-blue-500',
    amber: 'bg-accentAmber text-deepNavy hover:bg-amber-300',
    ghost: 'bg-slate-700/70 text-white hover:bg-slate-600',
  }

  return (
    <button
      className={clsx(
        'rounded-control px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-electricBlue/50',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function Input({ label, error, ...props }) {
  return (
    <label className="block text-sm text-slate-200">
      <span className="mb-1 block">{label}</span>
      <input
        className="w-full rounded-control border border-slate-600 bg-deepNavy px-3 py-2 text-white outline-none transition focus:border-electricBlue"
        {...props}
      />
      {error ? <span className="mt-1 block text-xs text-red-400">{error}</span> : null}
    </label>
  )
}

export function Select({ label, error, children, ...props }) {
  return (
    <label className="block text-sm text-slate-200">
      <span className="mb-1 block">{label}</span>
      <select
        className="w-full rounded-control border border-slate-600 bg-deepNavy px-3 py-2 text-white outline-none transition focus:border-electricBlue"
        {...props}
      >
        {children}
      </select>
      {error ? <span className="mt-1 block text-xs text-red-400">{error}</span> : null}
    </label>
  )
}

export function StatusTag({ value }) {
  const palette = {
    Pending: 'bg-amber-300/15 text-amber-300',
    Confirmed: 'bg-blue-300/15 text-blue-300',
    Ongoing: 'bg-cyan-300/15 text-cyan-300',
    Completed: 'bg-emerald-300/15 text-emerald-300',
    Cancelled: 'bg-rose-300/15 text-rose-300',
    available: 'bg-emerald-300/15 text-emerald-300',
    rented: 'bg-blue-300/15 text-blue-300',
    maintenance: 'bg-amber-300/15 text-amber-300',
  }

  return (
    <span className={clsx('rounded-full px-2.5 py-1 text-xs font-semibold', palette[value] || 'bg-slate-700 text-slate-200')}>
      {value}
    </span>
  )
}

export function SkeletonBlock({ className = '' }) {
  return (
    <div
      className={clsx(
        'animate-shimmer rounded-control bg-gradient-to-r from-slate-700/70 via-slate-600/80 to-slate-700/70 bg-[length:200%_100%]',
        className,
      )}
    />
  )
}

export function DataSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, idx) => (
        <SkeletonBlock key={idx} className="h-12 w-full" />
      ))}
    </div>
  )
}

export function PageLoader({ label = 'Loading portal...' }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md space-y-4 text-center">
        <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-electricBlue/30" />
        <div>
          <h2 className="font-heading text-xl font-bold text-white">{label}</h2>
          <p className="mt-2 text-sm text-slate-300">Fetching the next premium experience for DriveEase.</p>
        </div>
        <div className="space-y-2">
          <SkeletonBlock className="h-3 w-full" />
          <SkeletonBlock className="h-3 w-5/6" />
          <SkeletonBlock className="h-3 w-4/6" />
        </div>
      </Card>
    </div>
  )
}
