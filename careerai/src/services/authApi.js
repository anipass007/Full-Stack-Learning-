import { isSupabaseConfigured, supabase } from './supabase'

export async function signUpWithEmail({ email, password, fullName, role }) {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured. Add the Vite Supabase URL and publishable key.')
  if (!['student', 'recruiter'].includes(role)) throw new Error('Choose a valid account type.')
  return supabase.auth.signUp({
    email: email.trim(),
    password,
    options: { data: { full_name: fullName.trim(), requested_role: role } },
  })
}

export async function signInWithEmail({ email, password }) {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured. Add the Vite Supabase URL and publishable key.')
  return supabase.auth.signInWithPassword({ email: email.trim(), password })
}

export async function signOutUser() {
  if (!isSupabaseConfigured) return { error: null }
  return supabase.auth.signOut()
}

export async function sendPasswordReset(email) {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured. Add the Vite Supabase URL and publishable key.')
  return supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` })
}

export async function updatePassword(password) {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured. Add the Vite Supabase URL and publishable key.')
  return supabase.auth.updateUser({ password })
}
