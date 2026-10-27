const WEIGHTS = { critical: 3, important: 2, nice: 1 }
const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2, none: 3 }

// A skill within 5 points of the requirement counts as met.
function gapPriority({ required, current, importance }) {
  const gap = required - current
  if (gap <= 5) return 'none'
  if (importance === 'critical' && gap >= 25) return 'High'
  if (importance === 'important' && gap >= 40) return 'High'
  if (importance === 'critical') return 'Medium'
  if (importance === 'important' && gap >= 20) return 'Medium'
  return 'Low'
}

function skillStatus({ required, current }) {
  if (required - current <= 5) return 'Strong'
  if (current < 30) return 'Missing'
  return 'Developing'
}

// requirements: [{ skill, required, importance }], current: { [skill]: level }
export function computeSkillMatch(requirements, current) {
  const normalizedCurrent = Object.fromEntries(Object.entries(current ?? {}).map(([name, level]) => [name.toLowerCase(), Number(level)]))
  const rows = requirements.map((req) => {
    const level = normalizedCurrent[req.skill.toLowerCase()] ?? 0
    const row = { ...req, current: level }
    return { ...row, priority: gapPriority(row), status: skillStatus(row) }
  })
  const totalWeight = rows.reduce((sum, row) => sum + WEIGHTS[row.importance], 0)
  const earned = rows.reduce((sum, row) => sum + WEIGHTS[row.importance] * Math.min(row.current / row.required, 1), 0)
  const match = Math.round((earned / totalWeight) * 100)
  rows.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority] || b.required - b.current - (a.required - a.current))
  return { match, rows }
}
