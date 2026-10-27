import Card, { CardHeader } from '../../../components/ui/Card'
import Avatar from '../../../components/ui/Avatar'
import Button from '../../../components/ui/Button'
import { RoleBadge } from '../../../components/admin/AdminBadges'
import { formatDate } from '../../../lib/format'
import EmptyState from '../../../components/ui/EmptyState'
import { Users } from 'lucide-react'

export default function RecentRegistrations({ users }) {
  return (
    <Card>
      <CardHeader title="Recent registrations" action={<Button to="/admin/users" variant="ghost" size="sm">All users</Button>} />
      {users.length === 0 ? <EmptyState icon={Users} title="No account profiles yet" description="New registrations will appear here." /> : <ul className="divide-y divide-line">
        {users.map((user) => (
          <li key={user.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <Avatar name={user.name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{user.name}</p>
              <p className="truncate text-xs text-ink-faint">Joined {formatDate(user.joinedOn)}</p>
            </div>
            <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
              <RoleBadge role={user.role} />
            </div>
          </li>
        ))}
      </ul>}
    </Card>
  )
}
