import { createClient } from '@supabase/supabase-js'

const env = import.meta.env ?? {}
const supabaseUrl = env.VITE_SUPABASE_URL?.trim()
const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() || env.VITE_SUPABASE_ANON_KEY?.trim()

const hasValidUrl = (() => {
  if (!supabaseUrl) return false

  try {
    const parsed = new URL(supabaseUrl)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
  } catch {
    return false
  }
})()

export const isSupabaseConfigured = Boolean(hasValidUrl && supabaseKey)

// Keep the existing frontend usable until Supabase environment variables are configured.
export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseKey) : null
