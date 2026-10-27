import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { createApplication, deleteMyApplication, listMyApplications, withdrawMyApplication } from '../services/applicationsApi'

export function useApplications() {
  const { user } = useAuth()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const requestId = useRef(0)

  const refresh = useCallback(async () => {
    const currentRequest = ++requestId.current
    if (!user?.id) {
      setApplications([])
      setError('')
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    try {
      const rows = await listMyApplications(user.id)
      if (currentRequest === requestId.current) setApplications(rows)
    } catch (loadError) {
      if (currentRequest === requestId.current) setError(loadError.message || 'Unable to load your applications.')
    } finally {
      if (currentRequest === requestId.current) setLoading(false)
    }
  }, [user?.id])

  useEffect(() => { void refresh() }, [refresh])
  useEffect(() => () => { requestId.current += 1 }, [])

  const hasApplied = useCallback((jobId) => applications.some((item) => item.jobId === jobId && item.status !== 'Withdrawn'), [applications])

  const applyToJob = useCallback(async (jobId) => {
    if (!user?.id) throw new Error('Sign in before applying to a job.')
    const created = await createApplication(user.id, jobId)
    setApplications((current) => [created, ...current.filter((item) => item.jobId !== jobId)])
    return created
  }, [user?.id])

  const withdraw = useCallback(async (applicationId) => {
    if (!user?.id) throw new Error('Sign in before withdrawing an application.')
    const updated = await withdrawMyApplication(user.id, applicationId)
    setApplications((current) => current.map((item) => item.id === applicationId ? updated : item))
    return updated
  }, [user?.id])

  const remove = useCallback(async (applicationId) => {
    if (!user?.id) throw new Error('Sign in before removing an application.')
    await deleteMyApplication(user.id, applicationId)
    setApplications((current) => current.filter((item) => item.id !== applicationId))
  }, [user?.id])

  return { applications, loading, error, hasApplied, applyToJob, withdraw, remove, refresh }
}
