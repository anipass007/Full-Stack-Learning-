import { formatDate, formatSalary, todayIso } from '../lib/format'
import { isSupabaseConfigured, supabase } from './supabase'

const statusFromDb = { pending: 'Pending review', approved: 'Active', rejected: 'Rejected', closed: 'Closed' }
const statusToDb = { 'Pending review': 'pending', Active: 'approved', Rejected: 'rejected', Closed: 'closed' }

export function mapJobRow(row) {
  const salaryMin = row.salary_min == null ? null : Number(row.salary_min)
  const salaryMax = row.salary_max == null ? null : Number(row.salary_max)
  const postedOn = row.created_at?.slice(0, 10) ?? ''
  return {
    id: row.id,
    recruiterId: row.recruiter_id,
    title: row.title,
    company: row.company,
    companyName: row.company,
    companyInfo: { name: row.company, industry: '', size: '', about: '' },
    location: row.location,
    mode: row.mode,
    type: row.type,
    experience: row.experience,
    salaryMin,
    salaryMax,
    salaryUnit: row.salary_unit,
    salary: formatSalary({ salaryMin, salaryMax, salaryUnit: row.salary_unit }),
    deadline: row.deadline,
    description: row.description,
    responsibilities: row.responsibilities ?? [],
    requirements: row.skills ?? [],
    skills: row.skills ?? [],
    status: statusFromDb[row.status] ?? 'Pending review',
    rejectionReason: row.moderation_reason ?? '',
    postedOn,
    posted: postedOn ? formatDate(postedOn) : '',
    applicantCount: row.applications?.[0]?.count ?? 0,
    openings: null,
    match: null,
  }
}

function toJobRow(values) {
  return {
    title: values.title,
    company: values.company,
    location: values.location,
    mode: values.mode,
    type: values.type,
    experience: values.experience,
    salary_min: values.salaryMin,
    salary_max: values.salaryMax,
    salary_unit: values.salaryUnit,
    deadline: values.deadline,
    description: values.description,
    responsibilities: values.responsibilities,
    skills: values.skills,
  }
}

function requireSupabase() {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured. Add the Vite Supabase environment variables.')
}

export async function listMyJobs(recruiterId) {
  requireSupabase()
  const { data, error } = await supabase
    .from('jobs')
    .select('*, applications(count)')
    .eq('recruiter_id', recruiterId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(mapJobRow)
}

export async function createMyJob(recruiterId, values) {
  requireSupabase()
  const { data, error } = await supabase
    .from('jobs')
    .insert({ ...toJobRow(values), recruiter_id: recruiterId })
    .select('*')
    .single()
  if (error) throw error
  return mapJobRow(data)
}

export async function updateMyJob(recruiterId, jobId, values) {
  requireSupabase()
  const { data, error } = await supabase
    .from('jobs')
    .update(toJobRow(values))
    .eq('id', jobId)
    .eq('recruiter_id', recruiterId)
    .select('*')
    .maybeSingle()
  if (error) throw error
  if (!data) throw new Error('Job was not updated. It may no longer be available to your account.')
  return mapJobRow(data)
}

export async function deleteMyJob(recruiterId, jobId) {
  requireSupabase()
  const { data, error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', jobId)
    .eq('recruiter_id', recruiterId)
    .select('id')
    .maybeSingle()
  if (error) throw error
  if (!data) throw new Error('Job was not deleted. It may no longer be available to your account.')
}

export async function transitionMyJob(recruiterId, jobId, status) {
  requireSupabase()
  const databaseStatus = statusToDb[status]
  if (!databaseStatus) throw new Error('Unsupported job status.')
  const { error } = await supabase.rpc('recruiter_transition_job', { target_job_id: jobId, new_status: databaseStatus })
  if (error) throw error
  const { data, error: readError } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .eq('recruiter_id', recruiterId)
    .maybeSingle()
  if (readError) throw readError
  if (!data) throw new Error('Job status was changed, but the updated job could not be loaded.')
  return mapJobRow(data)
}

export async function listApprovedJobs() {
  requireSupabase()
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'approved')
    .or(`deadline.is.null,deadline.gte.${todayIso()}`)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(mapJobRow)
}

export async function getApprovedJob(jobId) {
  requireSupabase()
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .eq('status', 'approved')
    .or(`deadline.is.null,deadline.gte.${todayIso()}`)
    .maybeSingle()
  if (error) throw error
  return data ? mapJobRow(data) : null
}

