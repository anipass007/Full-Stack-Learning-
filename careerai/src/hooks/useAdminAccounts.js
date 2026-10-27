import { useCallback, useEffect, useState } from 'react'
import { listAdminProfiles, updateAdminProfileRole } from '../services/adminApi'

export function useAdminAccounts() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState(null)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setUsers(await listAdminProfiles())
    } catch (loadError) {
      setError(loadError.message || 'Unable to load account profiles.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  const setRole = useCallback(async (user, role) => {
    setSavingId(user.id)
    setError('')
    try {
      await updateAdminProfileRole(user.id, role.toLowerCase())
      await refresh()
    } catch (saveError) {
      setError(saveError.message || 'Unable to update this account role.')
      throw saveError
    } finally {
      setSavingId(null)
    }
  }, [refresh])

  return { users, loading, savingId, error, refresh, setRole }
}
