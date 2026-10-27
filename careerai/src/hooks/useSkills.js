import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { currentSkills } from '../data/student'

export function useSkills() {
  const [skills, setSkills] = useLocalStorage('skills', currentSkills)

  const setLevel = useCallback((name, level) => setSkills((current) => ({ ...current, [name]: level })), [setSkills])
  const addSkill = useCallback((name, level) => setSkills((current) => ({ ...current, [name]: level })), [setSkills])
  const removeSkill = useCallback(
    (name) =>
      setSkills((current) => {
        const next = { ...current }
        delete next[name]
        return next
      }),
    [setSkills],
  )

  return { skills, setLevel, addSkill, removeSkill }
}
