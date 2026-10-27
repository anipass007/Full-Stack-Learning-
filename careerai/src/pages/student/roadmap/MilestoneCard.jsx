import Card from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import ProgressBar from '../../../components/ui/ProgressBar'
import TaskRow from './TaskRow'

const tones = { Completed: 'success', 'In progress': 'brand', Upcoming: 'neutral' }

export default function MilestoneCard({ milestone, index, status, tasks, doneCount, onToggle, savingTaskId, disabled = false }) {
  const percent = Math.round((doneCount / milestone.tasks.length) * 100)
  return (
    <li className="relative pl-12">
      <span
        aria-hidden="true"
        className="absolute left-0 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface-raised text-sm font-semibold text-ink"
      >
        {index + 1}
      </span>
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-ink">{milestone.title}</h3>
            <p className="mt-1 text-sm text-ink-muted">{milestone.description}</p>
          </div>
          <Badge tone={tones[status]}>{status}</Badge>
        </div>
        <ProgressBar
          className="mt-4"
          value={percent}
          size="sm"
          tone={status === 'Completed' ? 'success' : 'brand'}
          label={`${doneCount} of ${milestone.tasks.length} tasks done`}
        />
        <ul className="mt-3 space-y-1">
          {tasks.map(({ task, status: taskStatus }) => (
            <TaskRow key={task.id} task={task} status={taskStatus} onToggle={onToggle} saving={Boolean(savingTaskId)} disabled={disabled} />
          ))}
        </ul>
      </Card>
    </li>
  )
}
