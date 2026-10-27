import { cn } from '../../lib/cn'

const tones = {
  neutral: 'bg-white/8 text-ink-muted',
  brand: 'bg-brand/15 text-brand-soft',
  info: 'bg-accent/15 text-accent',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  danger: 'bg-danger/15 text-danger',
}

export default function Badge({ tone = 'neutral', className, children, ...rest }) {
  return (
    <span
      className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium', tones[tone], className)}
      {...rest}
    >
      {children}
    </span>
  )
}
