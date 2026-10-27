import { useState } from 'react'
import { Pencil } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card, { CardHeader } from '../../components/ui/Card'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Detail from '../../components/ui/Detail'
import Tabs from '../../components/ui/Tabs'
import Switch from '../../components/ui/Switch'
import { Input, Select, Textarea } from '../../components/ui/Input'
import { DemoNotice } from '../../components/ui/DemoBadge'
import { useRecruiterProfile } from '../../hooks/useRecruiterProfile'
import { useToast } from '../../hooks/useToast'
import { jobTypes, workModes } from '../../lib/jobForm'
import { isHttpUrl, isPhone } from '../../lib/validators'

const industries = ['Software products', 'IT services', 'Analytics', 'Digital marketing', 'Education', 'Other']
const sizes = ['1-10 people', '10-50 people', '50-200 people', '200-1,000 people', '1,000+ people']

function validate(draft) {
  const errors = {}
  if (draft.recruiterName.trim().length < 2) errors.recruiterName = 'Enter your full name.'
  if (draft.phone.trim() && !isPhone(draft.phone)) errors.phone = 'Use digits only, for example 98765 43210.'
  if (!draft.companyName.trim()) errors.companyName = 'Enter the company name.'
  if (draft.website.trim() && !isHttpUrl(draft.website)) errors.website = 'Start the link with http:// or https://'
  if (draft.about.length > 500) errors.about = 'Keep the description under 500 characters.'
  return errors
}

export default function RecruiterProfileSettings() {
  const toast = useToast()
  const [profile, setProfile] = useRecruiterProfile()
  const [tab, setTab] = useState('company')
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(null)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [prefSaving, setPrefSaving] = useState(false)

  const startEditing = () => {
    setDraft({ ...profile })
    setErrors({})
    setEditing(true)
  }
  const set = (field) => (event) => {
    setDraft((current) => ({ ...current, [field]: event.target.value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
  }
  const save = async (event) => {
    event.preventDefault()
    const found = validate(draft)
    setErrors(found)
    if (Object.keys(found).length > 0) return
    setSaving(true)
    try {
      await setProfile({ ...draft, recruiterName: draft.recruiterName.trim(), companyName: draft.companyName.trim() })
      setEditing(false)
      toast.success('Recruiter profile saved to your account.', { title: 'Saved' })
    } catch (error) {
      toast.error(error.message || 'Unable to save your recruiter profile.')
    } finally {
      setSaving(false)
    }
  }
  const setPref = async (key, value) => {
    if (prefSaving) return
    setPrefSaving(true)
    try {
      await setProfile({ ...profile, preferences: { ...profile.preferences, [key]: value } })
      toast.success('Preference saved.')
    } catch (error) {
      toast.error(error.message || 'Unable to save this preference.')
    } finally {
      setPrefSaving(false)
    }
  }

  const tabs = [
    { id: 'company', label: 'Company & recruiter' },
    { id: 'preferences', label: 'Preferences' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile & settings"
        description="Keep your company details and hiring preferences up to date."
        badge={<Badge tone="info">Supabase profile</Badge>}
      />

      <Card className="flex flex-wrap items-center gap-4">
        <Avatar name={profile.recruiterName} size="lg" />
        <div className="min-w-0">
          <p className="text-lg font-semibold text-ink">{profile.recruiterName}</p>
          <p className="text-sm text-ink-muted">
            {profile.jobTitle} at {profile.companyName}
          </p>
          <div className="mt-2">
            <Badge tone="brand">Recruiter</Badge>
          </div>
        </div>
      </Card>

      <Tabs tabs={tabs} value={tab} onChange={setTab} label="Profile sections" />

      {tab === 'company' && !editing && (
        <Card>
          <CardHeader
            title="Company and recruiter details"
            action={
              <Button variant="secondary" size="sm" icon={Pencil} onClick={startEditing}>
                Edit profile
              </Button>
            }
          />
          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Detail label="Recruiter name">{profile.recruiterName}</Detail>
            <Detail label="Job title">{profile.jobTitle}</Detail>
            <Detail label="Email">{profile.email}</Detail>
            <Detail label="Phone">{profile.phone}</Detail>
            <Detail label="Company">{profile.companyName}</Detail>
            <Detail label="Industry">{profile.industry}</Detail>
            <Detail label="Company size">{profile.companySize}</Detail>
            <Detail label="Location">{profile.location}</Detail>
            <div className="sm:col-span-2">
              <Detail label="Website">{profile.website}</Detail>
            </div>
            <div className="sm:col-span-2">
              <Detail label="About the company">{profile.about}</Detail>
            </div>
          </dl>
        </Card>
      )}

      {tab === 'company' && editing && (
        <Card>
          <CardHeader title="Edit profile" description="Fields marked with * are required." />
          <form onSubmit={save} noValidate className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Recruiter name" required value={draft.recruiterName} onChange={set('recruiterName')} error={errors.recruiterName} autoComplete="name" />
              <Input label="Job title" value={draft.jobTitle} onChange={set('jobTitle')} />
              <Input label="Phone" type="tel" value={draft.phone} onChange={set('phone')} error={errors.phone} placeholder="98765 43210" autoComplete="tel" />
              <Input label="Company name" required value={draft.companyName} onChange={set('companyName')} error={errors.companyName} />
              <Select label="Industry" value={draft.industry} onChange={set('industry')}>
                {industries.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </Select>
              <Select label="Company size" value={draft.companySize} onChange={set('companySize')}>
                {sizes.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </Select>
              <Input label="Location" value={draft.location} onChange={set('location')} />
              <div className="sm:col-span-2">
                <Input label="Website" value={draft.website} onChange={set('website')} error={errors.website} placeholder="https://your-company.com" />
              </div>
              <div className="sm:col-span-2">
                <Textarea
                  label="About the company"
                  rows={5}
                  value={draft.about}
                  onChange={set('about')}
                  error={errors.about}
                  hint={`${draft.about.length}/500 characters. Students see this on your job posts.`}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button type="submit" loading={saving} disabled={saving}>{saving ? 'Saving' : 'Save changes'}</Button>
              <Button variant="secondary" onClick={() => setEditing(false)} disabled={saving}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {tab === 'preferences' && (
        <div className="space-y-6">
          <DemoNotice>Preferences are saved to your account. Alert emails, weekly reports and automatic job closing are not implemented yet.</DemoNotice>
          <Card>
            <CardHeader title="Notifications and automation" />
            <div className="space-y-5">
              <Switch disabled={prefSaving} label="New applicant alerts" description="Tell me when someone applies to one of my jobs." checked={profile.preferences.newApplicantAlerts} onChange={(value) => setPref('newApplicantAlerts', value)} />
              <Switch disabled={prefSaving} label="Weekly hiring report" description="A summary of applicants and open jobs every week." checked={profile.preferences.weeklyReport} onChange={(value) => setPref('weeklyReport', value)} />
              <Switch disabled={prefSaving} label="Close jobs at the deadline" description="Move a job to closed once its application deadline passes." checked={profile.preferences.autoClose} onChange={(value) => setPref('autoClose', value)} />
            </div>
          </Card>
          <Card>
            <CardHeader title="Defaults for new jobs" description="Used to pre-fill the Post a job form." />
            <div className="grid grid-cols-1 max-w-xl gap-4 sm:grid-cols-2">
              <Select label="Job type" disabled={prefSaving} value={profile.preferences.defaultType} onChange={(event) => setPref('defaultType', event.target.value)}>
                {jobTypes.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </Select>
              <Select label="Work mode" disabled={prefSaving} value={profile.preferences.defaultMode} onChange={(event) => setPref('defaultMode', event.target.value)}>
                {workModes.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </Select>
            </div>
          </Card>
        </div>
      )}

    </div>
  )
}
