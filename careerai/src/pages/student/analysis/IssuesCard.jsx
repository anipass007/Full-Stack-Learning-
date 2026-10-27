import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import Card, { CardHeader } from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import Tabs from '../../../components/ui/Tabs'

const tones = { High: 'danger', Medium: 'warning', Low: 'neutral' }

export default function IssuesCard({ issues }) {
  const [filter, setFilter] = useState('all')
  const tabs = [
    { id: 'all', label: 'All', count: issues.length },
    { id: 'Formatting', label: 'Formatting', count: issues.filter((item) => item.type === 'Formatting').length },
    { id: 'Content', label: 'Content', count: issues.filter((item) => item.type === 'Content').length },
  ]
  const visible = filter === 'all' ? issues : issues.filter((item) => item.type === filter)

  return (
    <Card>
      <CardHeader title="Formatting and content issues" description="Fix the high-severity items first." />
      <Tabs tabs={tabs} value={filter} onChange={setFilter} label="Filter issues" className="mb-4" />
      {visible.length === 0 ? <p className="text-sm text-ink-muted">No issues were found by these checks.</p> : <ul className="space-y-3">
        {visible.map((issue) => (
          <li key={issue.title} className="flex items-start gap-3 rounded-xl bg-bg/50 p-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-ink">{issue.title}</p>
                <Badge tone={tones[issue.severity]}>{issue.severity}</Badge>
                <Badge>{issue.type}</Badge>
              </div>
              <p className="mt-1 text-sm text-ink-muted">{issue.detail}</p>
            </div>
          </li>
        ))}
      </ul>}
    </Card>
  )
}
