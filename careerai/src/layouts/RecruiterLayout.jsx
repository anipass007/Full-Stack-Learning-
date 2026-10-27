import DashboardLayout from './DashboardLayout'
import { recruiterNav } from '../data/navigation'
import { useAuth } from '../context/AuthContext'

export default function RecruiterLayout() {
  const { user: authUser, profile: accountProfile } = useAuth()
  const user = {
    name: accountProfile?.full_name || authUser?.email?.split('@')[0] || 'Recruiter',
    email: authUser?.email || accountProfile?.email || '',
    role: accountProfile?.role || 'recruiter',
  }
  return (
    <DashboardLayout
      roleLabel="Recruiter"
      groups={recruiterNav}
      user={user}
      profilePath="/recruiter/profile"
      notifications={[]}
    />
  )
}
