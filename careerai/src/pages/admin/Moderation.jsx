import { useState } from 'react'
import { CheckCircle2, Flag, RefreshCw, XCircle } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'
import Tabs from '../../components/ui/Tabs'
import EmptyState from '../../components/ui/EmptyState'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'
import { useToast } from '../../hooks/useToast'
import { useAdminModeration } from '../../hooks/useAdminModeration'
import PendingJobCard from './moderation/PendingJobCard'
import JobReviewModal from './moderation/JobReviewModal'
import RejectModal from './moderation/RejectModal'
import ReviewedList from './moderation/ReviewedList'

export default function Moderation() {
  const toast = useToast()
  const { jobs, loading, saving, error, refresh, decide } = useAdminModeration()
  const [tab, setTab] = useState('pending')
  const [reviewingId, setReviewingId] = useState(null)
  const [rejecting, setRejecting] = useState(null)

  const pending = jobs.filter((job) => job.status === 'Pending')
  const reviewed = jobs.filter((job) => job.status !== 'Pending')
  const reviewing = jobs.find((job) => job.id === reviewingId) ?? null

  const approve = async (job) => {
    try {
      await decide(job.id, 'Approved')
      setReviewingId(null)
      toast.success(`${job.title} was approved.`)
    } catch (saveError) {
      toast.error(saveError.message || 'Unable to approve this job.')
    }
  }

  const reject = async (job, reason) => {
    try {
      await decide(job.id, 'Rejected', reason)
      setRejecting(null)
      setReviewingId(null)
      toast.success(`${job.title} was rejected.`)
    } catch (saveError) {
      toast.error(saveError.message || 'Unable to reject this job.')
    }
  }

  const undo = async (job) => {
    try {
      await decide(job.id, 'Pending')
      toast.info(`${job.title} is back in the review queue.`)
    } catch (saveError) {
      toast.error(saveError.message || 'Unable to reopen this job for review.')
    }
  }

  const tabs = [
    { id: 'pending', label: 'Pending jobs', count: pending.length },
    { id: 'reviewed', label: 'Reviewed', count: reviewed.length },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Job moderation"
        description="Review and update real job listings. Decisions are enforced by the admin-only database function."
        actions={<Button variant="secondary" icon={RefreshCw} onClick={refresh} loading={loading}>Refresh</Button>}
      />

      {error && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-danger/25 bg-danger/10 p-4"><p className="text-sm text-danger">{error}</p><Button variant="secondary" size="sm" onClick={refresh}>Try again</Button></div>}

      <section aria-label="Moderation summary" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Pending jobs" value={pending.length} icon={Flag} tone="warning" />
        <StatCard label="Approved" value={jobs.filter((job) => job.status === 'Approved').length} icon={CheckCircle2} tone="success" />
        <StatCard label="Rejected" value={jobs.filter((job) => job.status === 'Rejected').length} icon={XCircle} tone="brand" />
      </section>

      <Tabs tabs={tabs} value={tab} onChange={setTab} label="Moderation sections" />

      {loading ? <div className="space-y-4" role="status" aria-label="Loading moderation queue"><Skeleton className="h-36 rounded-2xl" /><Skeleton className="h-36 rounded-2xl" /></div> : tab === 'pending' ? (
        pending.length === 0 ? <EmptyState icon={CheckCircle2} title="Queue is empty" description="There are no pending database listings to review." /> :
          <ul className="space-y-4">{pending.map((job) => <li key={job.id}><PendingJobCard job={job} onReview={(item) => setReviewingId(item.id)} onApprove={approve} onReject={setRejecting} /></li>)}</ul>
      ) : <ReviewedList jobs={reviewed} onReview={(item) => setReviewingId(item.id)} onUndo={undo} />}

      <JobReviewModal job={reviewing} onClose={() => setReviewingId(null)} onApprove={approve} onReject={(job) => { setReviewingId(null); setRejecting(job) }} />
      <RejectModal job={rejecting} onClose={() => setRejecting(null)} onConfirm={reject} />
      {saving && <p role="status" className="sr-only">Saving moderation decision…</p>}
    </div>
  )
}
