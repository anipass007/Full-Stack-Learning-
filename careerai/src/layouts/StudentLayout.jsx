import DashboardLayout from './DashboardLayout'
import { studentNav } from '../data/navigation'
import { useAuth } from '../context/AuthContext'

export default function StudentLayout() {
  const { user: authUser, profile: accountProfile } = useAuth()
  const user = {
    name: accountProfile?.full_name || authUser?.email?.split('@')[0] || 'Student',
    email: authUser?.email || accountProfile?.email || '',
    role: accountProfile?.role || 'student',
  }
  return (
    <DashboardLayout
      roleLabel="Student"
      groups={studentNav}
      user={user}
      profilePath="/student/profile"
      notifications={[]}
    />
  )
}
