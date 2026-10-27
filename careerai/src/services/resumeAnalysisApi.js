import { isSupabaseConfigured, supabase } from './supabase'

function requireSupabase() {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured. Add the Vite Supabase environment variables to save and load analyses.')
}

function mapAnalysis(row) {
  return {
    id: row.id,
    label: row.resume_label,
    score: row.score,
    skills: Array.isArray(row.skills) ? row.skills : [],
    result: row.result && typeof row.result === 'object' && !Array.isArray(row.result) ? row.result : {},
    createdAt: row.created_at,
  }
}

export async function listMyResumeAnalyses(studentId) {
  requireSupabase()
  const { data, error } = await supabase.from('resume_analyses')
    .select('id, resume_label, score, skills, result, created_at')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })
    .limit(20)
  if (error) throw error
  return (data ?? []).map(mapAnalysis)
}

export async function saveMyResumeAnalysis(studentId, analysis) {
  requireSupabase()
  const result = {
    overall: analysis.overall,
    subscores: analysis.subscores,
    sections: analysis.sections,
    matchedKeywords: analysis.matchedKeywords,
    missingKeywords: analysis.missingKeywords,
    issues: analysis.issues,
    strengths: analysis.strengths,
    weaknesses: analysis.weaknesses,
    suggestions: analysis.suggestions,
    targetRole: analysis.targetRole,
    contact: analysis.contact,
  }
  const { data, error } = await supabase.from('resume_analyses').insert({
    student_id: studentId,
    resume_label: 'Pasted text analysis',
    score: analysis.overall,
    skills: analysis.skills,
    result,
  }).select('id, resume_label, score, skills, result, created_at').single()
  if (error) throw error
  return mapAnalysis(data)
}
