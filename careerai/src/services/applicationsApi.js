import { isSupabaseConfigured, supabase } from './supabase'

const studentStatus = {
  New: 'Applied',
  Shortlisted: 'In review',
  Interview: 'Interview',
  Hired: 'Offer',
  Rejected: 'Rejected',
  Withdrawn: 'Withdrawn',
}
const recruiterStatuses = new Set(['New', 'Shortlisted', 'Interview', 'Hired', 'Rejected'])
const applicationSelect = 'id, student_id, job_id, status, created_at, updated_at, jobs(id, title, company, location, mode, type, experience, salary_min, salary_max, salary_unit, deadline, description, responsibilities, skills, status, created_at)'

function requireSupabase() {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured. Add the Vite Supabase environment variables.')
}

function mapStudentApplication(row) {
  const status = studentStatus[row.status] ?? row.status
  const createdDate = row.created_at?.slice(0, 10) ?? ''
  const updatedDate = row.updated_at?.slice(0, 10) ?? createdDate
  const timeline = [{ status: 'Applied', date: createdDate }]
  if (status !== 'Applied') timeline.push({ status, date: updatedDate })
  const job = row.jobs ? {
    id: row.jobs.id,
    title: row.jobs.title,
    company: row.jobs.company,
  } : null
  return {
    id: row.id,
    jobId: row.job_id,
    job,
    title: job?.title ?? 'Job no longer available',
    companyName: job?.company ?? 'Listing unavailable',
    status,
    appliedOn: createdDate,
    timeline,
  }
}

function mapRecruiterApplication(row) {
  const profile = row.profiles ?? {}
  const job = row.jobs ?? {}
  const skillsObject = profile.skills && typeof profile.skills === 'object' && !Array.isArray(profile.skills) ? profile.skills : {}
  const skills = Object.entries(skillsObject).filter(([, level]) => Number(level) > 0).map(([name]) => name)
  const required = Array.isArray(job.skills) ? job.skills : []
  const matched = required.filter((skill) => skills.some((candidateSkill) => candidateSkill.toLowerCase() === skill.toLowerCase())).length
  const education = [profile.course, profile.year_of_study, profile.college].filter(Boolean).join(' Â· ')
  return {
    id: row.id,
    studentId: row.student_id,
    jobId: row.job_id,
    jobTitle: job.title ?? 'Job',
    name: profile.full_name || 'Candidate profile unavailable',
    email: profile.email ?? '',
    education,
    experience: '',
    skills,
    match: required.length ? Math.round(matched / required.length * 100) : 0,
    appliedOn: row.created_at?.slice(0, 10) ?? '',
    status: row.status,
    summary: profile.summary ?? '',
    profileAvailable: Boolean(row.profiles),
  }
}

export async function listMyApplications(studentId) {
  requireSupabase()
  const { data, error } = await supabase.from('applications').select(applicationSelect)
    .eq('student_id', studentId).order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(mapStudentApplication)
}

export async function createApplication(studentId, jobId) {
  requireSupabase()
  const { data: existing, error: lookupError } = await supabase.from('applications').select('id')
    .eq('student_id', studentId).eq('job_id', jobId).neq('status', 'Withdrawn').limit(1).maybeSingle()
  if (lookupError) throw lookupError
  if (existing) throw new Error('You have already applied to this job.')
  const { data, error } = await supabase.from('applications')
    .insert({ student_id: studentId, job_id: jobId })
    .select(applicationSelect)
    .single()
  if (error?.code === '23505') throw new Error('You have already applied to this job.')
  if (error?.code === '42501') throw new Error('This job is no longer accepting applications. Refresh the job list and try another opening.')
  if (error) throw error
  return mapStudentApplication(data)
}

export async function withdrawMyApplication(studentId, applicationId) {
  requireSupabase()
  const { data, error } = await supabase.from('applications').update({ status: 'Withdrawn' })
    .eq('id', applicationId).eq('student_id', studentId).select(applicationSelect).maybeSingle()
  if (error) throw error
  if (!data) throw new Error('This application cannot be withdrawn. It may already be closed or unavailable.')
  return mapStudentApplication(data)
}

export async function deleteMyApplication(studentId, applicationId) {
  requireSupabase()
  const { data, error } = await supabase.from('applications').delete()
    .eq('id', applicationId).eq('student_id', studentId).select('id').maybeSingle()
  if (error) throw error
  if (!data) throw new Error('This application could not be removed.')
}

export async function listRecruiterApplicants(recruiterId) {
  requireSupabase()
  const { data, error } = await supabase.from('applications')
    .select('id, student_id, job_id, status, created_at, updated_at, jobs!inner(id, recruiter_id, title, skills), profiles!applications_student_id_fkey(full_name, email, course, year_of_study, college, summary, skills)')
    .eq('jobs.recruiter_id', recruiterId)
    .neq('status', 'Withdrawn')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(mapRecruiterApplication)
}

export async function updateRecruiterApplicationStatus(applicationId, status) {
  requireSupabase()
  if (!recruiterStatuses.has(status)) throw new Error('Unsupported application status.')
  const { data, error } = await supabase.from('applications').update({ status })
    .eq('id', applicationId).select('id, status').maybeSingle()
  if (error) throw error
  if (!data) throw new Error('Application status was not updated. Check that this application belongs to one of your jobs.')
  return data
}
