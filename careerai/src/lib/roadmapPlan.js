import { learningActions, targetRoles } from '../data/skills'

const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48)
const stableSuffix = (value) => [...value.toLowerCase()].reduce((hash, char) => ((hash * 31) + char.charCodeAt(0)) >>> 0, 7).toString(36)

export function normalizeSkillLevels(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return Object.fromEntries(Object.entries(value)
    .filter(([name, level]) => name.trim() && Number.isFinite(Number(level)))
    .map(([name, level]) => [name.trim(), Math.max(0, Math.min(100, Number(level)))]))
}

export function requirementsForRole(role, customSkills = '') {
  const builtInName = Object.keys(targetRoles).find((name) => name.toLowerCase() === role.trim().toLowerCase())
  if (builtInName) return { roleName: builtInName, requirements: targetRoles[builtInName], builtIn: true }
  const seen = new Set()
  const requirements = customSkills.split(',').map((skill) => skill.trim()).filter((skill) => {
    const key = skill.toLowerCase()
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
    .slice(0, 12)
    .map((skill, index) => ({ skill, required: 70, importance: index < 3 ? 'critical' : 'important' }))
  return { roleName: role.trim(), requirements, builtIn: false }
}

export function buildCareerRoadmap(role, skillRows) {
  if (!role.trim() || skillRows.length === 0) return []
  const gaps = skillRows.filter((row) => row.priority !== 'none')
  const selected = (gaps.length ? gaps : skillRows.slice(0, 3)).slice(0, 9)
  const groups = [selected.slice(0, 3), selected.slice(3, 6), selected.slice(6, 9)].filter((group) => group.length)
  const titles = gaps.length
    ? ['Close the highest-priority gaps', 'Practise through small projects', 'Demonstrate your skills']
    : ['Maintain core skills', 'Build a practical project', 'Review and demonstrate your work']
  const descriptions = [
    'Start with the most important areas where your current level is below the role target.',
    'Apply the skills in short, practical exercises and projects.',
    'Review what you built and make the result easy to show and explain.',
  ]
  return groups.map((group, index) => ({
    id: `${slug(role)}-milestone-${index + 1}`,
    title: titles[index],
    description: descriptions[index],
    tasks: group.map((row, taskIndex) => ({
      id: `${slug(role)}--${slug(row.skill)}-${stableSuffix(row.skill)}`,
      skill: row.skill,
      title: `Practise ${row.skill} with a focused exercise`,
      action: learningActions[row.skill] ?? `Choose a small ${row.skill} task, complete it, then write down what you learned.`,
      estimate: 'About 2-4 hours',
      due: `Week ${index * 3 + taskIndex + 1}`,
    })),
  }))
}
