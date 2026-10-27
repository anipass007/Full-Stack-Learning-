import Card from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import { computeFlags } from '../../../lib/moderation'
import { formatDate } from '../../../lib/format'

export default function PendingJobCard({ job, onReview, onApprove, onReject }) {
  const flags = computeFlags(job)
  return (
    <Card>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-ink">{job.title}</h3>
          <p className="mt-1 text-sm text-ink-muted">
            {job.company} · posted by {job.recruiter} · {formatDate(job.postedOn)}
          </p>
          <p className="mt-3 line-clamp-2 text-sm text-ink-muted">{job.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {flags.length === 0 ? (
              <Badge tone="success">No automatic flags</Badge>
            ) : (
              flags.map((flag) => (
                <Badge key={flag.label} tone="warning">
                  {flag.label}
                </Badge>
              ))
            )}
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={() => onReview(job)}>
            Review details
          </Button>
          <Button size="sm" variant="danger" onClick={() => onReject(job)}>
            Reject
          </Button>
          <Button size="sm" onClick={() => onApprove(job)}>
            Approve
          </Button>
        </div>
      </div>
    </Card>
  )
}
