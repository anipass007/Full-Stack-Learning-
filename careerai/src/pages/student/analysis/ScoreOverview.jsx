import Card from '../../../components/ui/Card'
import ProgressBar from '../../../components/ui/ProgressBar'
import ScoreRing from '../../../components/charts/ScoreRing'

const rows = [
  { key: 'keywords', label: 'Keyword match' },
  { key: 'content', label: 'Content quality' },
  { key: 'formatting', label: 'Formatting' },
  { key: 'structure', label: 'Structure' },
]

const toneFor = (value) => (value >= 80 ? 'success' : value >= 65 ? 'brand' : 'warning')

export default function ScoreOverview({ analysis }) {
  return (
    <Card>
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center gap-3 text-center">
          <ScoreRing value={analysis.overall} size={176} strokeWidth={14} label="Estimated ATS score" sublabel="ATS score" />
          <p className="max-w-[14rem] text-sm text-ink-muted">{analysis.overall >= 80 ? 'Strong alignment by the rules used in this estimate.' : analysis.overall >= 65 ? 'Some relevant evidence found; review the gaps below.' : 'Several rule-based checks suggest areas to improve.'}</p>
        </div>
        <div>
          <h2 className="text-base font-semibold text-ink">Score breakdown</h2>
          <p className="mt-1 text-sm text-ink-muted">Weights: keywords 35%, content 30%, formatting 20%, structure 15%.</p>
          <div className="mt-5 space-y-4">
            {rows.map((row) => (
              <ProgressBar key={row.key} label={row.label} value={analysis.subscores[row.key]} showValue tone={toneFor(analysis.subscores[row.key])} />
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
