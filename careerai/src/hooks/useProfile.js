import { useLocalStorage } from './useLocalStorage'
import { studentProfile } from '../data/student'

// The target role is stored separately (see useTargetRole) so every page reads one source.
const { targetRole: _unused, ...defaultProfile } = studentProfile

export function useProfile() {
  const [stored, setProfile] = useLocalStorage('profile', defaultProfile)
  // Merge with defaults so older saved data never leaves a field undefined.
  const profile = { ...defaultProfile, ...stored, links: { ...defaultProfile.links, ...(stored.links ?? {}) } }
  return [profile, setProfile]
}
