import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, User } from 'lucide-react'
import AuthShell from '../../components/layout/AuthShell'
import Button from '../../components/ui/Button'
import { Checkbox, Input, Select } from '../../components/ui/Input'
import PasswordInput from '../../components/ui/PasswordInput'
import { useToast } from '../../hooks/useToast'
import { isEmail, passwordChecks, passwordStrength } from '../../lib/validators'
import { cn } from '../../lib/cn'
import { useAuth } from '../../context/AuthContext'
import { roleHome } from '../../components/auth/RequireAuth'
import { getMyProfile } from '../../services/profileApi'

const roles = [
  { value: 'student', label: 'Student' },
  { value: 'recruiter', label: 'Recruiter' },
]
const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong']
const strengthColors = ['', 'bg-danger', 'bg-warning', 'bg-accent', 'bg-success']

function StrengthMeter({ password }) {
  const score = passwordStrength(password)
  if (!password) return null
  return <div className="-mt-1" aria-live="polite">
    <div className="flex gap-1.5" aria-hidden="true">{[1, 2, 3, 4].map((segment) => <span key={segment} className={cn('h-1.5 flex-1 rounded-full', segment <= score ? strengthColors[score] : 'bg-white/10')} />)}</div>
    <p className="mt-1.5 text-xs text-ink-muted">Password strength: {strengthLabels[score]}</p>
  </div>
}

export default function Signup() {
  const navigate = useNavigate()
  const toast = useToast()
  const { configured, user, profile, signUp } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', role: 'student', password: '', confirm: '', terms: false })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [confirmationRequired, setConfirmationRequired] = useState(false)

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
    if (form.name.trim().length < 2) next.name = 'Enter your full name.'
    if (!form.email.trim()) next.email = 'Enter your email address.'
    else if (!isEmail(form.email)) next.email = 'Enter a valid email, like name@example.com.'
    const checks = passwordChecks(form.password)
    if (!form.password) next.password = 'Create a password.'
    else if (!checks.length) next.password = 'Use at least 8 characters.'
    else if (!checks.letter || !checks.number) next.password = 'Include at least one letter and one number.'
    if (!form.confirm) next.confirm = 'Confirm your password.'
    else if (form.confirm !== form.password) next.confirm = 'Passwords do not match.'
    if (!form.terms) next.terms = 'Accept the terms to continue.'
    if (!roles.some((role) => role.value === form.role)) next.role = 'Choose Student or Recruiter.'
    return next
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const next = validate()
    setErrors(next)
    setFormError('')
    setConfirmationRequired(false)
    if (Object.values(next).some(Boolean)) return
    if (!configured) {
      setFormError('Authentication is not configured yet. Add the Supabase environment variables and restart Vite.')
      return
    }
    setSubmitting(true)
    try {
      const { data, error } = await signUp({ email: form.email, password: form.password, fullName: form.name, role: form.role })
      if (error) throw error
      if (!data.session) {
        setConfirmationRequired(true)
        return
      }
      const { data: createdProfile, error: profileError } = await getMyProfile(data.user.id)
      if (profileError) throw profileError
      toast.success('Your account was created.', { title: `Welcome, ${form.name.trim().split(' ')[0]}` })
      navigate(roleHome(createdProfile.role), { replace: true })
    } catch (error) {
      setFormError(error.message || 'Unable to create your account. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return <AuthShell
    title="Create your account"
    subtitle="Set up your CareerAI account."
    footer={<>
      Already have an account?{' '}
      <Link to="/login" className="font-medium text-accent hover:text-ink">Log in</Link>
    </>}
  >
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {!configured && <p role="status" className="rounded-xl border border-warning/25 bg-warning/10 px-4 py-3 text-sm text-ink-muted">Supabase is not configured. Account creation is unavailable.</p>}
      {formError && <p role="alert" className="rounded-xl border border-danger/25 bg-danger/10 px-4 py-3 text-sm text-danger">{formError}</p>}
      {confirmationRequired && <p role="status" className="rounded-xl border border-success/25 bg-success/10 px-4 py-3 text-sm text-ink-muted">Check your email to confirm your account, then log in. Your role is assigned by the database signup trigger.</p>}
      <Input label="Full name" icon={User} autoComplete="name" placeholder="Riya Verma" required value={form.name} onChange={update('name')} error={errors.name} />
      <Input label="Email" type="email" icon={Mail} autoComplete="email" placeholder="name@example.com" required value={form.email} onChange={update('email')} error={errors.email} />
      <Select label="I am a" value={form.role} onChange={update('role')}>
        {roles.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
      </Select>
      <PasswordInput autoComplete="new-password" placeholder="At least 8 characters" hint="Use letters and numbers." required value={form.password} onChange={update('password')} error={errors.password} />
      <StrengthMeter password={form.password} />
      <PasswordInput label="Confirm password" autoComplete="new-password" placeholder="Re-enter your password" required value={form.confirm} onChange={update('confirm')} error={errors.confirm} />
      <div>
        <Checkbox label="I agree to create a CareerAI account." checked={form.terms} onChange={update('terms')} />
        {errors.terms && <p role="alert" className="mt-1.5 text-xs text-danger">{errors.terms}</p>}
      </div>
      <Button type="submit" size="lg" className="w-full" loading={submitting} disabled={!configured}>{submitting ? 'Creating account' : 'Create account'}</Button>
    </form>
  </AuthShell>
}
