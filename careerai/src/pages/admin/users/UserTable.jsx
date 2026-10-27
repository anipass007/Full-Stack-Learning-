import Avatar from '../../../components/ui/Avatar'
import Button from '../../../components/ui/Button'
import { RoleBadge } from '../../../components/admin/AdminBadges'
import { formatDate } from '../../../lib/format'

export default function UserTable({ users, onView }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface shadow-card">
      <table className="w-full min-w-[620px] text-left text-sm">
        <caption className="sr-only">Platform users</caption>
        <thead>
          <tr className="border-b border-line text-xs text-ink-faint">
            <th scope="col" className="px-5 py-3 font-medium">User</th>
            <th scope="col" className="px-3 py-3 font-medium">Role</th>
            <th scope="col" className="px-3 py-3 font-medium">Joined</th>
            <th scope="col" className="px-5 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {users.map((user) => (
            <tr key={user.id} className="transition-colors hover:bg-white/5">
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <Avatar name={user.name} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{user.name}</p>
                    <p className="truncate text-xs text-ink-faint">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-3 py-3"><RoleBadge role={user.role} /></td>
              <td className="px-3 py-3 text-ink-muted">{formatDate(user.joinedOn)}</td>
              <td className="px-5 py-3 text-right">
                <Button size="sm" variant="secondary" onClick={() => onView(user)} aria-label={`View and manage ${user.name}`}>
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
