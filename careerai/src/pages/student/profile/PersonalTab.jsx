import { useState } from 'react'
import { Pencil } from 'lucide-react'
import Card, { CardHeader } from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import Detail from '../../../components/ui/Detail'
import { Input, Select, Textarea } from '../../../components/ui/Input'
import { roleNames } from '../../../data/skills'
import { courseOptions, interestOptions, validateProfile, yearOptions } from '../../../lib/profile'
import { cn } from '../../../lib/cn'

export default function PersonalTab({ profile, targetRole, onSave, saving = false, saveError = '' }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(null)
  const [draftRole, setDraftRole] = useState(targetRole)
  const [errors, setErrors] = useState({})

  const startEditing = () => {
    setDraft({ ...profile, links: { ...profile.links }, interests: [...profile.interests] })
    setDraftRole(targetRole)
    setErrors({})
    setEditing(true)
  }

  const setField = (field) => (event) => {
    setDraft((current) => ({ ...current, [field]: event.target.value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
  }
  const setLink = (field) => (event) => {
    setDraft((current) => ({ ...current, links: { ...current.links, [field]: event.target.value } }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
  }
  const toggleInterest = (interest) =>
    setDraft((current) => ({
      ...current,
      interests: current.interests.includes(interest) ? current.interests.filter((item) => item !== interest) : [...current.interests, interest],
    }))

  const submit = async (event) => {
    event.preventDefault()
    const found = validateProfile(draft)
    setErrors(found)
    if (Object.keys(found).length > 0) return
    const saved = await onSave({ ...draft, name: draft.name.trim(), email: draft.email.trim() }, draftRole)
    if (saved) setEditing(false)
  }

  if (!editing) {
    return (
      <Card>
        <CardHeader
          title="Profile details"
          description="This is what recruiters would see in a real version."
          action={
            <Button variant="secondary" size="sm" icon={Pencil} onClick={startEditing}>
              Edit profile
            </Button>
          }
        />
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Detail label="Full name">{profile.name}</Detail>
          <Detail label="Email">{profile.email}</Detail>
          <Detail label="Phone">{profile.phone}</Detail>
          <Detail label="Location">{profile.location}</Detail>
          <Detail label="Course">{profile.course}</Detail>
          <Detail label="Year">{profile.year}</Detail>
          <div className="sm:col-span-2">
            <Detail label="College">{profile.college}</Detail>
          </div>
          <Detail label="Target job role">{targetRole}</Detail>
          <div className="sm:col-span-2">
            <Detail label="About me">{profile.summary}</Detail>
          </div>
          <Detail label="GitHub">{profile.links.github}</Detail>
          <Detail label="Portfolio">{profile.links.portfolio}</Detail>
          <div className="sm:col-span-2">
            <dt className="text-xs text-ink-faint">Career interests</dt>
            <dd className="mt-2 flex flex-wrap gap-2">
              {profile.interests.length === 0 ? (
                <span className="text-sm text-ink-faint">Not added</span>
              ) : (
                profile.interests.map((interest) => <Badge key={interest} tone="brand">{interest}</Badge>)
              )}
            </dd>
          </div>
        </dl>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader title="Edit profile" description="Fields marked with * are required." />
      <form onSubmit={submit} noValidate className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Full name" required value={draft.name} onChange={setField('name')} error={errors.name} autoComplete="name" />
          <Input label="Email" type="email" required value={draft.email} disabled hint="Your sign-in email is managed by account settings." autoComplete="email" />
          <Input label="Phone" type="tel" value={draft.phone} onChange={setField('phone')} error={errors.phone} placeholder="98765 43210" autoComplete="tel" />
          <Input label="Location" value={draft.location} onChange={setField('location')} />
          <Select label="Course" value={draft.course} onChange={setField('course')}>
            {courseOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
          <Select label="Year" value={draft.year} onChange={setField('year')}>
            {yearOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
          <div className="sm:col-span-2">
            <Input label="College" required value={draft.college} onChange={setField('college')} error={errors.college} />
          </div>
          <div className="sm:col-span-2">
            <Select label="Target job role" value={draftRole} onChange={(event) => setDraftRole(event.target.value)} hint="Used for skill gap, roadmap and interview practice.">
              {roleNames.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Textarea
              label="About me"
              rows={4}
              value={draft.summary}
              onChange={setField('summary')}
              error={errors.summary}
              hint={`${draft.summary.length}/300 characters. Two lines on the role you want and what you have built.`}
            />
          </div>
          <Input label="GitHub link" value={draft.links.github} onChange={setLink('github')} error={errors.github} placeholder="https://github.com/your-name" />
          <Input label="Portfolio link" value={draft.links.portfolio} onChange={setLink('portfolio')} error={errors.portfolio} placeholder="https://your-site.com" />
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-ink">Career interests</legend>
          <div className="flex flex-wrap gap-2">
            {interestOptions.map((interest) => {
              const active = draft.interests.includes(interest)
              return (
                <button
                  key={interest}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleInterest(interest)}
                  className={cn(
                    'rounded-full border px-3.5 py-1.5 text-sm transition-colors',
                    active ? 'border-brand bg-brand/15 text-ink' : 'border-line text-ink-muted hover:text-ink',
                  )}
                >
                  {interest}
                </button>
              )
            })}
          </div>
        </fieldset>

        {saveError && <p role="alert" className="text-sm text-danger">{saveError}</p>}
        <div className="flex flex-wrap gap-3">
          <Button type="submit" loading={saving}>{saving ? 'Saving' : 'Save changes'}</Button>
          <Button variant="secondary" onClick={() => setEditing(false)} disabled={saving}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
