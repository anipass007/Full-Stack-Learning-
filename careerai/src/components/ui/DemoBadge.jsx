import { FlaskConical } from 'lucide-react'
import Badge from './Badge'

// Small label for anything that is sample data or a simulated feature.
export function DemoBadge({ children = 'Demo data', className }) {
  return (
    <Badge tone="warning" className={className} title="Simulated in the frontend. A real version needs a backend.">
      <FlaskConical className="h-3 w-3" aria-hidden="true" />
      {children}
    </Badge>
  )
}

// Banner that explains what is simulated on a page.
export function DemoNotice({ children }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-warning/25 bg-warning/10 px-4 py-3 text-sm text-ink-muted">
      <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
      <p>{children}</p>
    </div>
  )
}
