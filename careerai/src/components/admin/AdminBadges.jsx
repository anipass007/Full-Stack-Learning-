import Badge from '../ui/Badge'

const roleTones = { Student: 'info', Recruiter: 'brand', Admin: 'warning' }
const userTones = { Active: 'success', 'Pending verification': 'warning', Suspended: 'danger' }
const modTones = { Pending: 'warning', Approved: 'success', Rejected: 'danger', Open: 'warning', Resolved: 'success', Dismissed: 'neutral' }

export function RoleBadge({ role }) {
  return <Badge tone={roleTones[role] ?? 'neutral'}>{role}</Badge>
}

export function UserStatusBadge({ status }) {
  return <Badge tone={userTones[status] ?? 'neutral'}>{status}</Badge>
}

export function ModerationStatusBadge({ status }) {
  return <Badge tone={modTones[status] ?? 'neutral'}>{status}</Badge>
}
