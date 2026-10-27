import { Flag } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import { ModerationStatusBadge } from '../../../components/admin/AdminBadges'
import { formatDate } from '../../../lib/format'

export default function ReportsList({ reports, onSetStatus }) {
  if (reports.length === 0) {
    return <EmptyState icon={Flag} title="No reports" description="Reports from students and recruiters will show up here." />
  }
  return (
    <ul className="space-y-4">
      {reports.map((report) => (
        <li key={report.id}>
          <Card>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold text-ink">{report.target}</h3>
                  <Badge>{report.targetType}</Badge>
                  <ModerationStatusBadge status={report.status} />
                </div>
                <p className="mt-1 text-sm font-medium text-ink">{report.reason}</p>
                <p className="mt-1 text-sm text-ink-muted">{report.details}</p>
                <p className="mt-2 text-xs text-ink-faint">
                  Reported by {report.reportedBy} on {formatDate(report.date)}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                {report.status === 'Open' ? (
                  <>
                    <Button size="sm" variant="secondary" onClick={() => onSetStatus(report, 'Dismissed')}>
                      Dismiss
                    </Button>
                    <Button size="sm" onClick={() => onSetStatus(report, 'Resolved')}>
                      Mark resolved
                    </Button>
                  </>
                ) : (
                  <Button size="sm" variant="ghost" onClick={() => onSetStatus(report, 'Open')}>
                    Reopen
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  )
}
