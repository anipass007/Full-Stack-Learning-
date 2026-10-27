import { useState } from 'react'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { MIN_WORDS, evaluateAnswer, getQuestions, interviewRoles } from '../../data/interview'
import { useInterviewHistory } from '../../hooks/useInterviewHistory'
import { useToast } from '../../hooks/useToast'
import { useAuth } from '../../context/AuthContext'
import { createInterviewSession } from '../../services/interviewApi'
import SetupPanel from './interview/SetupPanel'
import HistoryPanel from './interview/HistoryPanel'
import QuestionPanel from './interview/QuestionPanel'
import FeedbackPanel from './interview/FeedbackPanel'
import SummaryPanel from './interview/SummaryPanel'

const average = (values) => (values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0)

export default function MockInterview() {
  const toast = useToast()
  const { user, profile } = useAuth()
  const { history, loading: historyLoading, error: historyError, refresh, clear } = useInterviewHistory()

  const [stage, setStage] = useState('setup') // setup | interview | summary
  const [config, setConfig] = useState({
    role: interviewRoles.includes(profile?.target_role) ? profile.target_role : interviewRoles[0],
    difficulty: 'Medium',
    category: 'Technical',
  })
  const [questions, setQuestions] = useState([])
  const [index, setIndex] = useState(0)
  const [results, setResults] = useState([])
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [summary, setSummary] = useState(null)
  const [endOpen, setEndOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')

  const begin = (nextConfig = config) => {
    setQuestions(getQuestions(nextConfig.role, nextConfig.difficulty, nextConfig.category))
    setIndex(0)
    setResults([])
    setAnswer('')
    setError('')
    setFeedback(null)
    setSummary(null)
    setSaved(false)
    setSaveError('')
    setStage('interview')
  }

  const question = questions[index]
  const isLast = index === questions.length - 1

  const persist = async (nextSummary) => {
    if (!user?.id) {
      setSaveError('Your interview was scored locally but was not saved. Sign in again and retry.')
      return
    }
    setSaving(true)
    setSaveError('')
    try {
      await createInterviewSession(user.id, {
        targetRole: config.role,
        difficulty: config.difficulty,
        score: nextSummary.overall,
        answeredCount: nextSummary.answered,
        questionCount: nextSummary.total,
        answers: nextSummary.results.map((item) => ({
          questionId: item.id,
          question: item.text,
          category: config.category,
          answer: item.answer,
          evaluation: item.evaluation,
        })),
      })
      setSaved(true)
      await refresh()
      toast.success('Interview saved to your account.')
    } catch (error) {
      setSaveError(error.message || 'Could not save this interview. Your answers remain on this screen; retry when ready.')
    } finally {
      setSaving(false)
    }
  }

  const finish = (finalResults) => {
    const evaluated = finalResults.filter((item) => item.evaluation)
    const total = finalResults.length
    const overall = Math.round(finalResults.reduce((sum, item) => sum + (item.evaluation?.overall ?? 0), 0) / total)
    const dims = {
      relevance: average(evaluated.map((item) => item.evaluation.relevance)),
      depth: average(evaluated.map((item) => item.evaluation.depth)),
      clarity: average(evaluated.map((item) => item.evaluation.clarity)),
    }
    const nextSummary = { overall, dims, answered: evaluated.length, total, results: finalResults }
    setSummary(nextSummary)
    setStage('summary')
    void persist(nextSummary)
  }

  const advance = (updatedResults) => {
    if (isLast) {
      finish(updatedResults)
      return
    }
    setIndex((value) => value + 1)
    setAnswer('')
    setError('')
    setFeedback(null)
  }

  const submitAnswer = () => {
    const words = answer.trim().split(/\s+/).filter(Boolean).length
    if (words < MIN_WORDS) {
      setError(`Write at least ${MIN_WORDS} words, or skip this question. You have ${words}.`)
      return
    }
    setError('')
    const evaluation = evaluateAnswer(question, answer)
    setResults((current) => [...current, { id: question.id, text: question.text, answer, evaluation }])
    setFeedback(evaluation)
  }

  const skipQuestion = () => {
    const updated = [...results, { id: question.id, text: question.text, answer: '', evaluation: null }]
    setResults(updated)
    advance(updated)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mock interview"
        description="Practise written answers with transparent, rule-based feedback."
        actions={
          stage === 'interview' && (
            <Button variant="secondary" onClick={() => setEndOpen(true)}>
              End interview
            </Button>
          )
        }
      />
      {stage === 'setup' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SetupPanel config={config} onChange={setConfig} onStart={() => begin()} />
          <div className="space-y-6">
            <HistoryPanel
              history={history}
              loading={historyLoading}
              error={historyError}
              onClear={async () => {
                try {
                  await clear()
                  toast.success('Interview history cleared.')
                } catch (error) {
                  toast.error(error.message || 'Could not clear interview history.')
                }
              }}
            />
          </div>
        </div>
      )}

      {stage === 'interview' && question && (
        <div className="mx-auto max-w-3xl space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="brand">{config.role}</Badge>
            <Badge>{config.category}</Badge>
            <Badge>{config.difficulty}</Badge>
          </div>
          {feedback ? (
            <FeedbackPanel question={question} evaluation={feedback} isLast={isLast} onNext={() => advance(results)} />
          ) : (
            <QuestionPanel
              question={question}
              index={index}
              total={questions.length}
              answer={answer}
              onAnswerChange={(value) => {
                setAnswer(value)
                if (error) setError('')
              }}
              error={error}
              onSubmit={submitAnswer}
              onSkip={skipQuestion}
            />
          )}
        </div>
      )}

      {stage === 'summary' && summary && (
        <SummaryPanel
          summary={summary}
          config={config}
          saving={saving}
          saved={saved}
          saveError={saveError}
          onRetrySave={() => void persist(summary)}
          onRetry={() => begin()}
          onNew={() => setStage('setup')}
        />
      )}

      <ConfirmDialog
        open={endOpen}
        onClose={() => setEndOpen(false)}
        onConfirm={() => setStage('setup')}
        title="End this interview?"
        description="Your answers so far will be discarded and this unfinished session will not be saved."
        confirmLabel="End interview"
      />
    </div>
  )
}
