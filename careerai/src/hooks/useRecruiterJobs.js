import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { createMyJob, deleteMyJob, listMyJobs, transitionMyJob, updateMyJob } from '../services/jobsApi'

export function useRecruiterJobs({ loadOnMount = true } = {}) {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const requestId = useRef(0)

  const refresh = useCallback(async () => {
    const currentRequest = ++requestId.current
    if (!user?.id) {
      setJobs([])
      setLoading(false)
      return
    }
    setJobs([])
    setLoading(true)
    setError('')
    try {
      const rows = await listMyJobs(user.id)
      if (currentRequest === requestId.current) setJobs(rows)
    } catch (loadError) {
      if (currentRequest === requestId.current) setError(loadError.message || 'Unable to load your jobs.')
    } finally {
      if (currentRequest === requestId.current) setLoading(false)
    }
  }, [user?.id])

  useEffect(() => { if (loadOnMount) void refresh() }, [refresh, loadOnMount])
  useEffect(() => () => { requestId.current += 1 }, [])

  const addJob = useCallback(async (values) => {
    if (!user?.id) throw new Error('You need to sign in before posting a job.')
    setSaving(true)
    setError('')
    try {
      const created = await createMyJob(user.id, values)
      setJobs((current) => [created, ...current])
      return created
    } catch (operationError) {
      setError(operationError.message || 'Unable to post this job.')
      throw operationError
    } finally {
      setSaving(false)
    }
  }, [user?.id])

  const updateJob = useCallback(async (jobId, values) => {
    if (!user?.id) throw new Error('You need to sign in before editing a job.')
    setSaving(true)
    setError('')
    try {
      const updated = await updateMyJob(user.id, jobId, values)
      setJobs((current) => current.map((job) => job.id === jobId ? { ...job, ...updated, applicantCount: updated.applicantCount ?? job.applicantCount } : job))
      return updated
    } catch (operationError) {
      setError(operationError.message || 'Unable to update this job.')
      throw operationError
    } finally {
      setSaving(false)
    }
  }, [user?.id])

  const setStatus = useCallback(async (jobId, status) => {
    if (!user?.id) throw new Error('You need to sign in before changing a job.')
    setSaving(true)
    setError('')
    try {
      const updated = await transitionMyJob(user.id, jobId, status)
      setJobs((current) => current.map((job) => job.id === jobId ? { ...job, ...updated, applicantCount: updated.applicantCount ?? job.applicantCount } : job))
      return updated
    } catch (operationError) {
      setError(operationError.message || 'Unable to change this job status.')
      throw operationError
    } finally {
      setSaving(false)
    }
  }, [user?.id])

  const removeJob = useCallback(async (jobId) => {
    if (!user?.id) throw new Error('You need to sign in before deleting a job.')
    setSaving(true)
    setError('')
    try {
      await deleteMyJob(user.id, jobId)
      setJobs((current) => current.filter((job) => job.id !== jobId))
    } catch (operationError) {
      setError(operationError.message || 'Unable to delete this job.')
      throw operationError
    } finally {
      setSaving(false)
    }
  }, [user?.id])

  return { jobs, loading, error, saving, refresh, addJob, updateJob, setStatus, removeJob }
}
