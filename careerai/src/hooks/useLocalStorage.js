import { useEffect, useState } from 'react'

// Demo-only persistence. Data stays in this browser and is not a real database.
export function useLocalStorage(key, initialValue) {
  const storageKey = `careerai:${key}`

  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(storageKey)
      if (raw === null) return initialValue
      const parsed = JSON.parse(raw)
      const sameShape = parsed !== null && typeof parsed === typeof initialValue && Array.isArray(parsed) === Array.isArray(initialValue)
      return sameShape ? parsed : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value))
    } catch {
      // Storage can be unavailable (private mode, quota). The demo keeps working in memory.
    }
  }, [storageKey, value])

  return [value, setValue]
}
