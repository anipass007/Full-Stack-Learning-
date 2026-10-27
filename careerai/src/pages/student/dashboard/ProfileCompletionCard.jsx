import { Link } from 'react-router-dom'
import { Check, Circle } from 'lucide-react'
import Card, { CardHeader } from '../../../components/ui/Card'
import ProgressBar from '../../../components/ui/ProgressBar'

export default function ProfileCompletionCard({ checklist }) {
  const done = checklist.filter((item) => item.done).length
  const percent = Math.round((done / checklist.length) * 100)

  return (
    <Card>
      <CardHeader title="Profile completion" description={`${done} of ${checklist.length} steps done`} />
      <ProgressBar value={percent} showValue tone={percent === 100 ? 'success' : 'brand'} label="Complete" />
      <ul className="mt-5 space-y-2.5">
        {checklist.map((item) => (
          <li key={item.id} className="flex items-center gap-3 text-sm">
            {item.done ? (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/15 text-success">
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            ) : (
              <Circle className="h-5 w-5 text-ink-faint" aria-hidden="true" />
            )}
            {item.done ? (
              <span className="text-ink-muted line-through decoration-ink-faint">{item.label}</span>
            ) : (
              <Link to={item.to} className="text-ink hover:text-brand-soft">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </Card>
  )
}
