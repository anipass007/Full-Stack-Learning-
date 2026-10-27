import { Inbox } from 'lucide-react'
import { cn } from '../../lib/cn'

export default function EmptyState({ icon: Icon = Inbox, title, description, action, tone = 'neutral', className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center rounded-2xl border border-dashed border-line px-6 py-12 text-center', className)}>
      <span
        className={cn(
          'mb-4 flex h-12 w-12 items-center justify-center rounded-full',
          tone === 'danger' ? 'bg-danger/15 text-danger' : 'bg-brand/15 text-brand-soft',
        )}
      >
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      {description && <p className="mt-1.5 max-w-md text-sm text-ink-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
