import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { updateMyProfile } from '../services/profileApi'

export function useCareerRole() {
  const { user, profile, refreshProfile } = useAuth()
  const [role, setRole] = useState(profile?.target_role ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => setRole(profile?.target_role ?? ''), [profile?.target_role])

  const saveRole = useCallback(async () => {
    const value = role.trim()
    if (!value) {
      setError('Enter a target career role first.')
      return false
    }
    if (value.length > 80) {
      setError('Keep the target role under 80 characters.')
      return false
    }
    if (!user?.id) {
      setError('Sign in to save your target role.')
      return false
    }
    setSaving(true)
    setError('')
    try {
      await updateMyProfile(user.id, { target_role: value })
      await refreshProfile()
      setRole(value)
      return true
    } catch (saveError) {
      setError(saveError.message || 'Unable to save your target role.')
      return false
    } finally {
      setSaving(false)
    }
  }, [role, user?.id, refreshProfile])

  return { role, setRole, saving, error, saveRole }
}
