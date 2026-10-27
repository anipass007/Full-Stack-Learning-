import { useEffect, useState } from 'react'
import Card, { CardHeader } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Switch from '../../../components/ui/Switch'
import { Select } from '../../../components/ui/Input'

const defaults = { applicationEmails: true, jobAlerts: true, weeklySummary: false, visibility: 'recruiters' }

export default function PreferencesTab({ preferences, onSave, saving = false, saveError = '' }) {
  const [draft, setDraft] = useState({ ...defaults, ...preferences })
  useEffect(() => setDraft({ ...defaults, ...preferences }), [preferences])
  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader title="Notifications" description="These preferences are saved to your account." />
        <div className="space-y-5">
          <Switch label="Application updates" description="Tell me when an application changes status." checked={draft.applicationEmails} onChange={(value) => update('applicationEmails', value)} />
          <Switch label="Job alerts" description="Suggest new jobs that match my skills." checked={draft.jobAlerts} onChange={(value) => update('jobAlerts', value)} />
          <Switch label="Weekly progress summary" description="A short summary of roadmap and interview progress." checked={draft.weeklySummary} onChange={(value) => update('weeklySummary', value)} />
        </div>
      </Card>
      <Card>
        <CardHeader title="Privacy" />
        <div className="max-w-sm">
          <Select label="Who can see my profile" value={draft.visibility} onChange={(event) => update('visibility', event.target.value)}>
            <option value="recruiters">Verified recruiters</option>
            <option value="applied">Only companies I applied to</option>
            <option value="hidden">Nobody</option>
          </Select>
        </div>
      </Card>
      {saveError && <p role="alert" className="text-sm text-danger">{saveError}</p>}
      <Button loading={saving} onClick={() => onSave(draft)}>{saving ? 'Saving preferences' : 'Save preferences'}</Button>
    </div>
  )
}
