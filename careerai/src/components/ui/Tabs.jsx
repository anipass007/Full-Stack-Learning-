import { cn } from '../../lib/cn'

// tabs: [{ id, label, count? }]
export default function Tabs({ tabs, value, onChange, label = 'Sections', className }) {
  return (
    <div role="tablist" aria-label={label} className={cn('flex gap-1 overflow-x-auto rounded-xl border border-line bg-bg/50 p-1', className)}>
      {tabs.map((tab) => {
        const active = tab.id === value
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={cn(
              'inline-flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors',
              active ? 'bg-surface-raised text-ink' : 'text-ink-muted hover:text-ink',
            )}
          >
            {tab.label}
            {tab.count != null && (
              <span className={cn('rounded-full px-1.5 text-xs', active ? 'bg-brand/25 text-brand-soft' : 'bg-white/8 text-ink-faint')}>
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
