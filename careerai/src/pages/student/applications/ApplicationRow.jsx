import { Link } from 'react-router-dom'
import { ChevronDown, Trash2 } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import StatusBadge from '../../../components/ui/StatusBadge'
import { formatDate } from '../../../lib/format'
import { cn } from '../../../lib/cn'
import ApplicationTimeline from './ApplicationTimeline'

const ACTIVE = ['Applied', 'In review', 'Interview']

export default function ApplicationRow({ application, expanded, onToggle, onWithdraw, onRemove }) {
  const { job } = application
  const panelId = `timeline-${application.id}`
  const isActive = ACTIVE.includes(application.status)

  return (
    <Card padded={false}>
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            {job ? (
              <Link to={`/student/jobs/${job.id}`} className="text-base font-semibold text-ink hover:text-brand-soft">
                {job.title}
              </Link>
            ) : (
              <span className="text-base font-semibold text-ink">{application.title}</span>
            )}
            <StatusBadge status={application.status} />
          </div>
          <p className="mt-1 text-sm text-ink-muted">
            {application.companyName || 'Unknown company'} · Applied {formatDate(application.appliedOn)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={onToggle}
            aria-expanded={expanded}
            aria-controls={panelId}
            iconRight={ChevronDown}
            className={cn('[&>svg:last-child]:transition-transform', expanded && '[&>svg:last-child]:rotate-180')}
          >
            Timeline
          </Button>
          {isActive && (
            <Button size="sm" variant="danger" onClick={onWithdraw}>
              Withdraw
            </Button>
          )}
          {!isActive && (
            <Button size="sm" variant="ghost" icon={Trash2} onClick={onRemove} aria-label={`Remove ${application.title} from the list`}>
              Remove
            </Button>
          )}
        </div>
      </div>
      {expanded && (
        <div id={panelId} className="border-t border-line px-5 py-5">
          <ApplicationTimeline steps={application.timeline} />
        </div>
      )}
    </Card>
  )
}
