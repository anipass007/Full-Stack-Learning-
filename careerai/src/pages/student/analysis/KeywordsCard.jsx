import Card, { CardHeader } from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'

const tones = { High: 'danger', Medium: 'warning', Low: 'neutral' }

export default function KeywordsCard({ matchedKeywords = [], keywords = [] }) {
  return (
    <Card>
      <CardHeader title="Keyword comparison" description="Keywords are matched literally against your text and the target role or supplied job description." />
      <div className="space-y-5">
        <div>
          <p className="mb-2 text-sm font-medium text-ink">Matched ({matchedKeywords.length})</p>
          {matchedKeywords.length ? <div className="flex flex-wrap gap-2">{matchedKeywords.map((keyword) => <Badge key={keyword} tone="success">{keyword}</Badge>)}</div> : <p className="text-sm text-ink-faint">No target keywords were matched.</p>}
        </div>
        <div className="border-t border-line pt-4">
          <p className="mb-2 text-sm font-medium text-ink">Missing ({keywords.length})</p>
          {keywords.length ? (
            <ul className="divide-y divide-line">
              {keywords.map((item) => (
                <li key={item.keyword} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink">{item.keyword}</p>
                    <p className="text-xs text-ink-faint">{item.where}</p>
                  </div>
                  <Badge tone={tones[item.importance]}>{item.importance}</Badge>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-ink-faint">No missing terms from this target keyword set.</p>}
        </div>
      </div>
    </Card>
  )
}
