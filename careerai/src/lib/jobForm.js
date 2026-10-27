import { todayIso } from './format'

export const jobTypes = ['Internship', 'Full-time', 'Part-time', 'Contract']
export const workModes = ['Remote', 'Hybrid', 'On-site']
export const experienceLevels = ['Fresher', '0-1 years', '1-2 years', '2-4 years']
export const salaryUnits = ['per month', 'LPA']

export function emptyJobDraft(profile) {
  return {
    title: '',
    company: profile.companyName,
    location: '',
    mode: profile.preferences.defaultMode,
    type: profile.preferences.defaultType,
    experience: 'Fresher',
    salaryMin: '',
    salaryMax: '',
    salaryUnit: 'per month',
    deadline: '',
    description: '',
    responsibilities: '',
    skills: '',
  }
}

export function jobToDraft(job) {
  return {
    title: job.title,
    company: job.company,
    location: job.location,
    mode: job.mode,
    type: job.type,
    experience: job.experience,
    salaryMin: job.salaryMin ?? '',
    salaryMax: job.salaryMax ?? '',
    salaryUnit: job.salaryUnit ?? 'per month',
    deadline: job.deadline ?? '',
    description: job.description,
    responsibilities: job.responsibilities.join('\n'),
    skills: job.skills.join(', '),
  }
}

const parseList = (text, separator) => [...new Set(text.split(separator).map((item) => item.trim()).filter(Boolean))]

export function draftToJob(draft) {
  return {
    title: draft.title.trim(),
    company: draft.company.trim(),
    location: draft.location.trim(),
    mode: draft.mode,
    type: draft.type,
    experience: draft.experience,
    salaryMin: draft.salaryMin === '' ? null : Number(draft.salaryMin),
    salaryMax: draft.salaryMax === '' ? null : Number(draft.salaryMax),
    salaryUnit: draft.salaryUnit,
    deadline: draft.deadline || null,
    description: draft.description.trim(),
    responsibilities: parseList(draft.responsibilities, '\n'),
    skills: parseList(draft.skills, ','),
  }
}

export function validateJob(draft) {
  const errors = {}
  if (draft.title.trim().length < 3) errors.title = 'Enter a job title of at least 3 characters.'
  if (!draft.company.trim()) errors.company = 'Enter the company name.'
  if (!draft.location.trim()) errors.location = 'Enter a location, for example "Remote" or a city.'
  if (draft.description.trim().length < 50) errors.description = `Describe the role in at least 50 characters. You have ${draft.description.trim().length}.`
  if (parseList(draft.responsibilities, '\n').length === 0) errors.responsibilities = 'Add at least one responsibility, one per line.'

  const skills = parseList(draft.skills, ',')
  if (skills.length === 0) errors.skills = 'Add at least one required skill, separated by commas.'
  else if (skills.length > 12) errors.skills = 'Use 12 skills or fewer.'

  const hasMin = draft.salaryMin !== ''
  const hasMax = draft.salaryMax !== ''
  if (hasMin !== hasMax) errors.salaryMax = 'Enter both the minimum and the maximum, or leave both empty.'
  else if (hasMin && hasMax) {
    if (Number(draft.salaryMin) < 0 || Number(draft.salaryMax) < 0) errors.salaryMax = 'Salary cannot be negative.'
    else if (Number(draft.salaryMin) > Number(draft.salaryMax)) errors.salaryMax = 'The maximum must be at least the minimum.'
  }

  if (draft.deadline && draft.deadline < todayIso()) errors.deadline = 'The deadline cannot be in the past.'
  return errors
}
