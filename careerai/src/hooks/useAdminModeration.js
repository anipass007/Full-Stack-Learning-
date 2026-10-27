import { useCallback, useEffect, useState } from 'react'
import { listAdminJobs, setAdminJobStatus } from '../services/adminApi'

export function useAdminModeration() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setJobs(await listAdminJobs())
    } catch (loadError) {
      setError(loadError.message || 'Unable to load the moderation queue.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  const decide = useCallback(async (jobId, status, reason = null) => {
    setSaving(true)
    setError('')
    try {
      await setAdminJobStatus(jobId, status, reason)
      await refresh()
    } catch (saveError) {
      setError(saveError.message || 'Unable to save this moderation decision.')
      throw saveError
    } finally {
      setSaving(false)
    }
  }, [refresh])

  return { jobs, loading, saving, error, refresh, decide }
}
