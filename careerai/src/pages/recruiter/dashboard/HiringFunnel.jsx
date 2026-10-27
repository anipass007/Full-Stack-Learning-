import Card, { CardHeader } from '../../../components/ui/Card'
import ProgressBar from '../../../components/ui/ProgressBar'

const stages = [
  { status: 'New', tone: 'info' },
  { status: 'Shortlisted', tone: 'brand' },
  { status: 'Interview', tone: 'warning' },
  { status: 'Hired', tone: 'success' },
]

export default function HiringFunnel({ applicants }) {
  const total = Math.max(applicants.length, 1)
  const rejected = applicants.filter((item) => item.status === 'Rejected').length

  return (
    <Card>
      <CardHeader title="Hiring pipeline" description="Where your candidates are right now." />
      <div className="space-y-4">
        {stages.map((stage) => {
          const count = applicants.filter((item) => item.status === stage.status).length
          return (
            <div key={stage.status}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-ink-muted">{stage.status}</span>
                <span className="font-medium text-ink">{count}</span>
              </div>
              <ProgressBar value={Math.round((count / total) * 100)} tone={stage.tone} label={`${stage.status} candidates`} size="sm" className="[&>div:first-child]:hidden" />
            </div>
          )
        })}
      </div>
      <p className="mt-5 text-xs text-ink-faint">{rejected} rejected. Bars show each stage as a share of all {applicants.length} candidates.</p>
    </Card>
  )
}
