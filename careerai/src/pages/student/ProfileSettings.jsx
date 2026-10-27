import { useState } from 'react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import Tabs from '../../components/ui/Tabs'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../hooks/useToast'
import { studentProfileToRow, toStudentProfile, updateMyProfile } from '../../services/profileApi'
import PersonalTab from './profile/PersonalTab'
import SkillsTab from './profile/SkillsTab'
import PreferencesTab from './profile/PreferencesTab'

const defaultPreferences = { applicationEmails: true, jobAlerts: true, weeklySummary: false, visibility: 'recruiters' }

export default function ProfileSettings() {
  const toast = useToast()
  const { user, profile: profileRow, refreshProfile } = useAuth()
  const profile = toStudentProfile(profileRow, user?.email)
  const [tab, setTab] = useState('profile')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const preferences = { ...defaultPreferences, ...(profile.preferences ?? {}) }

  const persist = async (changes, successMessage) => {
    setSaving(true)
    setSaveError('')
    try {
      await updateMyProfile(user.id, changes)
      await refreshProfile()
      toast.success(successMessage, { title: 'Saved' })
      return true
    } catch (error) {
      setSaveError(error.message || 'Unable to save your profile. Please try again.')
      return false
    } finally {
      setSaving(false)
    }
  }

  const saveProfile = async (next, targetRole) => {
    const updated = { ...profile, ...next, targetRole, preferences }
    return persist(studentProfileToRow(updated), 'Profile updated.')
  }

  const saveSkills = (skills) => persist({ skills }, 'Skills updated.')
  const savePreferences = (nextPreferences) => persist({ preferences: nextPreferences }, 'Preferences updated.')

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'skills', label: 'Skills', count: Object.keys(profile.skills).length },
    { id: 'preferences', label: 'Account preferences' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Profile & settings" description="Keep your details, skills and preferences up to date." badge={<Badge tone="success">Synced to your account</Badge>} />

      <Card className="flex flex-wrap items-center gap-4">
        <Avatar name={profile.name || user?.email} size="lg" />
        <div className="min-w-0">
          <p className="text-lg font-semibold text-ink">{profile.name || 'Add your name'}</p>
          <p className="text-sm text-ink-muted">{[profile.course, profile.year, profile.college].filter(Boolean).join(' · ') || 'Add your course and college'}</p>
          <div className="mt-2 flex flex-wrap gap-2"><Badge tone="brand">Target: {profile.targetRole || 'Not selected'}</Badge></div>
        </div>
      </Card>

      {saveError && <p role="alert" className="rounded-xl border border-danger/25 bg-danger/10 px-4 py-3 text-sm text-danger">{saveError}</p>}
      <Tabs tabs={tabs} value={tab} onChange={setTab} label="Profile sections" />
      {tab === 'profile' && <PersonalTab profile={profile} targetRole={profile.targetRole} onSave={saveProfile} saving={saving} saveError={saveError} />}
      {tab === 'skills' && <SkillsTab skills={profile.skills} onSave={saveSkills} saving={saving} saveError={saveError} />}
      {tab === 'preferences' && <PreferencesTab preferences={preferences} onSave={savePreferences} saving={saving} saveError={saveError} />}
    </div>
  )
}
