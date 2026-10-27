import Badge from './Badge'

const tones = {
  Applied: 'info',
  'In review': 'brand',
  Interview: 'warning',
  Offer: 'success',
  Rejected: 'danger',
  Withdrawn: 'neutral',
}

export default function StatusBadge({ status }) {
  return <Badge tone={tones[status] ?? 'neutral'}>{status}</Badge>
}
