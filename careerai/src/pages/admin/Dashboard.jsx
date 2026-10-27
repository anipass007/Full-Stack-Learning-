import { useCallback, useEffect, useState } from 'react'
import { Briefcase, ClipboardList, GraduationCap, RefreshCw, UserCog } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'
import { getAdminDashboardData } from '../../services/adminApi'
import RecentRegistrations from './dashboard/RecentRegistrations'
import PendingJobsCard from './dashboard/PendingJobsCard'

const fmt = (value) => Number(value ?? 0).toLocaleString('en-IN')

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setData(await getAdminDashboardData())
    } catch (loadError) {
      setError(loadError.message || 'Unable to load platform metrics.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin dashboard"
        description="Live account, job and application totals from the CareerAI database."
        actions={<Button variant="secondary" icon={RefreshCw} onClick={load} loading={loading}>Refresh</Button>}
      />
      {error && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-danger/25 bg-danger/10 p-4"><p className="text-sm text-danger">{error}</p><Button variant="secondary" size="sm" onClick={load}>Try again</Button></div>}

      <section aria-label="Summary" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total students" value={data ? fmt(data.counts.students) : '—'} icon={GraduationCap} tone="info" />
        <StatCard label="Total recruiters" value={data ? fmt(data.counts.recruiters) : '—'} icon={UserCog} tone="brand" />
        <StatCard label="Total jobs" value={data ? fmt(data.counts.jobs) : '—'} icon={Briefcase} tone="success" />
        <StatCard label="Applications" value={data ? fmt(data.counts.applications) : '—'} icon={ClipboardList} tone="warning" />
      </section>

      {loading && !data ? <div className="grid gap-6 lg:grid-cols-2" role="status" aria-label="Loading admin dashboard"><Skeleton className="h-64 rounded-2xl" /><Skeleton className="h-64 rounded-2xl" /></div> : (
        <div className="grid gap-6 lg:grid-cols-2">
          <PendingJobsCard jobs={data?.pendingJobs ?? []} />
          <RecentRegistrations users={data?.recent ?? []} />
        </div>
      )}
    </div>
  )
}
