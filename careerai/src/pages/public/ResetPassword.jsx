import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../../components/layout/AuthShell'
import Button from '../../components/ui/Button'
import PasswordInput from '../../components/ui/PasswordInput'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../hooks/useToast'
import { updatePassword } from '../../services/authApi'
import { roleHome } from '../../components/auth/RequireAuth'

export default function ResetPassword() {
  const navigate = useNavigate()
  const toast = useToast()
  const { configured, user, profile, loading } = useAuth()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (event) => {
    event.preventDefault()
    if (password.length < 8 || !/[a-z]/i.test(password) || !/\d/.test(password)) {
      setError('Use at least 8 characters with a letter and a number.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const { error: updateError } = await updatePassword(password)
      if (updateError) throw updateError
      toast.success('Your password has been updated.')
      navigate(roleHome(profile?.role), { replace: true })
    } catch (updateError) {
      setError(updateError.message || 'Unable to update your password. Request a new reset link and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return <AuthShell
    title="Set a new password"
    subtitle="Choose a new password for your CareerAI account."
    footer={<Link to="/login" className="font-medium text-accent hover:text-ink">Back to login</Link>}
  >
    {loading ? <p role="status" className="text-sm text-ink-muted">Checking your reset link…</p> : !configured ? (
      <p role="alert" className="text-sm text-danger">Supabase is not configured.</p>
    ) : !user ? (
      <div className="space-y-3"><p role="alert" className="text-sm text-ink-muted">This reset link is invalid or expired. Request a new one from the login page.</p><Button to="/login">Go to login</Button></div>
    ) : (
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        {error && <p role="alert" className="rounded-xl border border-danger/25 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>}
        <PasswordInput label="New password" autoComplete="new-password" placeholder="At least 8 characters" value={password} onChange={(event) => setPassword(event.target.value)} required />
        <PasswordInput label="Confirm new password" autoComplete="new-password" placeholder="Re-enter your password" value={confirm} onChange={(event) => setConfirm(event.target.value)} required />
        <Button type="submit" size="lg" className="w-full" loading={submitting}>{submitting ? 'Updating password' : 'Update password'}</Button>
      </form>
    )}
  </AuthShell>
}
