import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type BadgeTone = 'neutral' | 'brand' | 'analytics' | 'success' | 'warning' | 'danger'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
}

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] border-[var(--border-hairline)]',
  brand: 'bg-[var(--color-brand-soft)] text-[var(--color-brand)] border-transparent',
  analytics: 'bg-[var(--color-analytics-soft)] text-[var(--color-analytics)] border-transparent',
  success: 'bg-[var(--color-success-soft)] text-[var(--color-success)] border-transparent',
  warning: 'bg-[var(--color-warning-soft)] text-[var(--color-warning)] border-transparent',
  danger: 'bg-[var(--color-danger-soft)] text-[var(--color-danger)] border-transparent',
}

export function Badge({ className, tone = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-[var(--radius-pill)] border whitespace-nowrap',
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  )
}

