import { Flag } from 'lucide-react'
import Card, { CardHeader } from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import { computeFlags } from '../../../lib/moderation'
import { formatDate } from '../../../lib/format'

export default function PendingJobsCard({ jobs }) {
  return (
    <Card>
      <CardHeader title="Jobs requiring moderation" action={<Button to="/admin/moderation" variant="ghost" size="sm">Open queue</Button>} />
      {jobs.length === 0 ? (
        <EmptyState icon={Flag} title="Queue is empty" description="No job posts are waiting for review." />
      ) : (
        <ul className="divide-y divide-line">
          {jobs.map((job) => {
            const flags = computeFlags(job)
            return (
              <li key={job.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{job.title}</p>
                    <p className="truncate text-xs text-ink-faint">
                      {job.company} · {formatDate(job.postedOn)}
                    </p>
                  </div>
                  {flags.length > 0 && <Badge tone="warning">{flags.length} {flags.length === 1 ? 'flag' : 'flags'}</Badge>}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
