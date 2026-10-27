import { useState } from 'react'
import { Search, SearchX, Users } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import { Input, Select } from '../../components/ui/Input'
import Skeleton from '../../components/ui/Skeleton'
import { userRoles } from '../../data/admin'
import { useAdminAccounts } from '../../hooks/useAdminAccounts'
import { useFilter } from '../../hooks/useFilter'
import { useToast } from '../../hooks/useToast'
import UserTable from './users/UserTable'
import UserModal from './users/UserModal'

export default function UserManagement() {
  const toast = useToast()
  const { users, loading, savingId, error, refresh, setRole } = useAdminAccounts()
  const [viewingId, setViewingId] = useState(null)

  const { query, setQuery, filters, setFilter, results, reset, isFiltered } = useFilter(users, {
    searchKeys: ['name', 'email', 'detail'],
    initialFilters: { role: 'all' },
  })

  const viewing = users.find((user) => user.id === viewingId) ?? null

  const handleRoleSave = async (user, role) => {
    try {
      await setRole(user, role)
      setViewingId(null)
      toast.success(`${user.name}'s role was updated.`)
    } catch (saveError) {
      toast.error(saveError.message || 'Unable to update this role.')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="User management"
        description="View registered account profiles and update student or recruiter roles through the admin-only database function."
      />

      {error ? <EmptyState icon={Users} tone="danger" title="Accounts could not be loaded" description={error} action={<Button onClick={refresh}>Try again</Button>} /> : loading ? (
        <div className="space-y-4" role="status" aria-label="Loading accounts"><Skeleton className="h-16 rounded-xl" /><Skeleton className="h-64 rounded-2xl" /></div>
      ) : users.length === 0 ? (
        <EmptyState icon={Users} title="No accounts found" description="Profiles created through Supabase Auth will appear here." />
      ) : (
        <>
          <Card>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr]">
              <Input
                label="Search"
                type="search"
                icon={Search}
                placeholder="Name, email or company"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <Select label="Role" value={filters.role} onChange={(event) => setFilter('role', event.target.value)}>
                <option value="all">All roles</option>
                {userRoles.map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </Select>
            </div>
          </Card>

          <div className="flex items-center justify-between gap-3">
            <p aria-live="polite" className="text-sm text-ink-muted">
              {results.length} of {users.length} users shown
            </p>
            {isFiltered && (
              <Button variant="ghost" size="sm" onClick={reset}>
                Clear filters
              </Button>
            )}
          </div>

          {results.length === 0 ? (
            <EmptyState icon={SearchX} title="No users match" description="Try a different search, role or status." action={<Button onClick={reset}>Clear filters</Button>} />
          ) : (
            <UserTable users={results} onView={(user) => setViewingId(user.id)} />
          )}
        </>
      )}

      <UserModal user={viewing} onClose={() => setViewingId(null)} onSaveRole={handleRoleSave} saving={savingId === viewing?.id} />
    </div>
  )
}
