import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { getMyProfile } from '../services/profileApi'
import { isSupabaseConfigured, supabase } from '../services/supabase'
import { signInWithEmail, signOutUser, signUpWithEmail } from '../services/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileError, setProfileError] = useState('')
  const revision = useRef(0)

  const loadProfile = useCallback(async (authUser, { silent = false } = {}) => {
    const current = ++revision.current
    if (!authUser) {
      setUser(null)
      setProfile(null)
      setProfileError('')
      setLoading(false)
      return null
    }
    setUser(authUser)
    setProfileError('')
    if (!silent) {
      setProfile(null)
      setLoading(true)
    }
    let result
    try {
      result = await getMyProfile(authUser.id)
    } catch (error) {
      if (current === revision.current) {
        setProfileError(error.message || 'Unable to load your account profile.')
        if (!silent) setLoading(false)
      }
      return null
    }
    if (current !== revision.current) return null
    if (result.data) setProfile(result.data)
    setProfileError(result.error?.message ?? '')
    if (!silent) setLoading(false)
    return result.data
  }, [])

  const refreshProfile = useCallback(() => user ? loadProfile(user, { silent: true }) : Promise.resolve(null), [loadProfile, user])
  const signIn = useCallback(async (credentials) => {
    const result = await signInWithEmail(credentials)
    if (result.error || !result.data.user) return result
    const loadedProfile = await loadProfile(result.data.user)
    return { ...result, profile: loadedProfile }
  }, [loadProfile])
  const signUp = useCallback((details) => signUpWithEmail(details), [])
  const signOut = useCallback(() => signOutUser(), [])

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return undefined
    }
    let active = true
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // Defer profile I/O until the auth callback has released its internal lock.
      window.setTimeout(() => { if (active) void loadProfile(session?.user ?? null) }, 0)
    })
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return
      if (error) {
        setProfileError(error.message)
        setLoading(false)
        return
      }
      void loadProfile(data.session?.user ?? null)
    }).catch((error) => {
      if (active) {
        setProfileError(error.message || 'Unable to restore your session.')
        setLoading(false)
      }
    })
    return () => {
      active = false
      subscription.unsubscribe()
      revision.current += 1
    }
  }, [loadProfile])

  const value = useMemo(() => ({
    configured: isSupabaseConfigured,
    user,
    profile,
    role: profile?.role ?? null,
    loading,
    profileError,
    refreshProfile,
    signIn,
    signUp,
    signOut,
  }), [user, profile, loading, profileError, refreshProfile, signIn, signUp, signOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>')
  return value
}
