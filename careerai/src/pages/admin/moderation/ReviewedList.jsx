import { ClipboardCheck } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import { ModerationStatusBadge } from '../../../components/admin/AdminBadges'
import { formatDate } from '../../../lib/format'

export default function ReviewedList({ jobs, onReview, onUndo }) {
  if (jobs.length === 0) {
    return <EmptyState icon={ClipboardCheck} title="Nothing reviewed yet" description="Approved and rejected jobs will be listed here." />
  }
  return (
    <ul className="space-y-4">
      {jobs.map((job) => (
        <li key={job.id}>
          <Card>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold text-ink">{job.title}</h3>
                  <ModerationStatusBadge status={job.status} />
                </div>
                <p className="mt-1 text-sm text-ink-muted">
                  {job.company} · decided {formatDate(job.decidedOn)}
                </p>
                {job.reason && <p className="mt-1 text-sm text-ink-muted">Reason: {job.reason}</p>}
              </div>
              <div className="flex shrink-0 gap-2">
                <Button size="sm" variant="secondary" onClick={() => onReview(job)}>
                  View
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onUndo(job)}>
                  Undo decision
                </Button>
              </div>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  )
}
