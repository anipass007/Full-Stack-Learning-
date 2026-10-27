import { useState } from 'react'
import { AlertCircle, FileText, History, RefreshCw, Save } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card, { CardHeader } from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'
import { Input, Textarea } from '../../components/ui/Input'
import { useToast } from '../../hooks/useToast'
import { useResumeAnalyses } from '../../hooks/useResumeAnalyses'
import { analyzeResumeText, atsLimits } from '../../lib/atsAnalysis'
import ScoreOverview from './analysis/ScoreOverview'
import SectionFeedback from './analysis/SectionFeedback'
import KeywordsCard from './analysis/KeywordsCard'
import IssuesCard from './analysis/IssuesCard'
import StrengthsWeaknesses from './analysis/StrengthsWeaknesses'
import Suggestions from './analysis/Suggestions'
import AnalysisSkeleton from './analysis/AnalysisSkeleton'

function formatSavedDate(value) {
  if (!value) return 'Date unavailable'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleString()
}

export default function ResumeAnalysis() {
  const toast = useToast()
  const { analyses, loading: historyLoading, error: historyError, refresh, save } = useResumeAnalyses()
  const [resumeText, setResumeText] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [selectedSavedId, setSelectedSavedId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [saveError, setSaveError] = useState('')

  const selectedSaved = analyses.find((item) => item.id === selectedSavedId) ?? null
  const displayedAnalysis = selectedSaved?.result ?? analysis
  const displayedScore = selectedSaved?.score ?? displayedAnalysis?.overall
  const runAnalysis = async () => {
    setFormError('')
    setSaveError('')
    setSelectedSavedId(null)
    let result
    try {
      result = analyzeResumeText({ resumeText, targetRole, jobDescription })
    } catch (error) {
      setFormError(error.message || 'Check your text and try again.')
      return
    }
    setAnalysis(result)
    setSubmitting(true)
    try {
      await save(result)
      toast.success('Your rule-based analysis was saved to your private history.')
    } catch (error) {
      setSaveError(error.message || 'The analysis is ready, but could not be saved.')
    } finally {
      setSubmitting(false)
    }
  }

  const retrySave = async () => {
    if (!analysis) return
    setSubmitting(true)
    setSaveError('')
    try {
      await save(analysis)
      toast.success('Analysis saved to your private history.')
    } catch (error) {
      setSaveError(error.message || 'Unable to save this analysis.')
    } finally {
      setSubmitting(false)
    }
  }

  const selectHistory = (saved) => {
    setSelectedSavedId(saved.id)
    setSaveError('')
  }

  const historyItems = analyses

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resume analysis"
        description="Paste resume text for a transparent, rule-based ATS estimate and practical feedback."
        badge={<Badge tone="info">Rule-based estimate</Badge>}
      />

      <Card>
        <CardHeader title="Analyse resume text" description="Your pasted resume and job description are used in this browser session and are not stored. Only the derived score and feedback are saved." />
        <div className="space-y-4">
          <Textarea
            label="Resume text"
            hint={`${resumeText.length.toLocaleString()} / ${atsLimits.resume.toLocaleString()} characters`}
            required
            rows={10}
            maxLength={atsLimits.resume}
            placeholder="Paste the text from your resume here…"
            value={resumeText}
            onChange={(event) => setResumeText(event.target.value)}
          />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Input
              label="Target job role"
              hint="Enter a role, such as Frontend Developer. You can provide this or a job description below."
              maxLength={120}
              placeholder="e.g. Frontend Developer"
              value={targetRole}
              onChange={(event) => setTargetRole(event.target.value)}
            />
            <Textarea
              label="Job description (optional)"
              hint={`${jobDescription.length.toLocaleString()} / ${atsLimits.jobDescription.toLocaleString()} characters`}
              rows={4}
              maxLength={atsLimits.jobDescription}
              placeholder="Paste the job description to compare its keywords with your resume."
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
            />
          </div>
          {formError && <p role="alert" className="flex items-start gap-2 text-sm text-danger"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{formError}</p>}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
            <p className="max-w-2xl text-xs text-ink-faint">This is a heuristic estimate, not a guarantee of passing an employer's ATS. No paid AI or analysis API is used.</p>
            <Button icon={RefreshCw} onClick={runAnalysis} loading={submitting} disabled={submitting || historyLoading}>
              {submitting ? 'Saving analysis...' : 'Run analysis'}
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Saved analysis history" description="Your latest 20 saved analyses. Only your account can read these records." action={<History className="h-5 w-5 text-ink-faint" aria-hidden="true" />} />
        {historyLoading ? (
          <div className="space-y-3" role="status" aria-label="Loading saved analyses"><Skeleton className="h-16 rounded-xl" /><Skeleton className="h-16 rounded-xl" /></div>
        ) : historyError ? (
          <div className="flex flex-wrap items-center justify-between gap-3" role="alert">
            <p className="text-sm text-danger">{historyError}</p>
            <Button variant="secondary" size="sm" onClick={refresh}>Try again</Button>
          </div>
        ) : historyItems.length === 0 ? (
          <EmptyState icon={FileText} title="No saved analyses yet" description="Run an analysis to save its score and feedback here." />
        ) : (
          <ul className="space-y-2">
            {historyItems.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => selectHistory(item)}
                  aria-pressed={selectedSavedId === item.id}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${selectedSavedId === item.id ? 'border-brand bg-brand/10' : 'border-line bg-bg/40 hover:bg-bg/70'}`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-ink">{item.result?.targetRole || item.label}</span>
                    <span className="mt-1 block text-xs text-ink-faint">{formatSavedDate(item.createdAt)}</span>
                  </span>
                  <Badge tone={item.score >= 70 ? 'success' : 'warning'}>{item.score}/100 estimate</Badge>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {submitting && <AnalysisSkeleton />}
      {!submitting && displayedAnalysis && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-ink">{selectedSaved ? 'Saved analysis' : 'Latest analysis'}</h2>
            <Badge tone="warning">Estimate only · {displayedScore}/100</Badge>
          </div>
          {saveError && !selectedSaved && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-warning/30 bg-warning/10 p-4" role="alert">
              <p className="text-sm text-ink-muted">Analysis completed, but saving failed: {saveError}</p>
              <Button variant="secondary" icon={Save} onClick={retrySave} loading={submitting}>Retry save</Button>
            </div>
          )}
          <ScoreOverview analysis={displayedAnalysis} />
          <SectionFeedback sections={displayedAnalysis.sections ?? []} />
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <KeywordsCard matchedKeywords={displayedAnalysis.matchedKeywords ?? []} keywords={displayedAnalysis.missingKeywords ?? []} />
            <IssuesCard issues={displayedAnalysis.issues ?? []} />
          </div>
          <StrengthsWeaknesses strengths={displayedAnalysis.strengths ?? []} weaknesses={displayedAnalysis.weaknesses ?? []} />
          <Suggestions suggestions={displayedAnalysis.suggestions ?? []} />
        </div>
      )}
    </div>
  )
}
