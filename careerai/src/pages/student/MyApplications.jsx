import { useMemo, useState } from 'react'
import { CalendarCheck, CheckCircle2, ClipboardList, Clock, Search, SearchX } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import StatCard from '../../components/ui/StatCard'
import EmptyState from '../../components/ui/EmptyState'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { Input, Select } from '../../components/ui/Input'
import Skeleton from '../../components/ui/Skeleton'
import { useApplications } from '../../hooks/useApplications'
import { useFilter } from '../../hooks/useFilter'
import { useToast } from '../../hooks/useToast'
import ApplicationRow from './applications/ApplicationRow'

const statuses = ['Applied', 'In review', 'Interview', 'Offer', 'Rejected', 'Withdrawn']
const ACTIVE = ['Applied', 'In review', 'Interview']

export default function MyApplications() {
  const toast = useToast()
  const { applications, loading, error, withdraw, remove, refresh } = useApplications()
  const [expandedId, setExpandedId] = useState(null)
  const [withdrawing, setWithdrawing] = useState(null)
  const [removing, setRemoving] = useState(null)

  const items = useMemo(() => applications, [applications])

  const { query, setQuery, filters, setFilter, results, reset, isFiltered } = useFilter(items, {
    searchKeys: ['title', 'companyName'],
    initialFilters: { status: 'all' },
  })

  const stats = {
    total: items.length,
    active: items.filter((item) => ACTIVE.includes(item.status)).length,
    interviews: items.filter((item) => item.status === 'Interview').length,
    offers: items.filter((item) => item.status === 'Offer').length,
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My applications"
        description="Track every job you applied to and see how each application is moving."
        actions={<Button to="/student/jobs">Find jobs</Button>}
      />

      <section aria-label="Application summary" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total applications" value={stats.total} icon={ClipboardList} tone="brand" />
        <StatCard label="Active" value={stats.active} hint="Applied, in review or interview" icon={Clock} tone="info" />
        <StatCard label="Interviews" value={stats.interviews} icon={CalendarCheck} tone="warning" />
        <StatCard label="Offers" value={stats.offers} icon={CheckCircle2} tone="success" />
      </section>

      {loading ? <div className="space-y-4" role="status" aria-label="Loading applications"><Skeleton className="h-28 rounded-2xl" /><Skeleton className="h-48 rounded-2xl" /></div> : error ? (
        <EmptyState icon={ClipboardList} tone="danger" title="Applications could not be loaded" description={error} action={<Button onClick={refresh}>Try again</Button>} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No applications yet"
          description="When you apply to a job, it will appear here with its status and timeline."
          action={<Button to="/student/jobs">Browse jobs</Button>}
        />
      ) : (
        <>
          <Card>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr]">
              <Input
                label="Search"
                type="search"
                icon={Search}
                placeholder="Job title or company"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <Select label="Status" value={filters.status} onChange={(event) => setFilter('status', event.target.value)}>
                <option value="all">All statuses</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
            </div>
          </Card>

          <div className="flex items-center justify-between gap-3">
            <p aria-live="polite" className="text-sm text-ink-muted">
              {results.length} of {items.length} applications shown
            </p>
            {isFiltered && (
              <Button variant="ghost" size="sm" onClick={reset}>
                Clear filters
              </Button>
            )}
          </div>

          {results.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No applications match"
              description="Try a different search or status."
              action={<Button onClick={reset}>Clear filters</Button>}
            />
          ) : (
            <ul className="space-y-4">
              {results.map((application) => (
                <li key={application.id}>
                  <ApplicationRow
                    application={application}
                    expanded={expandedId === application.id}
                    onToggle={() => setExpandedId(expandedId === application.id ? null : application.id)}
                    onWithdraw={() => setWithdrawing(application)}
                    onRemove={() => setRemoving(application)}
                  />
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <ConfirmDialog
        open={Boolean(withdrawing)}
        onClose={() => setWithdrawing(null)}
        onConfirm={async () => {
          try { await withdraw(withdrawing.id); toast.success('Application withdrawn.') }
          catch (error) { toast.error(error.message || 'Unable to withdraw application.') }
        }}
        title="Withdraw this application?"
        description={withdrawing ? `Your application for ${withdrawing.title} at ${withdrawing.companyName} will be marked as withdrawn.` : ''}
        confirmLabel="Withdraw"
      />
      <ConfirmDialog
        open={Boolean(removing)}
        onClose={() => setRemoving(null)}
        onConfirm={async () => {
          try { await remove(removing.id); toast.success('Application removed from your list.') }
          catch (error) { toast.error(error.message || 'Unable to remove application.') }
        }}
        title="Remove from your list?"
        description={removing ? `The record for ${removing.title} will be permanently deleted.` : ''}
        confirmLabel="Remove"
      />
    </div>
  )
}
