import { AlertTriangle } from 'lucide-react'
import Modal from '../../../components/ui/Modal'
import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import { computeFlags } from '../../../lib/moderation'
import { formatDate, formatSalary } from '../../../lib/format'

export default function JobReviewModal({ job, onClose, onApprove, onReject }) {
  const flags = job ? computeFlags(job) : []
  const pending = job?.status === 'Pending'
  return (
    <Modal
      open={Boolean(job)}
      onClose={onClose}
      title={job?.title ?? 'Job'}
      description={job ? `${job.company} · posted by ${job.recruiter} on ${formatDate(job.postedOn)}` : undefined}
      size="lg"
      footer={
        job && (
          <>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            {pending && (
              <>
                <Button variant="danger" onClick={() => onReject(job)}>
                  Reject
                </Button>
                <Button onClick={() => onApprove(job)}>Approve</Button>
              </>
            )}
          </>
        )
      }
    >
      {job && (
        <div className="space-y-5">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-ink">Automatic checks</h3>
            {flags.length === 0 ? (
              <p className="rounded-xl bg-success/10 p-3 text-sm text-success">No flags were raised for this post.</p>
            ) : (
              <ul className="space-y-2">
                {flags.map((flag) => (
                  <li key={flag.label} className="flex items-start gap-3 rounded-xl bg-warning/10 p-3 text-sm">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
                    <span className="text-ink-muted">
                      <span className="font-medium text-ink">{flag.label}. </span>
                      {flag.note}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-2 text-xs text-ink-faint">These checks look for simple patterns only. A person still has to decide.</p>
          </div>

          <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-ink-faint">Location</dt>
              <dd className="mt-1 text-ink">{job.location}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-faint">Type and experience</dt>
              <dd className="mt-1 text-ink">
                {job.type} · {job.experience}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink-faint">Salary</dt>
              <dd className="mt-1 text-ink">{formatSalary(job)}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs text-ink-faint">Description</dt>
              <dd className="mt-1 text-ink-muted">{job.description}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs text-ink-faint">Skills</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <Badge key={skill} tone="brand">
                    {skill}
                  </Badge>
                ))}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </Modal>
  )
}
