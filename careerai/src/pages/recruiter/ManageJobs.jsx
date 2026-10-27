import { useState } from 'react'
import { Briefcase, PlusCircle, Search, SearchX } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Tabs from '../../components/ui/Tabs'
import Modal from '../../components/ui/Modal'
import EmptyState from '../../components/ui/EmptyState'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Skeleton from '../../components/ui/Skeleton'
import { Input } from '../../components/ui/Input'
import JobForm from '../../components/recruiter/JobForm'
import { jobToDraft } from '../../lib/jobForm'
import { useRecruiterJobs } from '../../hooks/useRecruiterJobs'
import { useFilter } from '../../hooks/useFilter'
import { useToast } from '../../hooks/useToast'
import JobRow from './jobs/JobRow'

export default function ManageJobs() {
  const toast = useToast()
  const { jobs, loading, error, saving, updateJob, setStatus, removeJob } = useRecruiterJobs()
  const [editing, setEditing] = useState(null)
  const [closing, setClosing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [operationError, setOperationError] = useState('')

  const { query, setQuery, filters, setFilter, results, reset, isFiltered } = useFilter(jobs, {
    searchKeys: ['title', 'location', 'skills'], initialFilters: { status: 'all' },
  })
  const tabs = [
    { id: 'all', label: 'All jobs', count: jobs.length },
    { id: 'Active', label: 'Active', count: jobs.filter((job) => job.status === 'Active').length },
    { id: 'Pending review', label: 'Pending review', count: jobs.filter((job) => job.status === 'Pending review').length },
    { id: 'Rejected', label: 'Rejected', count: jobs.filter((job) => job.status === 'Rejected').length },
    { id: 'Closed', label: 'Closed', count: jobs.filter((job) => job.status === 'Closed').length },
  ]

  const handleStatus = async (job, status) => {
    try {
      await setStatus(job.id, status)
      toast.success(status === 'Closed' ? `${job.title} was closed.` : `${job.title} was reopened.`)
    } catch (statusError) {
      toast.error(statusError.message || 'Unable to change this job status.')
    }
  }
  const handleDelete = async () => {
    if (!deleting) return
    try {
      await removeJob(deleting.id)
      toast.success(`${deleting.title} and its applications were deleted.`)
    } catch (deleteError) {
      toast.error(deleteError.message || 'Unable to delete this job.')
    }
    setDeleting(null)
  }
  const handleUpdate = async (data) => {
    if (!editing) return
    setOperationError('')
    try {
      await updateJob(editing.id, data)
      if (editing.status === 'Rejected') await setStatus(editing.id, 'Pending review')
      toast.success('Job updated and submitted for review.')
      setEditing(null)
    } catch (updateError) {
      setOperationError(updateError.message || 'Unable to update this job.')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Manage jobs" description="Edit, close, reopen or delete the jobs you have posted." actions={<Button to="/recruiter/jobs/new" icon={PlusCircle}>Post a job</Button>} />
      {(error || operationError) && <p role="alert" className="rounded-xl border border-danger/25 bg-danger/10 px-4 py-3 text-sm text-danger">{operationError || error}</p>}

      {loading ? <div className="space-y-4" role="status" aria-label="Loading your jobs">{[1, 2, 3].map((item) => <Skeleton key={item} className="h-40 w-full rounded-2xl" />)}</div> : jobs.length === 0 ? (
        <EmptyState icon={Briefcase} title="No jobs posted yet" description="Post your first job and it will appear here." action={<Button to="/recruiter/jobs/new">Post a job</Button>} />
      ) : (
        <>
          <Card><Input label="Search" type="search" icon={Search} placeholder="Job title, location or skill" value={query} onChange={(event) => setQuery(event.target.value)} /></Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Tabs tabs={tabs} value={filters.status} onChange={(value) => setFilter('status', value)} label="Filter jobs by status" />
            {isFiltered && <Button variant="ghost" size="sm" onClick={reset}>Clear filters</Button>}
          </div>
          <p aria-live="polite" className="text-sm text-ink-muted">{results.length} of {jobs.length} jobs shown</p>
          {results.length === 0 ? <EmptyState icon={SearchX} title="No jobs match" description="Try another search or status." action={<Button onClick={reset}>Clear filters</Button>} /> : (
            <ul className="space-y-4">{results.map((job) => <li key={job.id}><JobRow
              job={job}
              applicantCount={job.applicantCount}
              onEdit={setEditing}
              onClose={setClosing}
              onReopen={(item) => handleStatus(item, item.status === 'Rejected' ? 'Pending review' : 'Active')}
              onDelete={setDeleting}
            /></li>)}</ul>
          )}
        </>
      )}

      <Modal open={Boolean(editing)} onClose={() => !saving && setEditing(null)} title="Edit job" description={editing?.title} size="lg">
        {editing && <JobForm key={editing.id} initial={jobToDraft(editing)} submitLabel="Save changes" loading={saving} error={operationError} onCancel={() => setEditing(null)} onSubmit={handleUpdate} />}
      </Modal>
      <ConfirmDialog open={Boolean(closing)} onClose={() => setClosing(null)} onConfirm={() => handleStatus(closing, 'Closed')} title="Close this job?" description={closing ? `Candidates will no longer be able to apply to ${closing.title}. You can reopen it later.` : ''} confirmLabel="Close job" />
      <ConfirmDialog open={Boolean(deleting)} onClose={() => setDeleting(null)} onConfirm={handleDelete} title="Delete this job?" description={deleting ? `${deleting.title} and its applications will be removed. This cannot be undone.` : ''} confirmLabel="Delete job" />
    </div>
  )
}
