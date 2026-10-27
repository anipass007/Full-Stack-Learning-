import { mapJobRow } from './jobsApi'
import { isSupabaseConfigured, supabase } from './supabase'

function requireSupabase() {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured. Add the Vite Supabase environment variables.')
}

const jobStatus = { pending: 'Pending', approved: 'Approved', rejected: 'Rejected', closed: 'Closed' }

function mapAdminJob(row) {
  return {
    ...mapJobRow(row),
    status: jobStatus[row.status] ?? row.status,
    recruiter: row.recruiter?.full_name || 'Recruiter',
    reason: row.moderation_reason ?? '',
    decidedOn: row.updated_at?.slice(0, 10) ?? '',
  }
}

export async function listAdminJobs() {
  requireSupabase()
  const { data, error } = await supabase
    .from('jobs')
    .select('*, recruiter:profiles!jobs_recruiter_id_fkey(full_name)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(mapAdminJob)
}

export async function setAdminJobStatus(jobId, status, reason = null) {
  requireSupabase()
  const databaseStatus = Object.entries(jobStatus).find(([, label]) => label === status)?.[0]
  if (!databaseStatus) throw new Error('Unsupported moderation status.')
  const { error } = await supabase.rpc('admin_set_job_status', {
    target_job_id: jobId,
    new_status: databaseStatus,
    reason,
  })
  if (error) throw error
}

export async function listAdminProfiles() {
  requireSupabase()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, course, company_name, created_at')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.full_name || 'Unnamed user',
    email: row.email,
    role: row.role.charAt(0).toUpperCase() + row.role.slice(1),
    joinedOn: row.created_at?.slice(0, 10) ?? '',
    detail: row.role === 'recruiter' ? row.company_name : row.course,
  }))
}

export async function updateAdminProfileRole(userId, role) {
  requireSupabase()
  if (!['student', 'recruiter'].includes(role)) throw new Error('Choose Student or Recruiter. Admin roles require trusted provisioning.')
  const { error } = await supabase.rpc('admin_set_profile_role', { target_user_id: userId, new_role: role })
  if (error) throw error
}

export async function getAdminDashboardData() {
  requireSupabase()
  const [students, recruiters, jobsCount, applications, recent, pendingJobs] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'student'),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'recruiter'),
    supabase.from('jobs').select('id', { count: 'exact', head: true }),
    supabase.from('applications').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('id, full_name, email, role, course, company_name, created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('jobs').select('*, recruiter:profiles!jobs_recruiter_id_fkey(full_name)').eq('status', 'pending').order('created_at', { ascending: false }).limit(5),
  ])
  const failed = [students, recruiters, jobsCount, applications, recent, pendingJobs].find((result) => result.error)
  if (failed) throw failed.error
  return {
    counts: { students: students.count ?? 0, recruiters: recruiters.count ?? 0, jobs: jobsCount.count ?? 0, applications: applications.count ?? 0 },
    recent: (recent.data ?? []).map((row) => ({
      id: row.id,
      name: row.full_name || 'Unnamed user',
      role: row.role.charAt(0).toUpperCase() + row.role.slice(1),
      joinedOn: row.created_at?.slice(0, 10) ?? '',
    })),
    pendingJobs: (pendingJobs.data ?? []).map(mapAdminJob),
  }
}
