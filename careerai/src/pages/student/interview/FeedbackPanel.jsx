import { ArrowRight, Check, Lightbulb, TrendingUp } from 'lucide-react'
import Card, { CardHeader } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import ProgressBar from '../../../components/ui/ProgressBar'
import ScoreRing from '../../../components/charts/ScoreRing'

const toneFor = (value) => (value >= 75 ? 'success' : value >= 55 ? 'brand' : 'warning')

export default function FeedbackPanel({ question, evaluation, isLast, onNext }) {
  return (
    <div className="space-y-5">
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-ink">Feedback on your answer</h2>
          <span className="text-xs text-ink-faint">Local rule-based feedback</span>
        </div>
        <p className="mb-5 text-sm text-ink-muted">{question.text}</p>
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[auto_1fr]">
          <div className="flex justify-center">
            <ScoreRing value={evaluation.overall} size={130} strokeWidth={11} label="Answer score" sublabel="this answer" />
          </div>
          <div className="space-y-3">
            <ProgressBar label="Relevance (key terms covered)" value={evaluation.relevance} showValue size="sm" tone={toneFor(evaluation.relevance)} />
            <ProgressBar label="Completeness (level of detail)" value={evaluation.depth} showValue size="sm" tone={toneFor(evaluation.depth)} />
            <ProgressBar label="Clarity (structure)" value={evaluation.clarity} showValue size="sm" tone={toneFor(evaluation.clarity)} />
            <p className="text-xs text-ink-faint">Your answer had {evaluation.wordCount} words. The score checks key terms, length and structure only.</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Card>
          <CardHeader title="What worked" />
          <ul className="space-y-2.5">
            {evaluation.strengths.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-ink-muted">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardHeader title="How to improve" />
          {evaluation.improvements.length === 0 ? (
            <p className="text-sm text-ink-muted">No obvious gaps. Keep this level of detail.</p>
          ) : (
            <ul className="space-y-2.5">
              {evaluation.improvements.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink-muted">
                  <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card>
        <div className="flex items-start gap-3">
          <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
          <div>
            <h3 className="text-sm font-semibold text-ink">What a strong answer covers</h3>
            <p className="mt-1.5 text-sm text-ink-muted">{question.ideal}</p>
          </div>
        </div>
      </Card>

      <Button iconRight={ArrowRight} onClick={onNext}>
        {isLast ? 'Finish interview' : 'Next question'}
      </Button>
    </div>
  )
}
