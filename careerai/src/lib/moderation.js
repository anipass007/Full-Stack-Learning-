// Simple automatic checks that point a moderator at things worth reading closely.
export function computeFlags(job) {
  const flags = []
  const text = `${job.title} ${job.description}`.toLowerCase()
  if (/registration fee|security deposit|security amount|pay a fee|deposit/.test(text)) flags.push({ label: 'Asks for money', note: 'The text mentions a fee or deposit. Real employers do not charge candidates.' })
  if (/whatsapp|telegram/.test(text)) flags.push({ label: 'Off-platform contact', note: 'Candidates are told to contact the poster on a messaging app.' })
  if (job.salaryMin == null || job.salaryMax == null) flags.push({ label: 'Salary missing', note: 'No salary range was given.' })
  if (job.description.trim().length < 80) flags.push({ label: 'Short description', note: 'The description is under 80 characters.' })
  if (job.salaryUnit === 'per month' && job.salaryMax >= 40000 && job.experience === 'Fresher') flags.push({ label: 'Unusually high pay', note: 'The pay is high for a fresher role.' })
  return flags
}
