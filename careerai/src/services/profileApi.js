import { isSupabaseConfigured, supabase } from './supabase'

export async function getMyProfile(userId) {
  if (!isSupabaseConfigured) return { data: null, error: new Error('Supabase is not configured.') }
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
  if (error) return { data: null, error }
  if (!data) return { data: null, error: new Error('Your account profile is not available yet. Ask an administrator to check profile creation.') }
  return { data, error: null }
}

// The caller can update only profile columns granted by the existing migration.
export async function updateMyProfile(userId, values) {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured.')
  const allowedFields = [
    'full_name', 'phone', 'course', 'year_of_study', 'college', 'location',
    'target_role', 'interests', 'summary', 'links', 'skills', 'preferences',
    'recruiter_title', 'company_name', 'industry', 'company_size', 'website', 'about',
  ]
  const patch = Object.fromEntries(Object.entries(values).filter(([key]) => allowedFields.includes(key)))
  const { data, error } = await supabase.from('profiles').update(patch).eq('id', userId).select('*').maybeSingle()
  if (error) throw error
  if (!data) throw new Error('Profile was not updated. Check your access and try again.')
  return data
}

export function toStudentProfile(row, authEmail = row?.email ?? '') {
  return {
    name: row?.full_name ?? '',
    email: authEmail,
    phone: row?.phone ?? '',
    course: row?.course ?? '',
    year: row?.year_of_study ?? '',
    college: row?.college ?? '',
    location: row?.location ?? '',
    targetRole: row?.target_role ?? '',
    interests: Array.isArray(row?.interests) ? row.interests : [],
    summary: row?.summary ?? '',
    links: { github: row?.links?.github ?? '', portfolio: row?.links?.portfolio ?? '' },
    skills: row?.skills && typeof row.skills === 'object' && !Array.isArray(row.skills)
      ? Object.fromEntries(Object.entries(row.skills).map(([name, level]) => [name, Number(level)]).filter(([, level]) => Number.isFinite(level)))
      : {},
    preferences: row?.preferences && typeof row.preferences === 'object' && !Array.isArray(row.preferences) ? row.preferences : {},
  }
}

export function studentProfileToRow(profile) {
  return {
    full_name: profile.name.trim(),
    phone: profile.phone.trim(),
    course: profile.course,
    year_of_study: profile.year,
    college: profile.college.trim(),
    location: profile.location.trim(),
    target_role: profile.targetRole,
    interests: profile.interests,
    summary: profile.summary.trim(),
    links: profile.links,
    skills: profile.skills,
    preferences: profile.preferences,
  }
}
