import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { listMyResumeAnalyses, saveMyResumeAnalysis } from '../services/resumeAnalysisApi'

export function useResumeAnalyses() {
  const { user } = useAuth()
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const requestId = useRef(0)

  const refresh = useCallback(async () => {
    const currentRequest = ++requestId.current
    if (!user?.id) {
      setAnalyses([])
      setError('')
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    try {
      const rows = await listMyResumeAnalyses(user.id)
      if (currentRequest === requestId.current) setAnalyses(rows)
    } catch (loadError) {
      if (currentRequest === requestId.current) setError(loadError.message || 'Unable to load saved analyses.')
    } finally {
      if (currentRequest === requestId.current) setLoading(false)
    }
  }, [user?.id])

  useEffect(() => { void refresh() }, [refresh])
  useEffect(() => () => { requestId.current += 1 }, [])

  const save = useCallback(async (analysis) => {
    if (!user?.id) throw new Error('Sign in to save this analysis.')
    const saved = await saveMyResumeAnalysis(user.id, analysis)
    setAnalyses((current) => [saved, ...current.filter((item) => item.id !== saved.id)].slice(0, 20))
    return saved
  }, [user?.id])

  return { analyses, loading, error, refresh, save }
}
