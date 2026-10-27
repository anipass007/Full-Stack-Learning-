import StatusBadge from '../../../components/ui/StatusBadge'
import { formatDate } from '../../../lib/format'
import { cn } from '../../../lib/cn'

export default function ApplicationTimeline({ steps }) {
  return (
    <ol className="space-y-4">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1
        return (
          <li key={`${step.status}-${step.date}`} className="relative flex gap-4">
            <span className="relative flex w-3 shrink-0 justify-center">
              {!isLast && <span className="absolute top-4 h-[calc(100%+0.5rem)] w-px bg-line" aria-hidden="true" />}
              <span className={cn('mt-1.5 h-3 w-3 rounded-full', isLast ? 'bg-brand ring-4 ring-brand/20' : 'bg-ink-faint')} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={step.status} />
                <span className="text-xs text-ink-faint">{formatDate(step.date)}</span>
              </div>
              {step.note && <p className="mt-1 text-sm text-ink-muted">{step.note}</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
