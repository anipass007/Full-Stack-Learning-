import { Check, X } from 'lucide-react'
import Card, { CardHeader } from '../../../components/ui/Card'

function List({ items, icon: Icon, tone }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm text-ink-muted">
          <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${tone}`}>
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          {item}
        </li>
      ))}
    </ul>
  )
}

export default function StrengthsWeaknesses({ strengths, weaknesses }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <Card>
        <CardHeader title="Strengths" />
        <List items={strengths} icon={Check} tone="bg-success/15 text-success" />
      </Card>
      <Card>
        <CardHeader title="Weaknesses" />
        <List items={weaknesses} icon={X} tone="bg-danger/15 text-danger" />
      </Card>
    </div>
  )
}
