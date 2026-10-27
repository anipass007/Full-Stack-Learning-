import Card from './Card'
import { cn } from '../../lib/cn'

const tones = {
  brand: 'bg-brand/15 text-brand-soft',
  info: 'bg-accent/15 text-accent',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
}

export default function StatCard({ label, value, hint, icon: Icon, tone = 'brand' }) {
  return (
    <Card className="flex items-start gap-4">
      {Icon && (
        <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', tones[tone])}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      )}
      <div className="min-w-0">
        <p className="text-sm text-ink-muted">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-ink">{value}</p>
        {hint && <p className="mt-1 text-xs text-ink-faint">{hint}</p>}
      </div>
    </Card>
  )
}
