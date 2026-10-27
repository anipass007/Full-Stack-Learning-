import Card, { CardHeader } from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import ProgressBar from '../../../components/ui/ProgressBar'
import { sectionStatus } from '../../../data/resumes'

export default function SectionFeedback({ sections }) {
  return (
    <section aria-labelledby="section-feedback">
      <h2 id="section-feedback" className="mb-4 text-lg font-semibold text-ink">
        Section-wise feedback
      </h2>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((item) => {
          const status = sectionStatus(item.score)
          return (
            <Card key={item.id} className="flex flex-col">
              <CardHeader title={item.section} action={<Badge tone={status.tone}>{status.label}</Badge>} className="mb-3" />
              <ProgressBar value={item.score} showValue size="sm" tone={status.tone === 'warning' ? 'warning' : status.tone === 'success' ? 'success' : 'info'} label="Section score" />
              <p className="mt-4 text-sm text-ink">{item.feedback}</p>
              <p className="mt-2 text-sm text-ink-muted">
                <span className="font-medium text-ink">Try this: </span>
                {item.suggestion}
              </p>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
