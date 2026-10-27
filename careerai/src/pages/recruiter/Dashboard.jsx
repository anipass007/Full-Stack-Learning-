import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, CheckCircle2, PlusCircle, UserPlus, Users } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card, { CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import StatCard from '../../components/ui/StatCard'
import Skeleton from '../../components/ui/Skeleton'
import Badge from '../../components/ui/Badge'
import { useRecruiterJobs } from '../../hooks/useRecruiterJobs'
import { useApplicants } from '../../hooks/useApplicants'
import { useRecruiterProfile } from '../../hooks/useRecruiterProfile'
import HiringFunnel from './dashboard/HiringFunnel'
import ApplicantsByJob from './dashboard/ApplicantsByJob'
import RecentApplicants from './dashboard/RecentApplicants'

export default function RecruiterDashboard() {
  const { jobs, loading: jobsLoading, error: jobsError, refresh: refreshJobs } = useRecruiterJobs()
  const { applicants, loading: applicantsLoading, error: applicantsError, refresh: refreshApplicants } = useApplicants()
  const [profile] = useRecruiterProfile()

  const counts = {
    active: jobs.filter((job) => job.status === 'Active').length,
    pending: jobs.filter((job) => job.status === 'Pending review').length,
    closed: jobs.filter((job) => job.status === 'Closed').length,
  }
  const loading = jobsLoading || applicantsLoading
  const error = jobsError || applicantsError

  const { byJob, recent } = useMemo(() => {
    const rows = jobs
      .map((job) => ({ id: job.id, title: job.title, count: applicants.filter((item) => item.jobId === job.id).length }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
    const latest = applicants
      .map((item) => ({ ...item, jobTitle: jobs.find((job) => job.id === item.jobId)?.title ?? 'Removed job' }))
      .sort((a, b) => b.appliedOn.localeCompare(a.appliedOn))
      .slice(0, 5)
    return { byJob: rows, recent: latest }
  }, [jobs, applicants])

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Hiring overview for ${profile.companyName}`}
        description={`Welcome back, ${profile.recruiterName.trim().split(' ')[0] || 'there'}. These job and applicant figures are loaded from your account.`}
        badge={<Badge tone="info">Live database data</Badge>}
        actions={<>
          <Button variant="secondary" onClick={() => { void refreshJobs(); void refreshApplicants() }} loading={loading}>Refresh</Button>
          <Button to="/recruiter/jobs/new" icon={PlusCircle}>Post a job</Button>
        </>}
      />

      {error && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-danger/25 bg-danger/10 p-4"><p className="text-sm text-danger">{error}</p><Button variant="secondary" size="sm" onClick={() => { void refreshJobs(); void refreshApplicants() }}>Try again</Button></div>}

      <section aria-label="Summary" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total jobs" value={loading ? '—' : jobs.length} hint={`${counts.pending} waiting for review`} icon={Briefcase} tone="brand" />
        <StatCard label="Active jobs" value={loading ? '—' : counts.active} hint={`${counts.closed} closed`} icon={CheckCircle2} tone="success" />
        <StatCard label="Total applicants" value={loading ? '—' : applicants.length} hint="Across all jobs" icon={Users} tone="info" />
        <StatCard label="New applicants" value={loading ? '—' : applicants.filter((item) => item.status === 'New').length} hint="Waiting for your review" icon={UserPlus} tone="warning" />
      </section>

      {loading && <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" role="status" aria-label="Loading hiring data"><Skeleton className="h-56 rounded-2xl" /><Skeleton className="h-56 rounded-2xl" /></div>}
      {!loading && !error && <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentApplicants items={recent} />
        </div>
        <Card>
          <CardHeader title="Active and closed jobs" description="Your postings at a glance." />
          <dl className="space-y-3">
            {[
              ['Active', counts.active, 'text-success'],
              ['Pending review', counts.pending, 'text-warning'],
              ['Closed', counts.closed, 'text-ink-muted'],
            ].map(([label, value, tone]) => (
              <div key={label} className="flex items-center justify-between rounded-xl bg-bg/50 px-4 py-3">
                <dt className="text-sm text-ink-muted">{label}</dt>
                <dd className={`text-xl font-semibold ${tone}`}>{value}</dd>
              </div>
            ))}
          </dl>
          <Link to="/recruiter/jobs" className="mt-5 inline-block text-sm font-medium text-accent hover:text-ink">
            Manage jobs
          </Link>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <HiringFunnel applicants={applicants} />
        <ApplicantsByJob rows={byJob} />
      </div>
      </>}
    </div>
  )
}
