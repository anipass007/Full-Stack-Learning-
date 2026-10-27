import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { clearMyInterviewSessions, listMyInterviewSessions } from '../services/interviewApi'

function toHistoryItem(row) {
  const answers = Array.isArray(row.answers) ? row.answers : []
  const scored = answers.filter((answer) => answer.evaluation)
  const average = (key) => scored.length
    ? Math.round(scored.reduce((sum, answer) => sum + (Number(answer.evaluation[key]) || 0), 0) / scored.length)
    : 0
  return {
    id: row.id,
    role: row.target_role,
    difficulty: row.difficulty,
    category: answers[0]?.category ?? 'Technical',
    date: row.created_at,
    score: row.score,
    answered: row.answered_count,
    total: row.question_count,
    dims: { relevance: average('relevance'), depth: average('depth'), clarity: average('clarity') },
  }
}

export function useInterviewHistory() {
  const { user, configured } = useAuth()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const requestVersion = useRef(0)

  const refresh = useCallback(async () => {
    const request = ++requestVersion.current
    if (!configured) {
      setHistory([])
      setError('Connect Supabase to load and save interview history.')
      setLoading(false)
      return
    }
    if (!user?.id) {
      setHistory([])
      setError('Sign in as a student to load interview history.')
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    try {
      const rows = await listMyInterviewSessions(user.id)
      if (request === requestVersion.current) setHistory(rows.map(toHistoryItem))
    } catch (loadError) {
      if (request === requestVersion.current) setError(loadError.message || 'Could not load interview history.')
    } finally {
      if (request === requestVersion.current) setLoading(false)
    }
  }, [configured, user?.id])

  useEffect(() => {
    void refresh()
    return () => { requestVersion.current += 1 }
  }, [refresh])

  const clear = useCallback(async () => {
    if (!user?.id) throw new Error('Sign in to clear interview history.')
    requestVersion.current += 1
    await clearMyInterviewSessions(user.id)
    setHistory([])
    setError('')
    setLoading(false)
  }, [user?.id])

  return { history, loading, error, refresh, clear }
}
