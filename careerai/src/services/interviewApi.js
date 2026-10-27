import { isSupabaseConfigured, supabase } from './supabase'

function requireBackend() {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured. Add the Vite environment variables to save interview history.')
}

export async function listMyInterviewSessions(studentId) {
  requireBackend()
  const { data, error } = await supabase
    .from('interview_sessions')
    .select('id, student_id, target_role, difficulty, score, answered_count, question_count, answers, created_at')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })
    .limit(20)
  if (error) throw error
  return data ?? []
}

export async function createInterviewSession(studentId, session) {
  requireBackend()
  const { data, error } = await supabase
    .from('interview_sessions')
    .insert({
      student_id: studentId,
      target_role: session.targetRole,
      difficulty: session.difficulty,
      score: session.score,
      answered_count: session.answeredCount,
      question_count: session.questionCount,
      answers: session.answers,
    })
    .select('id, student_id, target_role, difficulty, score, answered_count, question_count, answers, created_at')
    .single()
  if (error) throw error
  return data
}

export async function clearMyInterviewSessions(studentId) {
  requireBackend()
  const { error } = await supabase.from('interview_sessions').delete().eq('student_id', studentId)
  if (error) throw error
}
