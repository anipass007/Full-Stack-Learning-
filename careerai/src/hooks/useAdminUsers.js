import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { seedUsers } from '../data/admin'

export function useAdminUsers() {
  const [users, setUsers] = useLocalStorage('adminUsers', seedUsers)

  const setStatus = useCallback((id, status) => setUsers((current) => current.map((user) => (user.id === id ? { ...user, status } : user))), [setUsers])
  const removeUser = useCallback((id) => setUsers((current) => current.filter((user) => user.id !== id)), [setUsers])

  return { users, setStatus, removeUser }
}
