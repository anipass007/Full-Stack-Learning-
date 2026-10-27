import { isEmail, isHttpUrl, isPhone } from './validators'

// Builds the dashboard's profile checklist from the saved profile, so edits show up there.
export function buildChecklist(profile, { hasResume, skillCount, targetRole }) {
  return [
    { id: 'details', label: 'Add personal and academic details', done: Boolean(profile.name.trim() && profile.email.trim() && profile.college.trim() && profile.course), to: '/student/profile' },
    { id: 'resume', label: 'Upload a resume', done: hasResume, to: '/student/resume' },
    { id: 'skills', label: 'List at least 3 skills', done: skillCount >= 3, to: '/student/profile' },
    { id: 'target', label: 'Choose a target role', done: Boolean(targetRole), to: '/student/profile' },
    { id: 'summary', label: 'Write a short summary', done: profile.summary.trim().length >= 20, to: '/student/profile' },
    { id: 'links', label: 'Add a GitHub or portfolio link', done: Boolean(profile.links.github.trim() || profile.links.portfolio.trim()), to: '/student/profile' },
  ]
}

export const courseOptions = ['BCA', 'MCA', 'B.Sc IT', 'B.Tech Computer Science', 'Other']
export const yearOptions = ['First year', 'Second year', 'Third year', 'Final year', 'Graduated']
export const interestOptions = [
  'Web development',
  'UI design',
  'Open source',
  'Data analysis',
  'Machine learning',
  'Cloud',
  'Mobile apps',
  'Cybersecurity',
  'Databases',
  'Testing',
]

export function validateProfile(draft) {
  const errors = {}
  if (draft.name.trim().length < 2) errors.name = 'Enter your full name.'
  if (!isEmail(draft.email)) errors.email = 'Enter a valid email address.'
  if (draft.phone.trim() && !isPhone(draft.phone)) errors.phone = 'Use digits only, for example 98765 43210.'
  if (!draft.college.trim()) errors.college = 'Enter your college name.'
  if (draft.summary.length > 300) errors.summary = 'Keep the summary under 300 characters.'
  if (draft.links.github.trim() && !isHttpUrl(draft.links.github)) errors.github = 'Start the link with http:// or https://'
  if (draft.links.portfolio.trim() && !isHttpUrl(draft.links.portfolio)) errors.portfolio = 'Start the link with http:// or https://'
  return errors
}
