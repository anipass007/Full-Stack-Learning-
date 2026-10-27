import { isSupabaseConfigured, supabase } from './supabase'

function requireSupabase() {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured. Add the Vite Supabase environment variables to save roadmap progress.')
}

export async function listMyRoadmapProgress(studentId, targetRole) {
  requireSupabase()
  const { data, error } = await supabase.from('roadmap_progress')
    .select('id, student_id, target_role, task_id, completed, updated_at')
    .eq('student_id', studentId)
    .eq('target_role', targetRole)
  if (error) throw error
  return data ?? []
}

export async function saveMyRoadmapTask(studentId, targetRole, taskId, completed) {
  requireSupabase()
  const { data: existing, error: lookupError } = await supabase.from('roadmap_progress').select('id')
    .eq('student_id', studentId).eq('target_role', targetRole).eq('task_id', taskId).maybeSingle()
  if (lookupError) throw lookupError

  if (existing) {
    const { data, error } = await supabase.from('roadmap_progress').update({ completed })
      .eq('id', existing.id).eq('student_id', studentId).eq('target_role', targetRole).eq('task_id', taskId)
      .select('id, task_id, completed').single()
    if (error) throw error
    return data
  }

  const { data, error } = await supabase.from('roadmap_progress').insert({
    student_id: studentId,
    target_role: targetRole,
    task_id: taskId,
    completed,
  }).select('id, task_id, completed').single()
  if (error?.code === '23505') {
    const { data: updated, error: updateError } = await supabase.from('roadmap_progress').update({ completed })
      .eq('student_id', studentId).eq('target_role', targetRole).eq('task_id', taskId)
      .select('id, task_id, completed').single()
    if (updateError) throw updateError
    return updated
  }
  if (error) throw error
  return data
}

export async function deleteMyRoadmapProgress(studentId, targetRole) {
  requireSupabase()
  const { error } = await supabase.from('roadmap_progress').delete()
    .eq('student_id', studentId).eq('target_role', targetRole)
  if (error) throw error
}
