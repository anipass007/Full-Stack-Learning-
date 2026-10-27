import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import Card, { CardHeader } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Switch from '../../../components/ui/Switch'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import { Input, Select } from '../../../components/ui/Input'
import { DemoNotice } from '../../../components/ui/DemoBadge'
import { defaultSettings } from '../../../data/admin'
import { usePlatformSettings } from '../../../hooks/usePlatformSettings'
import { useToast } from '../../../hooks/useToast'
import { isEmail } from '../../../lib/validators'
import { resetDemoData } from '../../../lib/demo'

export default function SettingsTab() {
  const toast = useToast()
  const [saved, setSaved] = usePlatformSettings()
  const [draft, setDraft] = useState(saved)
  const [errors, setErrors] = useState({})
  const [maintenanceOpen, setMaintenanceOpen] = useState(false)
  const [defaultsOpen, setDefaultsOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)

  const dirty = JSON.stringify(draft) !== JSON.stringify(saved)
  const set = (key) => (value) => setDraft((current) => ({ ...current, [key]: value }))
  const setField = (key) => (event) => {
    set(key)(event.target.value)
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const save = (event) => {
    event.preventDefault()
    const found = {}
    if (draft.platformName.trim().length < 2) found.platformName = 'Enter a platform name of at least 2 characters.'
    if (!isEmail(draft.supportEmail)) found.supportEmail = 'Enter a valid support email address.'
    setErrors(found)
    if (Object.keys(found).length > 0) return
    setSaved({ ...draft, platformName: draft.platformName.trim(), supportEmail: draft.supportEmail.trim() })
    toast.success('Settings saved in this browser.', { title: 'Saved' })
  }

  return (
    <form onSubmit={save} noValidate className="space-y-6">
      <DemoNotice>These settings are saved in this browser only. They do not change how the student and recruiter portals behave in this demo.</DemoNotice>

      <Card>
        <CardHeader title="General" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Platform name" required value={draft.platformName} onChange={setField('platformName')} error={errors.platformName} />
          <Input label="Support email" type="email" required value={draft.supportEmail} onChange={setField('supportEmail')} error={errors.supportEmail} />
          <Select label="Job posts expire after" value={draft.jobExpiryDays} onChange={setField('jobExpiryDays')}>
            {['15', '30', '60', '90'].map((days) => (
              <option key={days} value={days}>
                {days} days
              </option>
            ))}
          </Select>
        </div>
      </Card>

      <Card>
        <CardHeader title="Registration and approval" />
        <div className="space-y-5">
          <Switch label="Allow student sign-ups" description="New students can create accounts." checked={draft.allowStudentSignup} onChange={set('allowStudentSignup')} />
          <Switch label="Allow recruiter sign-ups" description="New recruiters can create accounts." checked={draft.allowRecruiterSignup} onChange={set('allowRecruiterSignup')} />
          <Switch label="Verify recruiters before they can post" description="New recruiters wait in the verification list." checked={draft.requireVerification} onChange={set('requireVerification')} />
          <Switch label="Approve job posts before they go live" description="New jobs wait in the moderation queue." checked={draft.requireJobApproval} onChange={set('requireJobApproval')} />
        </div>
      </Card>

      <Card>
        <CardHeader title="Maintenance" />
        <Switch
          label="Maintenance mode"
          description="Show a maintenance message to students and recruiters while you work on the platform."
          checked={draft.maintenanceMode}
          onChange={(value) => (value ? setMaintenanceOpen(true) : set('maintenanceMode')(false))}
        />
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={!dirty}>
          Save settings
        </Button>
        <Button
          variant="secondary"
          disabled={!dirty}
          onClick={() => {
            setDraft(saved)
            setErrors({})
          }}
        >
          Discard changes
        </Button>
        <Button variant="ghost" onClick={() => setDefaultsOpen(true)}>
          Restore defaults
        </Button>
        {dirty && <span className="text-sm text-warning">You have unsaved changes.</span>}
      </div>

      <Card>
        <CardHeader title="Demo data" description="Clear everything this demo saved in your browser, across the student, recruiter and admin portals." />
        <Button variant="danger" icon={RotateCcw} onClick={() => setResetOpen(true)}>
          Reset demo data
        </Button>
      </Card>

      <ConfirmDialog
        open={maintenanceOpen}
        onClose={() => setMaintenanceOpen(false)}
        onConfirm={() => set('maintenanceMode')(true)}
        title="Turn on maintenance mode?"
        description="In a real system, users would see a maintenance page. Remember to save the settings for it to take effect."
        confirmLabel="Turn on"
      />
      <ConfirmDialog
        open={defaultsOpen}
        onClose={() => setDefaultsOpen(false)}
        onConfirm={() => {
          setDraft(defaultSettings)
          setErrors({})
          toast.info('Defaults restored. Save to keep them.')
        }}
        title="Restore default settings?"
        description="The form will go back to the default values. Nothing is saved until you press Save settings."
        confirmLabel="Restore defaults"
        tone="primary"
      />
      <ConfirmDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={() => resetDemoData('/admin')}
        title="Reset all demo data?"
        description="Everything you changed will go back to the sample starting point. The page will reload."
        confirmLabel="Reset demo data"
      />
    </form>
  )
}
