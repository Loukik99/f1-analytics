import type { ReactNode } from 'react'

type CardProps = {
  title: string
  subtitle?: string
  action?: ReactNode
  footer?: ReactNode
  className?: string
  children: ReactNode
}

export function Card({
  title,
  subtitle,
  action,
  footer,
  className = '',
  children,
}: CardProps) {
  return (
    <section
      className={`rounded-2xl bg-surface/60 p-6 shadow-lg shadow-black/30 ring-1 ring-white/5 backdrop-blur ${className}`}
    >
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold uppercase tracking-wide text-accent">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1 text-sm text-white/60">{subtitle}</p>
          ) : null}
        </div>
        {action ? <div className="flex-shrink-0">{action}</div> : null}
      </header>
      <div>{children}</div>
      {footer ? <footer className="mt-6 text-sm text-white/60">{footer}</footer> : null}
    </section>
  )
}

