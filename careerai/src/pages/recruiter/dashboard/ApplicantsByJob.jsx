import Card, { CardHeader } from '../../../components/ui/Card'
import EmptyState from '../../../components/ui/EmptyState'

export default function ApplicantsByJob({ rows }) {
  const max = Math.max(1, ...rows.map((row) => row.count))
  return (
    <Card>
      <CardHeader title="Applicants by job" description="Your most popular openings." />
      {rows.length === 0 ? (
        <EmptyState title="No data yet" description="Post a job to start collecting applicants." />
      ) : (
        <ul className="space-y-4">
          {rows.map((row) => (
            <li key={row.id}>
              <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                <span className="truncate text-ink">{row.title}</span>
                <span className="shrink-0 font-medium text-ink">{row.count}</span>
              </div>
              <div
                role="img"
                aria-label={`${row.title}: ${row.count} applicants`}
                className="h-2.5 w-full overflow-hidden rounded-full bg-white/8"
              >
                <div className="h-full rounded-full bg-brand transition-[width] duration-500" style={{ width: `${(row.count / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
