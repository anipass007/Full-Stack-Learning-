import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { listRecruiterApplicants, updateRecruiterApplicationStatus } from '../services/applicationsApi'

export function useApplicants() {
  const { user } = useAuth()
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState(null)
  const requestId = useRef(0)

  const refresh = useCallback(async () => {
    const currentRequest = ++requestId.current
    if (!user?.id) {
      setApplicants([])
      setError('')
      setLoading(false)
      return
    }
    setApplicants([])
    setLoading(true)
    setError('')
    try {
      const rows = await listRecruiterApplicants(user.id)
      if (currentRequest === requestId.current) setApplicants(rows)
    } catch (loadError) {
      if (currentRequest === requestId.current) setError(loadError.message || 'Unable to load applicants for your jobs.')
    } finally {
      if (currentRequest === requestId.current) setLoading(false)
    }
  }, [user?.id])

  useEffect(() => { void refresh() }, [refresh])
  useEffect(() => () => { requestId.current += 1 }, [])

  const setStatus = useCallback(async (id, status) => {
    setSavingId(id)
    setError('')
    try {
      const updated = await updateRecruiterApplicationStatus(id, status)
      setApplicants((current) => current.map((item) => item.id === id ? { ...item, status: updated.status } : item))
      return updated
    } catch (updateError) {
      setError(updateError.message || 'Unable to update the application status.')
      throw updateError
    } finally {
      setSavingId(null)
    }
  }, [])

  return { applicants, loading, error, savingId, setStatus, refresh }
}
