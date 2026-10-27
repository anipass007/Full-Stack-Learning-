import { cn } from '../../lib/cn'

export default function Card({ as: Tag = 'div', padded = true, interactive = false, className, children, ...rest }) {
  return (
    <Tag
      className={cn(
        'rounded-2xl border border-line bg-surface shadow-card',
        padded && 'p-5 sm:p-6',
        interactive && 'transition-colors duration-150 hover:border-brand/40',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export function CardHeader({ title, description, action, className }) {
  return (
    <div className={cn('mb-4 flex items-start justify-between gap-4', className)}>
      <div className="min-w-0">
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
