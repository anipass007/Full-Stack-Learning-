import DashboardLayout from './DashboardLayout'
import { adminNav } from '../data/navigation'
import { useAuth } from '../context/AuthContext'

export default function AdminLayout() {
  const { user, profile } = useAuth()
  const account = { name: profile?.full_name || user?.email?.split('@')[0] || 'Admin', email: user?.email || profile?.email || '', role: profile?.role || 'admin' }
  return (
    <DashboardLayout
      roleLabel="Admin"
      groups={adminNav}
      user={account}
      profilePath="/admin/analytics"
      notifications={[]}
    />
  )
}
