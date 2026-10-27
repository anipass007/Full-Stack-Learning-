import { useCallback, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { updateMyProfile } from '../services/profileApi'
import { recruiterDefaults } from '../data/recruiter'

export function useRecruiterProfile() {
  const { user, profile: row, refreshProfile } = useAuth()
  const profile = useMemo(() => ({
    recruiterName: row?.full_name ?? '',
    email: user?.email ?? row?.email ?? '',
    phone: row?.phone ?? '',
    jobTitle: row?.recruiter_title ?? '',
    companyName: row?.company_name ?? '',
    industry: row?.industry ?? '',
    companySize: row?.company_size ?? '',
    website: row?.website ?? '',
    location: row?.location ?? '',
    about: row?.about ?? '',
    preferences: { ...recruiterDefaults.preferences, ...(row?.preferences ?? {}) },
  }), [row, user?.email])

  const saveProfile = useCallback(async (next) => {
    if (!user?.id) throw new Error('Sign in to update your recruiter profile.')
    await updateMyProfile(user.id, {
      full_name: next.recruiterName,
      phone: next.phone,
      recruiter_title: next.jobTitle,
      company_name: next.companyName,
      industry: next.industry,
      company_size: next.companySize,
      website: next.website,
      location: next.location,
      about: next.about,
      preferences: next.preferences,
    })
    await refreshProfile()
  }, [user?.id, refreshProfile])

  return [profile, saveProfile]
}
