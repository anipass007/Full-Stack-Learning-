import { RotateCcw } from 'lucide-react'
import Card, { CardHeader } from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import ProgressBar from '../../../components/ui/ProgressBar'
import ScoreRing from '../../../components/charts/ScoreRing'
import { getFocusAreas } from '../../../data/interview'

const scoreTone = (score) => (score >= 75 ? 'success' : score >= 60 ? 'info' : 'warning')

export default function SummaryPanel({ summary, config, saving, saved, saveError, onRetrySave, onRetry, onNew }) {
  const focus = getFocusAreas(summary.dims)
  const missedCounts = {}
  summary.results.forEach((item) => item.evaluation?.missed.forEach((keyword) => (missedCounts[keyword] = (missedCounts[keyword] ?? 0) + 1)))
  const topMissed = Object.entries(missedCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([keyword]) => keyword)

  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-ink">Interview complete</h2>
            <p className="text-sm text-ink-muted">
              {config.role} · {config.difficulty} · {summary.answered} of {summary.total} answered
            </p>
          </div>
          <span className="text-xs text-ink-faint">Local rule-based feedback</span>
        </div>
        {saving && <p role="status" className="mb-4 text-sm text-ink-muted">Saving this session…</p>}
        {saved && <p role="status" className="mb-4 text-sm text-success">Session saved to your account.</p>}
        {saveError && <div role="alert" className="mb-4 rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger">{saveError} {onRetrySave && <button type="button" className="ml-2 font-semibold underline" onClick={onRetrySave}>Retry save</button>}</div>}
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[auto_1fr]">
          <div className="flex justify-center">
            <ScoreRing value={summary.overall} size={168} strokeWidth={13} label="Interview score" sublabel="overall" />
          </div>
          <div className="space-y-4">
            {focus
              .slice()
              .sort((a, b) => a.label.localeCompare(b.label))
              .map((area) => (
                <ProgressBar key={area.key} label={area.label} value={area.value} showValue tone={area.value >= 75 ? 'success' : area.value >= 55 ? 'brand' : 'warning'} />
              ))}
            <p className="text-xs text-ink-faint">Skipped questions count as zero in the overall score.</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Question by question" />
          <ul className="divide-y divide-line">
            {summary.results.map((item, index) => (
              <li key={item.id} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <p className="min-w-0 text-sm text-ink">
                  <span className="text-ink-faint">{index + 1}. </span>
                  {item.text}
                </p>
                {item.evaluation ? <Badge tone={scoreTone(item.evaluation.overall)}>{item.evaluation.overall}</Badge> : <Badge>Skipped</Badge>}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Improvement suggestions" />
          <ul className="space-y-4">
            {focus.slice(0, 2).map((area) => (
              <li key={area.key}>
                <p className="text-sm font-medium text-ink">{area.label}</p>
                <p className="mt-1 text-sm text-ink-muted">{area.advice}</p>
              </li>
            ))}
            {topMissed.length > 0 && (
              <li>
                <p className="text-sm font-medium text-ink">Terms to practise</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {topMissed.map((keyword) => (
                    <Badge key={keyword} tone="warning">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </li>
            )}
          </ul>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button icon={RotateCcw} onClick={onRetry}>
          Practise again
        </Button>
        <Button variant="secondary" onClick={onNew}>
          Change interview setup
        </Button>
      </div>
    </div>
  )
}
