import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { seedModerationJobs, seedReports } from '../data/admin'
import { todayIso } from '../lib/format'

export function useModeration() {
  const [jobs, setJobs] = useLocalStorage('moderationJobs', seedModerationJobs)
  const [reports, setReports] = useLocalStorage('moderationReports', seedReports)

  // Called when a recruiter submits a job, so it lands in the admin queue.
  const submitJob = useCallback(
    (job) => setJobs((current) => [{ ...job, id: `mj-${Date.now()}`, postedOn: todayIso(), status: 'Pending' }, ...current]),
    [setJobs],
  )

  const decideJob = useCallback(
    (id, status, reason = '') =>
      setJobs((current) => current.map((job) => (job.id === id ? { ...job, status, reason, decidedOn: todayIso() } : job))),
    [setJobs],
  )

  const undoDecision = useCallback(
    (id) =>
      setJobs((current) =>
        current.map((job) => {
          if (job.id !== id) return job
          const { decidedOn: _d, reason: _r, ...rest } = job
          return { ...rest, status: 'Pending' }
        }),
      ),
    [setJobs],
  )

  const setReportStatus = useCallback(
    (id, status) => setReports((current) => current.map((report) => (report.id === id ? { ...report, status } : report))),
    [setReports],
  )

  return { jobs, reports, submitJob, decideJob, undoDecision, setReportStatus }
}
