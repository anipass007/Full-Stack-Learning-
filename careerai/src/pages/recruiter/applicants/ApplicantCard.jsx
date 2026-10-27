import { Eye } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Avatar from '../../../components/ui/Avatar'
import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import { Select } from '../../../components/ui/Input'
import { ApplicantStatusBadge } from '../../../components/recruiter/StatusBadges'
import { MatchBadge } from '../../../components/jobs/JobCard'
import { applicantStatuses } from '../../../data/recruiter'
import { formatDate } from '../../../lib/format'

export default function ApplicantCard({ applicant, onView, onStatusChange, saving = false }) {
  return (
    <Card className="flex flex-col">
      <div className="flex items-start gap-3">
        <Avatar name={applicant.name} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-ink">{applicant.name}</h3>
            <ApplicantStatusBadge status={applicant.status} />
          </div>
          <p className="truncate text-sm text-ink-muted">{applicant.jobTitle}</p>
        </div>
        <MatchBadge match={applicant.match} />
      </div>

      <p className="mt-4 text-sm text-ink-muted">
        {[applicant.education, applicant.experience].filter(Boolean).join(' · ') || 'Education not provided'}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {applicant.skills.slice(0, 5).map((skill) => (
          <Badge key={skill}>{skill}</Badge>
        ))}
      </div>
      <p className="mt-3 text-xs text-ink-faint">Applied {formatDate(applicant.appliedOn)}</p>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <Select label="Update status" value={applicant.status} disabled={saving} onChange={(event) => onStatusChange(applicant, event.target.value)}>
          {applicantStatuses.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </Select>
        <Button variant="secondary" icon={Eye} className="h-11" onClick={() => onView(applicant)}>
          View details
        </Button>
      </div>
    </Card>
  )
}
