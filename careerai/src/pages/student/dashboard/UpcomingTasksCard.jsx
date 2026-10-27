import { CheckCircle2, Circle } from 'lucide-react'
import Card, { CardHeader } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import ProgressBar from '../../../components/ui/ProgressBar'
import { cn } from '../../../lib/cn'

export default function UpcomingTasksCard({ roadmap }) {
  const tasks = roadmap.upcoming.slice(0, 4)

  return (
    <Card>
      <CardHeader title="Upcoming roadmap tasks" description={`${roadmap.doneCount} of ${roadmap.totalCount} tasks done`} />
      <ProgressBar value={roadmap.progress} showValue tone="success" label="Roadmap progress" size="sm" />

      {roadmap.error && <p role="alert" className="mt-3 text-sm text-danger">{roadmap.error}</p>}
      {roadmap.loading ? <p role="status" className="mt-5 text-sm text-ink-muted">Loading saved roadmap progress...</p> : roadmap.totalCount === 0 ? (
        <p className="mt-5 rounded-xl bg-bg/60 p-4 text-sm text-ink-muted">Choose a built-in role, or open Career Roadmap to enter skill requirements for a custom role.</p>
      ) : tasks.length === 0 ? (
        <p className="mt-5 rounded-xl bg-success/10 p-4 text-sm text-success">All roadmap tasks are complete.</p>
      ) : (
        <ul className="mt-5 space-y-2">
          {tasks.map((task) => (
            <li key={task.id}>
              <button
                type="button"
                onClick={() => roadmap.toggleTask(task.id)}
                disabled={Boolean(roadmap.savingTaskId)}
                aria-label={`Mark "${task.title}" as complete`}
                className="flex w-full items-start gap-3 rounded-xl p-2 text-left transition-colors hover:bg-white/5 disabled:cursor-wait disabled:opacity-60"
              >
                <Circle className={cn('mt-0.5 h-5 w-5 shrink-0 text-ink-faint')} aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-sm text-ink">{task.title}</span>
                  <span className="text-xs text-ink-faint">
                    {task.due} · {task.estimate}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <Button to="/student/roadmap" variant="secondary" size="sm" icon={CheckCircle2} className="mt-4">
        Open roadmap
      </Button>
    </Card>
  )
}
