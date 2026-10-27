import { CheckCircle2, Circle } from 'lucide-react'
import Badge from '../../../components/ui/Badge'
import { cn } from '../../../lib/cn'

const tones = { Completed: 'success', Pending: 'warning', Upcoming: 'neutral' }

export default function TaskRow({ task, status, onToggle, saving = false, disabled = false }) {
  const done = status === 'Completed'
  return (
    <li>
      <button
        type="button"
        onClick={() => onToggle(task)}
        disabled={saving || disabled}
        aria-pressed={done}
        aria-label={done ? `Mark "${task.title}" as not done` : `Mark "${task.title}" as complete`}
        className="flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-white/5 disabled:cursor-wait disabled:opacity-60"
      >
        {done ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" />
        ) : (
          <Circle className="mt-0.5 h-5 w-5 shrink-0 text-ink-faint" aria-hidden="true" />
        )}
        <span className="min-w-0 flex-1">
          <span className={cn('block text-sm', done ? 'text-ink-muted line-through decoration-ink-faint' : 'text-ink')}>{task.title}</span>
          <span className="text-xs text-ink-faint">
            {task.due} · {task.estimate}
          </span>
          {task.action && <span className="mt-1 block text-xs text-ink-muted">{task.action}</span>}
        </span>
        <Badge tone={tones[status]} className="shrink-0">
          {status}
        </Badge>
      </button>
    </li>
  )
}
