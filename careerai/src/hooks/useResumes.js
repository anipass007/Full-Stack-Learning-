import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { seedResumes } from '../data/resumes'
import { todayIso } from '../lib/format'

// Stores only resume details (name, size, date) in this browser. The files themselves are never kept.
export function useResumes() {
  const [resumes, setResumes] = useLocalStorage('resumes', seedResumes)

  const addResume = useCallback(
    ({ name, size }) => {
      const id = `r-${Date.now()}`
      setResumes((current) => {
        const hasPrimary = current.some((item) => item.primary)
        return [{ id, name, size, uploadedAt: todayIso(), primary: !hasPrimary }, ...current]
      })
      return id
    },
    [setResumes],
  )

  const removeResume = useCallback(
    (id) => {
      setResumes((current) => {
        const next = current.filter((item) => item.id !== id)
        if (next.length && !next.some((item) => item.primary)) next[0] = { ...next[0], primary: true }
        return next
      })
    },
    [setResumes],
  )

  const setPrimary = useCallback(
    (id) => setResumes((current) => current.map((item) => ({ ...item, primary: item.id === id }))),
    [setResumes],
  )

  const primaryResume = resumes.find((item) => item.primary) ?? resumes[0] ?? null

  return { resumes, primaryResume, addResume, removeResume, setPrimary }
}
