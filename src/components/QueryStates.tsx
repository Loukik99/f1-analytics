import type { ReactNode } from 'react'

export function LoadingState({ message = 'Loading data...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-xl border border-dashed border-white/10 bg-background/40 p-6 text-sm text-white/60">
      <span className="h-3 w-3 animate-ping rounded-full bg-accent" />
      {message}
    </div>
  )
}

export function ErrorState({
  message = 'Unable to load data',
  action,
}: {
  message?: string
  action?: ReactNode
}) {
  return (
    <div className="rounded-xl border border-primary/30 bg-primary/10 p-6 text-sm text-primary/80">
      <p className="font-medium">{message}</p>
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  )
}

