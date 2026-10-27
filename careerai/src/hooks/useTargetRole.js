import { useLocalStorage } from './useLocalStorage'
import { studentProfile } from '../data/student'
import { roleNames } from '../data/skills'

export function useTargetRole() {
  const [role, setRole] = useLocalStorage('targetRole', studentProfile.targetRole)
  const safeRole = roleNames.includes(role) ? role : roleNames[0]
  return [safeRole, setRole]
}
