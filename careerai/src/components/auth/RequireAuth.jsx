import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../ui/Button'
import Spinner from '../ui/Spinner'
import Card from '../ui/Card'
import { signOutUser } from '../../services/authApi'

const homeByRole = { student: '/student', recruiter: '/recruiter', admin: '/admin' }

export function roleHome(role) {
  return homeByRole[role] ?? '/login'
}

export default function RequireAuth({ allowedRoles, children }) {
  const { configured, user, profile, role, loading, profileError } = useAuth()
  const location = useLocation()

  if (!configured) return <AuthMessage title="Authentication is not configured" detail="Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to your local environment, then restart Vite." />
  if (loading) return <div className="flex min-h-[60vh] items-center justify-center gap-3 text-sm text-ink-muted"><Spinner className="h-5 w-5" />Checking your session…</div>
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  if (!profile || !role) return <ProfileUnavailable error={profileError} />
  if (!allowedRoles.includes(role)) return <Navigate to={roleHome(role)} replace />
  return children
}

function AuthMessage({ title, detail }) {
  return <div className="mx-auto max-w-xl px-4 py-16"><Card><h1 className="text-xl font-semibold text-ink">{title}</h1><p className="mt-2 text-sm text-ink-muted">{detail}</p></Card></div>
}

function ProfileUnavailable({ error }) {
  const retry = async () => { await signOutUser(); window.location.assign('/login') }
  return <div className="mx-auto max-w-xl px-4 py-16"><Card>
    <h1 className="text-xl font-semibold text-ink">We could not load your account profile</h1>
    <p role="alert" className="mt-2 text-sm text-ink-muted">{error || 'Your profile is missing or unavailable under the current database access rules.'}</p>
    <p className="mt-2 text-sm text-ink-muted">Portal access is paused until the profile can be read. This keeps role checks fail-closed.</p>
    <Button className="mt-5" onClick={retry}>Sign out</Button>
  </Card></div>
}
