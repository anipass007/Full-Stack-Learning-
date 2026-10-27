import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Mail } from 'lucide-react'
import AuthShell from '../../components/layout/AuthShell'
import Button from '../../components/ui/Button'
import { Checkbox, Input } from '../../components/ui/Input'
import PasswordInput from '../../components/ui/PasswordInput'
import Modal from '../../components/ui/Modal'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useToast } from '../../hooks/useToast'
import { isEmail } from '../../lib/validators'
import { useAuth } from '../../context/AuthContext'
import { roleHome } from '../../components/auth/RequireAuth'
import { sendPasswordReset } from '../../services/authApi'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const { configured, user, profile, loading, signIn } = useAuth()
  const [rememberedEmail, setRememberedEmail] = useLocalStorage('rememberedEmail', '')
  const [form, setForm] = useState({ email: rememberedEmail, password: '', remember: Boolean(rememberedEmail) })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [forgotOpen, setForgotOpen] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotError, setForgotError] = useState('')
  const [forgotSent, setForgotSent] = useState(false)
  const [sendingReset, setSendingReset] = useState(false)

  useEffect(() => {
    if (user && profile?.role) navigate(roleHome(profile.role), { replace: true })
  }, [user, profile, navigate])

  const update = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setForm((current) => ({ ...current, [field]: value }))
    setFormError('')
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.email.trim()) next.email = 'Enter your email address.'
    else if (!isEmail(form.email)) next.email = 'Enter a valid email, like name@example.com.'
    if (!form.password) next.password = 'Enter your password.'
    return next
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const next = validate()
    setErrors(next)
    setFormError('')
    if (Object.values(next).some(Boolean)) return
    if (!configured) {
      setFormError('Authentication is not configured yet. Add the Supabase environment variables and restart Vite.')
      return
    }
    setSubmitting(true)
    try {
      const result = await signIn({ email: form.email, password: form.password })
      if (result.error) throw result.error
      setRememberedEmail(form.remember ? form.email.trim() : '')
      if (!result.profile?.role) {
        setFormError('Your account was authenticated, but its profile is unavailable. Contact an administrator before continuing.')
        return
      }
      toast.success('You are signed in.', { title: 'Welcome back' })
      const destination = location.state?.from?.pathname
      const portal = roleHome(result.profile.role)
      navigate(destination?.startsWith(portal) ? destination : portal, { replace: true })
    } catch (error) {
      setFormError(error.message || 'Unable to sign in. Check your details and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const openForgot = () => {
    setForgotEmail(form.email)
    setForgotError('')
    setForgotSent(false)
    setForgotOpen(true)
  }

  const submitForgot = async (event) => {
    event.preventDefault()
    if (!isEmail(forgotEmail)) {
      setForgotError('Enter a valid email address.')
      return
    }
    setForgotError('')
    setSendingReset(true)
    try {
      await sendPasswordReset(forgotEmail)
      setForgotSent(true)
    } catch (error) {
      setForgotError(error.message || 'Unable to send a password reset email.')
    } finally {
      setSendingReset(false)
    }
  }

  return (
    <>
      <AuthShell
        title="Log in"
        subtitle="Welcome back. Enter your details to continue."
        footer={<>
          New to CareerAI?{' '}
          <Link to="/signup" className="font-medium text-accent hover:text-ink">Create an account</Link>
        </>}
      >
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {!configured && <p role="status" className="rounded-xl border border-warning/25 bg-warning/10 px-4 py-3 text-sm text-ink-muted">Supabase is not configured. You can browse public pages, but sign-in is unavailable.</p>}
          {formError && <p role="alert" className="rounded-xl border border-danger/25 bg-danger/10 px-4 py-3 text-sm text-danger">{formError}</p>}
          <Input label="Email" type="email" icon={Mail} autoComplete="email" placeholder="name@example.com" required value={form.email} onChange={update('email')} error={errors.email} />
          <PasswordInput autoComplete="current-password" placeholder="Enter your password" required value={form.password} onChange={update('password')} error={errors.password} />
          <div className="flex items-center justify-between gap-3">
            <Checkbox label="Remember me" checked={form.remember} onChange={update('remember')} />
            <button type="button" onClick={openForgot} className="text-sm font-medium text-accent transition-colors hover:text-ink">Forgot password?</button>
          </div>
          <Button type="submit" size="lg" className="w-full" loading={submitting} disabled={!configured || loading}>{submitting ? 'Signing in' : 'Log in'}</Button>
        </form>
      </AuthShell>
      <Modal
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
        title="Reset your password"
        description={forgotSent ? undefined : 'Enter your account email and Supabase will send a password reset link.'}
        footer={forgotSent ? <Button onClick={() => setForgotOpen(false)}>Done</Button> : <>
          <Button variant="secondary" onClick={() => setForgotOpen(false)}>Cancel</Button>
          <Button type="submit" form="forgot-form" loading={sendingReset}>Send reset link</Button>
        </>}
      >
        {forgotSent ? <p className="text-sm text-ink-muted">If an account exists for <span className="font-medium text-ink">{forgotEmail}</span>, a reset link has been sent.</p> : (
          <form id="forgot-form" onSubmit={submitForgot} noValidate>
            {forgotError && <p role="alert" className="mb-3 text-sm text-danger">{forgotError}</p>}
            <Input label="Email" type="email" icon={Mail} placeholder="name@example.com" value={forgotEmail} onChange={(event) => setForgotEmail(event.target.value)} error={forgotError} />
          </form>
        )}
      </Modal>
    </>
  )
}
