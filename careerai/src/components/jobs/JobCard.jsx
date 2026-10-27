import { Link } from 'react-router-dom'
import { Bookmark, BookmarkCheck, Clock, MapPin } from 'lucide-react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import { cn } from '../../lib/cn'

function matchTone(match) {
  if (match >= 80) return 'success'
  if (match >= 60) return 'info'
  return 'warning'
}

export function MatchBadge({ match }) {
  return <Badge tone={matchTone(match)}>{match}% match</Badge>
}

// Shared by the live job search and dashboard cards. Sample fixtures keep their sample label.
export default function JobCard({ job, saved = false, applied = false, onToggleSave, compact = false }) {
  const companyName = typeof job.company === 'object' ? job.company.name : job.companyInfo?.name || job.company
  return (
    <Card interactive className={cn('flex flex-col', compact && 'p-4 sm:p-4')}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-ink"><Link to={`/student/jobs/${job.id}`} className="hover:text-brand-soft">{job.title}</Link></h3>
          <p className="mt-0.5 text-sm text-ink-muted">{companyName}</p>
        </div>
        {onToggleSave && <button type="button" onClick={() => onToggleSave(job.id)} aria-pressed={saved} aria-label={saved ? `Remove ${job.title} from saved jobs` : `Save ${job.title}`} className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-white/5', saved ? 'text-brand-soft' : 'text-ink-faint hover:text-ink')}>{saved ? <BookmarkCheck className="h-5 w-5" aria-hidden="true" /> : <Bookmark className="h-5 w-5" aria-hidden="true" />}</button>}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink-muted">
        <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" aria-hidden="true" />{job.location}</span>
        <span>{job.type}</span>
        {!compact && <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" aria-hidden="true" />{job.posted}</span>}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">{job.skills.slice(0, compact ? 3 : 4).map((skill) => <Badge key={skill}>{skill}</Badge>)}</div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">{Number.isFinite(job.match) && <MatchBadge match={job.match} />}{applied && <Badge tone="success">Applied</Badge>}</div>
        {!compact && <span className="text-xs text-ink-faint">{job.isLive ? 'Approved listing' : 'Sample job'}</span>}
      </div>
    </Card>
  )
}
