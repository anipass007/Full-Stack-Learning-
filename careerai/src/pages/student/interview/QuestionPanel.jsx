import Card from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import ProgressBar from '../../../components/ui/ProgressBar'
import { Textarea } from '../../../components/ui/Input'
import { MIN_WORDS } from '../../../data/interview'

const MAX_CHARS = 1200

export default function QuestionPanel({ question, index, total, answer, onAnswerChange, error, onSubmit, onSkip }) {
  const words = answer.trim().split(/\s+/).filter(Boolean).length

  return (
    <Card>
      <div className="mb-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-ink-muted">
            Question {index + 1} of {total}
          </p>
          <Badge tone="brand">{question.difficulty}</Badge>
        </div>
        <ProgressBar value={Math.round((index / total) * 100)} size="sm" label="Interview progress" />
      </div>

      <h2 className="text-lg font-semibold leading-snug text-ink">{question.text}</h2>

      <form
        className="mt-5 space-y-3"
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <Textarea
          label="Your answer"
          rows={7}
          maxLength={MAX_CHARS}
          placeholder="Type your answer as you would say it in an interview."
          value={answer}
          onChange={(event) => onAnswerChange(event.target.value)}
          error={error}
        />
        <p className="text-xs text-ink-faint">
          {words} {words === 1 ? 'word' : 'words'} · {answer.length}/{MAX_CHARS} characters · minimum {MIN_WORDS} words
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <Button type="submit">
            Check answer
          </Button>
          <Button variant="ghost" onClick={onSkip}>
            Skip question
          </Button>
        </div>
      </form>
    </Card>
  )
}
