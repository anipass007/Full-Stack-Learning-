import { Eye, FileText, ScanSearch, Star, Trash2 } from 'lucide-react'
import Card, { CardHeader } from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import { formatDate, formatFileSize } from '../../../lib/format'

export default function ResumeList({ resumes, onView, onDelete, onMakePrimary }) {
  return (
    <Card>
      <CardHeader title="Your resumes" description={`${resumes.length} of 5 saved`} />
      {resumes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No resumes yet"
          description="Choose a PDF in the upload area above. It will appear here with its size and date."
        />
      ) : (
        <ul className="divide-y divide-line">
          {resumes.map((resume) => (
            <li key={resume.id} className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <FileText className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-medium text-ink">{resume.name}</p>
                    {resume.primary && <Badge tone="brand">Primary</Badge>}
                    {resume.sample && <Badge tone="warning">Sample</Badge>}
                  </div>
                  <p className="mt-0.5 text-xs text-ink-faint">
                    PDF · {formatFileSize(resume.size)} · Added {formatDate(resume.uploadedAt)}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 sm:justify-end">
                {!resume.primary && (
                  <Button size="sm" variant="ghost" icon={Star} onClick={() => onMakePrimary(resume)}>
                    Make primary
                  </Button>
                )}
                <Button size="sm" variant="secondary" icon={Eye} onClick={() => onView(resume)}>
                  View
                </Button>
                <Button size="sm" variant="secondary" icon={ScanSearch} to="/student/resume-analysis" state={{ resumeId: resume.id }}>
                  Analyse
                </Button>
                <Button size="sm" variant="danger" icon={Trash2} onClick={() => onDelete(resume)} aria-label={`Delete ${resume.name}`}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
