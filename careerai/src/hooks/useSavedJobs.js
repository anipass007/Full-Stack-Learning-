import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

export function useSavedJobs() {
  const [savedIds, setSavedIds] = useLocalStorage('savedJobs', ['ui-engineer-pixel'])

  const toggleSaved = useCallback(
    (id) => setSavedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id])),
    [setSavedIds],
  )

  return { savedIds, isSaved: (id) => savedIds.includes(id), toggleSaved }
}
