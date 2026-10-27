import Card, { CardHeader } from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'

const tones = { High: 'danger', Medium: 'warning', Low: 'neutral' }

export default function Suggestions({ suggestions }) {
  return (
    <Card>
      <CardHeader title="Actionable suggestions" description="Work through these in order." />
      <ol className="space-y-4">
        {suggestions.map((item, index) => (
          <li key={item.action} className="flex items-start gap-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/15 text-sm font-semibold text-brand-soft">
              {index + 1}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-ink">{item.action}</p>
                <Badge tone={tones[item.priority]}>{item.priority} priority</Badge>
              </div>
              <p className="mt-1 text-sm text-ink-muted">{item.why}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-6 border-t border-line pt-5 text-xs text-ink-faint">Add keywords only when they accurately describe your skills or experience.</p>
    </Card>
  )
}
