import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SearchX, Users } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Tabs from '../../components/ui/Tabs'
import EmptyState from '../../components/ui/EmptyState'
import { Input, Select } from '../../components/ui/Input'
import { applicantStatuses } from '../../data/recruiter'
import { useApplicants } from '../../hooks/useApplicants'
import { useRecruiterJobs } from '../../hooks/useRecruiterJobs'
import { useFilter } from '../../hooks/useFilter'
import { useToast } from '../../hooks/useToast'
import ApplicantCard from './applicants/ApplicantCard'
import ApplicantModal from './applicants/ApplicantModal'

export default function Applicants() {
  const toast = useToast()
  const [searchParams] = useSearchParams()
  const { jobs } = useRecruiterJobs()
  const { applicants, loading, error, savingId, setStatus, refresh } = useApplicants()
  const [viewingId, setViewingId] = useState(null)

  const items = useMemo(
    () =>
      applicants
        .map((item) => ({ ...item, jobTitle: jobs.find((job) => job.id === item.jobId)?.title ?? 'Removed job' }))
        .sort((a, b) => b.appliedOn.localeCompare(a.appliedOn)),
    [applicants, jobs],
  )

  const jobParam = searchParams.get('job')
  const { query, setQuery, filters, setFilter, results, reset, isFiltered } = useFilter(items, {
    searchKeys: ['name', 'jobTitle', 'skills', 'education'],
    initialFilters: { jobId: 'all', status: 'all' },
  })

  // Arriving from Manage jobs (?job=ID) pre-selects that job, and "Clear filters" can still remove it.
  useEffect(() => {
    if (jobParam && jobs.some((job) => job.id === jobParam)) setFilter('jobId', jobParam)
  }, [jobParam, jobs])

  const viewing = items.find((item) => item.id === viewingId) ?? null

  const changeStatus = async (applicant, status) => {
    if (status === applicant.status) return
    try {
      await setStatus(applicant.id, status)
      toast.success(`${applicant.name} is now ${status.toLowerCase()}.`)
    } catch (updateError) {
      toast.error(updateError.message || 'Unable to update this application.')
    }
  }

  const tabs = [
    { id: 'all', label: 'All', count: items.length },
    ...applicantStatuses.map((status) => ({ id: status, label: status, count: items.filter((item) => item.status === status).length })),
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Applicants"
        description="Review candidates who applied to your jobs and move applications through your hiring steps."
      />

      {loading ? <div className="rounded-2xl border border-line p-6 text-sm text-ink-muted" role="status">Loading applicants…</div> : error ? (
        <EmptyState icon={Users} tone="danger" title="Applicants could not be loaded" description={error} action={<Button onClick={refresh}>Try again</Button>} />
      ) : items.length === 0 ? (
        <EmptyState icon={Users} title="No applicants yet" description="Candidates who apply to your jobs will show up here." action={<Button to="/recruiter/jobs">Manage jobs</Button>} />
      ) : (
        <>
          <Card>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr]">
              <Input
                label="Search"
                type="search"
                icon={Search}
                placeholder="Name, skill, education or job"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <Select label="Job" value={filters.jobId} onChange={(event) => setFilter('jobId', event.target.value)}>
                <option value="all">All jobs</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </Select>
            </div>
          </Card>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Tabs tabs={tabs} value={filters.status} onChange={(value) => setFilter('status', value)} label="Filter candidates by status" />
            {isFiltered && (
              <Button variant="ghost" size="sm" onClick={reset}>
                Clear filters
              </Button>
            )}
          </div>
          <p aria-live="polite" className="text-sm text-ink-muted">
            {results.length} of {items.length} candidates shown
          </p>

          {results.length === 0 ? (
            <EmptyState icon={SearchX} title="No candidates match" description="Try a different search, job or status." action={<Button onClick={reset}>Clear filters</Button>} />
          ) : (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {results.map((applicant) => (
                <ApplicantCard key={applicant.id} applicant={applicant} onView={(item) => setViewingId(item.id)} onStatusChange={changeStatus} saving={savingId === applicant.id} />
              ))}
            </div>
          )}
        </>
      )}

      <ApplicantModal applicant={viewing} onClose={() => setViewingId(null)} onStatusChange={changeStatus} />
    </div>
  )
}
