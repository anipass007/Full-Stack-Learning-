import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Bookmark, BookmarkCheck, Building2, Check, SearchX } from 'lucide-react'
import Card, { CardHeader } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import EmptyState from '../../components/ui/EmptyState'
import JobCard, { MatchBadge } from '../../components/jobs/JobCard'
import Skeleton from '../../components/ui/Skeleton'
import { useSavedJobs } from '../../hooks/useSavedJobs'
import { useApplications } from '../../hooks/useApplications'
import { useToast } from '../../hooks/useToast'
import { useAuth } from '../../context/AuthContext'
import { listApprovedJobs } from '../../services/jobsApi'

function BulletList({ items }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm text-ink-muted">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  )
}

export default function JobDetails() {
  const { jobId } = useParams()
  const toast = useToast()
  const { profile } = useAuth()
  const [approvedJobs, setApprovedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  useEffect(() => {
    let active = true
    listApprovedJobs().then((rows) => { if (active) setApprovedJobs(rows) })
      .catch((error) => { if (active) setLoadError(error.message || 'Unable to load approved jobs.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])
  const jobs = approvedJobs.map((item) => {
    const skillNames = Object.entries(profile?.skills ?? {}).filter(([, level]) => Number(level) > 0).map(([name]) => name.toLowerCase())
    const match = item.skills.length ? Math.round(item.skills.filter((skill) => skillNames.includes(skill.toLowerCase())).length / item.skills.length * 100) : 0
    return { ...item, match, isLive: true }
  })
  const job = jobs.find((item) => item.id === jobId)

  const { isSaved, toggleSaved } = useSavedJobs()
  const { hasApplied, applyToJob, loading: applicationsLoading } = useApplications()
  const mySkills = profile?.skills ?? {}
  const [applyOpen, setApplyOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [applicationError, setApplicationError] = useState('')

  const related = useMemo(() => {
    if (!job) return []
    return jobs
      .filter((other) => other.id !== job.id)
      .map((other) => ({ job: other, shared: other.skills.filter((skill) => job.skills.includes(skill)).length }))
      .filter((item) => item.shared > 0)
      .sort((a, b) => b.shared - a.shared || b.job.match - a.job.match)
      .slice(0, 3)
      .map((item) => item.job)
  }, [job])

  if (loading) return <div className="space-y-4" role="status" aria-label="Loading job"><Skeleton className="h-28 rounded-2xl" /><Skeleton className="h-96 rounded-2xl" /></div>
  if (loadError) return <EmptyState icon={SearchX} tone="danger" title="Job could not be loaded" description={loadError} action={<Button to="/student/jobs">Back to jobs</Button>} />
  if (!job) {
    return (
      <EmptyState
        icon={SearchX}
        tone="danger"
        title="Job not found"
        description="This listing may have closed, been removed, or not been approved."
        action={<Button to="/student/jobs">Back to jobs</Button>}
      />
    )
  }

  const applied = hasApplied(job.id)
  const saved = isSaved(job.id)

  const submitApplication = async () => {
    setSubmitting(true)
    setApplicationError('')
    try {
      await applyToJob(job.id)
      setApplyOpen(false)
      toast.success(`Your application to ${job.company} was submitted.`, { title: 'Application sent' })
    } catch (error) {
      setApplicationError(error.message || 'Unable to submit your application.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSave = () => {
    toggleSaved(job.id)
    toast.info(saved ? 'Removed from saved jobs.' : 'Job saved.')
  }

  return (
    <div className="space-y-6">
      <Link to="/student/jobs" className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to jobs
      </Link>

      <Card>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-ink">{job.title}</h1>
              <Badge tone="success">Approved listing</Badge>
            </div>
            <p className="mt-1.5 text-ink-muted">{job.company}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge>{job.location}</Badge>
              <Badge>{job.type}</Badge>
              <Badge>{job.experience}</Badge>
              <Badge>{job.salary}</Badge>
              <MatchBadge match={job.match} />
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button variant="secondary" icon={saved ? BookmarkCheck : Bookmark} onClick={handleSave} aria-pressed={saved}>
              {saved ? 'Saved' : 'Save job'}
            </Button>
            {applied ? (
              <Button to="/student/applications" variant="secondary" icon={Check}>
                Applied. View status
              </Button>
            ) : (
              <Button onClick={() => { setApplicationError(''); setApplyOpen(true) }} disabled={applicationsLoading}>Apply now</Button>
            )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader title="About the role" />
            <p className="text-sm leading-relaxed text-ink-muted">{job.description}</p>
          </Card>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader title="Responsibilities" />
              <BulletList items={job.responsibilities} />
            </Card>
            <Card>
              <CardHeader title="Requirements" />
              <BulletList items={job.requirements} />
            </Card>
          </div>
          <Card>
            <CardHeader title="Required skills" description="Green means your skill level is working or better. Amber means it is worth practising." />
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => {
                const level = mySkills[skill]
                const strong = (level ?? 0) >= 50
                return (
                  <Badge key={skill} tone={strong ? 'success' : 'warning'} className="px-3 py-1 text-sm">
                    {skill}
                    {level != null ? ` · ${level}%` : ' · not listed'}
                  </Badge>
                )
              })}
            </div>
            <Link to="/student/skill-gap" className="mt-4 inline-block text-sm font-medium text-accent hover:text-ink">
              See your full skill gap
            </Link>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Company" />
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <Building2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{job.company}</p>
                <p className="text-xs text-ink-faint">
                  {[job.companyInfo.industry, job.companyInfo.size].filter(Boolean).join(' · ') || 'Company details not provided'}
                </p>
              </div>
            </div>
            {job.companyInfo.about && <p className="mt-4 text-sm text-ink-muted">{job.companyInfo.about}</p>}
          </Card>
          <Card>
            <CardHeader title="Job summary" />
            <dl className="space-y-3 text-sm">
              {[
                ['Salary', job.salary],
                ...(job.openings ? [['Openings', job.openings]] : []),
                ['Posted', job.posted],
                ['Work mode', job.mode],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt className="text-ink-muted">{label}</dt>
                  <dd className="text-right font-medium text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-jobs">
          <h2 id="related-jobs" className="mb-4 text-lg font-semibold text-ink">
            Related jobs
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {related.map((item) => (
              <JobCard
                key={item.id}
                job={item}
                saved={isSaved(item.id)}
                applied={hasApplied(item.id)}
                onToggleSave={(id) => {
                  toggleSaved(id)
                  toast.info(isSaved(id) ? 'Removed from saved jobs.' : 'Job saved.')
                }}
              />
            ))}
          </div>
        </section>
      )}

      <Modal
        open={applyOpen}
        onClose={() => !submitting && setApplyOpen(false)}
        title={`Apply to ${job.company}`}
        description={job.title}
        footer={
          <>
            <Button variant="secondary" onClick={() => setApplyOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={submitApplication} loading={submitting} disabled={submitting || applicationsLoading}>
              {submitting ? 'Submitting' : 'Submit application'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="rounded-xl bg-bg/60 p-4 text-sm text-ink-muted">
            Your application and profile details will be shared with this recruiter. Resume attachments are not available yet.
          </p>
          {applicationError && <p role="alert" className="text-sm text-danger">{applicationError}</p>}
        </div>
      </Modal>
    </div>
  )
}
