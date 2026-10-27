import { useId } from 'react'
import { cn } from '../../lib/cn'

export default function Switch({ checked, onChange, label, description, disabled = false }) {
  const labelId = useId()
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p id={labelId} className="text-sm font-medium text-ink">
          {label}
        </p>
        {description && <p className="mt-0.5 text-sm text-ink-muted">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50', checked ? 'bg-brand' : 'bg-white/15')}
      >
        <span
          aria-hidden="true"
          className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform', checked ? 'translate-x-[22px]' : 'translate-x-0.5')}
        />
      </button>
    </div>
  )
}
