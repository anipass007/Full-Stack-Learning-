import { cn } from '../../lib/cn'

const tones = { brand: 'bg-brand', info: 'bg-accent', success: 'bg-success', warning: 'bg-warning', danger: 'bg-danger' }

export default function ProgressBar({ value, tone = 'brand', label, showValue = false, size = 'md', className }) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
          {label && <span className="text-ink-muted">{label}</span>}
          {showValue && <span className="font-medium text-ink">{clamped}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Progress'}
        className={cn('w-full overflow-hidden rounded-full bg-white/8', size === 'sm' ? 'h-1.5' : 'h-2.5')}
      >
        <div className={cn('h-full rounded-full transition-[width] duration-500', tones[tone])} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  )
}
