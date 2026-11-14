import { cn } from '@/lib/utils'

export function BrandMark({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3 min-w-0', className)}>
      <div
        className="w-9 h-9 rounded-lg bg-[var(--color-brand)] text-white font-bold text-sm flex items-center justify-center shrink-0"
        aria-hidden="true"
      >
        SA
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[var(--text-primary)] leading-tight">
          Shopping Analytics &amp; Loyalty Hub
        </p>
        <p className="text-xs text-[var(--text-muted)]">Equipe 22 — Ho-Ho</p>
      </div>
    </div>
  )
}
