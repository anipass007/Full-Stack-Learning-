import { Link } from 'react-router-dom'
import { Briefcase, FileUp, MessagesSquare, ScanSearch } from 'lucide-react'

const actions = [
  { to: '/student/resume', label: 'Upload resume', text: 'Add a new PDF', icon: FileUp },
  { to: '/student/resume-analysis', label: 'Analyse resume', text: 'See your ATS score', icon: ScanSearch },
  { to: '/student/mock-interview', label: 'Practise interview', text: 'Answer sample questions', icon: MessagesSquare },
  { to: '/student/jobs', label: 'Find jobs', text: 'Browse matching roles', icon: Briefcase },
]

export default function QuickActions() {
  return (
    <section aria-label="Quick actions" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <Link
            key={action.to}
            to={action.to}
            className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 shadow-card transition-colors hover:border-brand/40"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand-soft">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-ink">{action.label}</span>
              <span className="block text-xs text-ink-muted">{action.text}</span>
            </span>
          </Link>
        )
      })}
    </section>
  )
}
