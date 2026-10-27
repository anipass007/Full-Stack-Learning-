import { ArrowRight, ClipboardList } from 'lucide-react'
import { Link } from 'react-router-dom'
import Card, { CardHeader } from '../../../components/ui/Card'
import EmptyState from '../../../components/ui/EmptyState'
import Button from '../../../components/ui/Button'
import StatusBadge from '../../../components/ui/StatusBadge'
import { formatDate } from '../../../lib/format'

// items: [{ application, job }]
export default function RecentApplicationsCard({ items }) {
  return (
    <Card>
      <CardHeader title="Recent applications" />
      {items.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No applications yet"
          description="Apply to a job and it will show up here."
          action={<Button to="/student/jobs">Find jobs</Button>}
        />
      ) : (
        <>
          <ul className="divide-y divide-line">
            {items.map(({ application, job }) => (
              <li key={application.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <Link to={`/student/jobs/${job.id}`} className="block truncate text-sm font-medium text-ink hover:text-brand-soft">
                    {job.title}
                  </Link>
                  <p className="truncate text-xs text-ink-faint">
                    {job.company.name} · Applied {formatDate(application.appliedOn)}
                  </p>
                </div>
                <StatusBadge status={application.status} />
              </li>
            ))}
          </ul>
          <Link to="/student/applications" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-ink">
            View all applications
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </>
      )}
    </Card>
  )
}
