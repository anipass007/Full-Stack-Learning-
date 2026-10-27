import { Link } from 'react-router-dom'
import { ArrowRight, Users } from 'lucide-react'
import Card, { CardHeader } from '../../../components/ui/Card'
import Avatar from '../../../components/ui/Avatar'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import { ApplicantStatusBadge } from '../../../components/recruiter/StatusBadges'
import { formatDate } from '../../../lib/format'

export default function RecentApplicants({ items }) {
  return (
    <Card>
      <CardHeader title="Recent applications" />
      {items.length === 0 ? (
        <EmptyState icon={Users} title="No applications yet" description="New applicants will show up here." action={<Button to="/recruiter/jobs/new">Post a job</Button>} />
      ) : (
        <>
          <ul className="divide-y divide-line">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <Avatar name={item.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{item.name}</p>
                  <p className="truncate text-xs text-ink-faint">
                    {item.jobTitle} · {formatDate(item.appliedOn)}
                  </p>
                </div>
                <ApplicantStatusBadge status={item.status} />
              </li>
            ))}
          </ul>
          <Link to="/recruiter/applicants" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-ink">
            View all applicants
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </>
      )}
    </Card>
  )
}
