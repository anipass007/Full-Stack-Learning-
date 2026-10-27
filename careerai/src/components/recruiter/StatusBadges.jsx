import Badge from '../ui/Badge'

const jobTones = { Active: 'success', 'Pending review': 'warning', Rejected: 'danger', Closed: 'neutral' }
const applicantTones = { New: 'info', Shortlisted: 'brand', Interview: 'warning', Hired: 'success', Rejected: 'danger' }

export function JobStatusBadge({ status }) {
  return <Badge tone={jobTones[status] ?? 'neutral'}>{status}</Badge>
}

export function ApplicantStatusBadge({ status }) {
  return <Badge tone={applicantTones[status] ?? 'neutral'}>{status}</Badge>
}
