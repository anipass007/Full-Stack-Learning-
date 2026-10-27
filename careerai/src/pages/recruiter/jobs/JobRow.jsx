import { Link } from 'react-router-dom'
import { Lock, Pencil, RotateCcw, Trash2, Users } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import { JobStatusBadge } from '../../../components/recruiter/StatusBadges'
import { formatDate, formatSalary } from '../../../lib/format'

export default function JobRow({ job, applicantCount, onEdit, onClose, onReopen, onDelete }) {
  return (
    <Card>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-base font-semibold text-ink">{job.title}</h3>
            <JobStatusBadge status={job.status} />
          </div>
          <p className="mt-1 text-sm text-ink-muted">
            {job.location} · {job.type} · {job.experience} · {formatSalary(job)}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {job.skills.slice(0, 5).map((skill) => (
              <Badge key={skill}>{skill}</Badge>
            ))}
          </div>
          <p className="mt-3 text-xs text-ink-faint">
            Posted {formatDate(job.postedOn)}
            {job.deadline ? ` · Deadline ${formatDate(job.deadline)}` : ''}
          </p>
          {job.status === 'Rejected' && (
            <p className="mt-2 text-xs text-danger">Rejected by admin{job.rejectionReason ? `: ${job.rejectionReason}` : '.'} Edit the job and post it again.</p>
          )}
          {job.status === 'Pending review' && (
            <p className="mt-2 text-xs text-warning">Waiting for admin approval before candidates can see this job.</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 lg:max-w-xs lg:justify-end">
          <Link
            to={`/recruiter/applicants?job=${job.id}`}
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm font-medium text-ink transition-colors hover:bg-surface-raised"
          >
            <Users className="h-4 w-4" aria-hidden="true" />
            {applicantCount} {applicantCount === 1 ? 'applicant' : 'applicants'}
          </Link>
          <Button size="sm" variant="secondary" icon={Pencil} onClick={() => onEdit(job)}>
            Edit
          </Button>
            {job.status === 'Closed' ? (
            <Button size="sm" variant="secondary" icon={RotateCcw} onClick={() => onReopen(job)}>
              Reopen
            </Button>
            ) : job.status === 'Active' ? (
            <Button size="sm" variant="secondary" icon={Lock} onClick={() => onClose(job)}>
              Close
            </Button>
            ) : null}
          <Button size="sm" variant="danger" icon={Trash2} onClick={() => onDelete(job)} aria-label={`Delete ${job.title}`}>
            Delete
          </Button>
        </div>
      </div>
    </Card>
  )
}
