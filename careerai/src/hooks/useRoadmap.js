import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { deleteMyRoadmapProgress, listMyRoadmapProgress, saveMyRoadmapTask } from '../services/roadmapApi'

export function useRoadmap(targetRole = '', milestones = []) {
  const { user } = useAuth()
  const [completed, setCompleted] = useState([])
  const [loading, setLoading] = useState(Boolean(targetRole))
  const [error, setError] = useState('')
  const [savingTaskId, setSavingTaskId] = useState(null)
  const requestId = useRef(0)
  const roleRef = useRef(targetRole)
  roleRef.current = targetRole

  const refresh = useCallback(async () => {
    const currentRequest = ++requestId.current
    if (!user?.id || !targetRole.trim()) {
      setCompleted([])
      setError('')
      setLoading(false)
      return
    }
    setCompleted([])
    setLoading(true)
    setError('')
    try {
      const rows = await listMyRoadmapProgress(user.id, targetRole)
      if (currentRequest === requestId.current) setCompleted(rows.filter((row) => row.completed).map((row) => row.task_id))
    } catch (loadError) {
      if (currentRequest === requestId.current) setError(loadError.message || 'Unable to load your saved roadmap progress.')
    } finally {
      if (currentRequest === requestId.current) setLoading(false)
    }
  }, [user?.id, targetRole])

  useEffect(() => { void refresh() }, [refresh])
  useEffect(() => () => { requestId.current += 1 }, [])

  const toggleTask = useCallback(async (taskId) => {
    if (!user?.id || !targetRole.trim() || savingTaskId) return false
    const wasCompleted = completed.includes(taskId)
    const nextCompleted = !wasCompleted
    const taskRole = targetRole
    setSavingTaskId(taskId)
    setError('')
    try {
      await saveMyRoadmapTask(user.id, taskRole, taskId, nextCompleted)
      if (roleRef.current === taskRole) {
        setCompleted((current) => nextCompleted
          ? [...new Set([...current, taskId])]
          : current.filter((item) => item !== taskId))
      }
      return true
    } catch (saveError) {
      setError(saveError.message || 'Unable to save this task update.')
      return false
    } finally {
      setSavingTaskId(null)
    }
  }, [user?.id, targetRole, completed, savingTaskId])

  const reset = useCallback(async () => {
    if (!user?.id || !targetRole.trim() || savingTaskId) return false
    const taskRole = targetRole
    setError('')
    try {
      await deleteMyRoadmapProgress(user.id, taskRole)
      if (roleRef.current === taskRole) setCompleted([])
      return true
    } catch (resetError) {
      setError(resetError.message || 'Unable to reset roadmap progress.')
      return false
    }
  }, [user?.id, targetRole, savingTaskId])

  return useMemo(() => {
    const tasks = milestones.flatMap((milestone) => milestone.tasks)
    const doneCount = tasks.filter((task) => completed.includes(task.id)).length
    return {
      completed,
      milestones,
      toggleTask,
      reset,
      refresh,
      isDone: (id) => completed.includes(id),
      doneCount,
      totalCount: tasks.length,
      progress: tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0,
      upcoming: tasks.filter((task) => !completed.includes(task.id)),
      loading,
      error,
      savingTaskId,
    }
  }, [completed, milestones, toggleTask, reset, refresh, loading, error, savingTaskId])
}
