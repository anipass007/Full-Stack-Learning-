import { ShieldCheck } from 'lucide-react'
import Card, { CardHeader } from '../../../components/ui/Card'
import Avatar from '../../../components/ui/Avatar'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'

export default function PendingVerifications({ users, onVerify }) {
  return (
    <Card>
      <CardHeader title="Pending recruiter verifications" description="Check the company before letting a recruiter post jobs." />
      {users.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="All caught up" description="No recruiters are waiting for verification." />
      ) : (
        <ul className="divide-y divide-line">
          {users.map((user) => (
            <li key={user.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <Avatar name={user.name} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{user.name}</p>
                <p className="truncate text-xs text-ink-faint">{user.detail}</p>
              </div>
              <Button size="sm" onClick={() => onVerify(user)}>
                Verify
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
