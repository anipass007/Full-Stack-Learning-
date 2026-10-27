import { useState } from 'react'
import { History, Trash2 } from 'lucide-react'
import Card, { CardHeader } from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import MiniBarChart from '../../../components/charts/MiniBarChart'
import { getFocusAreas } from '../../../data/interview'
import { formatDate } from '../../../lib/format'

const scoreTone = (score) => (score >= 75 ? 'success' : score >= 60 ? 'info' : 'warning')

export default function HistoryPanel({ history, loading, error, onClear }) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (loading) {
    return <Card><CardHeader title="Performance history" /><p className="text-sm text-ink-muted">Loading your saved interviews…</p></Card>
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader title="Performance history" />
        {error ? <p role="alert" className="mb-4 text-sm text-danger">{error}</p> : null}
        <EmptyState icon={History} title="No interviews yet" description="Finish an interview and your saved score will show up here." />
      </Card>
    )
  }

  const recent = history.slice(0, 6).reverse()
  const best = Math.max(...history.map((item) => item.score))
  const average = Math.round(history.reduce((sum, item) => sum + item.score, 0) / history.length)
  const lastThree = history.slice(0, 3)
  const dims = ['relevance', 'depth', 'clarity'].reduce((acc, key) => {
    acc[key] = Math.round(lastThree.reduce((sum, item) => sum + (item.dims?.[key] ?? 0), 0) / lastThree.length)
    return acc
  }, {})
  const focus = getFocusAreas(dims).slice(0, 2)

  return (
    <>
      <Card>
        <CardHeader
          title="Performance history"
          description={`${history.length} ${history.length === 1 ? 'interview' : 'interviews'} · best ${best} · average ${average}`}
          action={
            <Button variant="ghost" size="sm" icon={Trash2} onClick={() => setConfirmOpen(true)}>
              Clear
            </Button>
          }
        />
        <MiniBarChart label="Recent interview scores" data={recent.map((item) => ({ label: formatDate(item.date).replace(/ \d{4}$/, ''), value: item.score }))} />
        <ul className="mt-6 divide-y divide-line">
          {history.slice(0, 6).map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">
                  {item.role} · {item.difficulty}
                </p>
                <p className="text-xs text-ink-faint">
                  {formatDate(item.date)} · {item.answered} of {item.total} answered
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge>{item.category}</Badge>
                <Badge tone={scoreTone(item.score)}>{item.score}/100</Badge>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {error ? <p role="alert" className="text-sm text-danger">{error}</p> : null}

      <Card>
        <CardHeader title="Where to improve" description="Based on your last 3 interviews." />
        <ul className="space-y-4">
          {focus.map((area) => (
            <li key={area.key}>
              <p className="text-sm font-medium text-ink">
                {area.label} <span className="font-normal text-ink-faint">· average {area.value}</span>
              </p>
              <p className="mt-1 text-sm text-ink-muted">{area.advice}</p>
            </li>
          ))}
        </ul>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={onClear}
        title="Clear interview history?"
        description="All of your saved interview sessions will be deleted from your account."
        confirmLabel="Clear history"
      />
    </>
  )
}
