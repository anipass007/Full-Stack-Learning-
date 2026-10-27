import { currentSkills } from './student'

export const seedResumes = [
  { id: 'r-sample-2', name: 'Riya_Verma_Resume_v2.pdf', size: 219136, uploadedAt: '2026-10-05', primary: true, scoreOffset: 0, sample: true },
  { id: 'r-sample-1', name: 'Riya_Verma_Resume_v1.pdf', size: 192512, uploadedAt: '2026-09-18', primary: false, scoreOffset: -12, sample: true },
]

// Sample analysis template. Scores are shifted per resume so different files show different results.
const base = {
  subscores: { keywords: 68, content: 78, formatting: 90, structure: 84 },
  sections: [
    {
      id: 'contact',
      section: 'Contact details',
      score: 95,
      feedback: 'Email, phone and location are easy to find at the top.',
      suggestion: 'Add your GitHub or portfolio link next to your email.',
    },
    {
      id: 'summary',
      section: 'Summary',
      score: 62,
      feedback: 'The summary is generic and does not name a target role.',
      suggestion: 'Write two lines that name the role you want and one project you are proud of.',
    },
    {
      id: 'education',
      section: 'Education',
      score: 88,
      feedback: 'Course, college and years are complete and in a consistent order.',
      suggestion: 'Add relevant subjects such as DBMS and Java Programming.',
    },
    {
      id: 'skills',
      section: 'Skills',
      score: 80,
      feedback: 'Core web skills are listed, but the list is not grouped.',
      suggestion: 'Group skills into Languages, Frameworks and Tools.',
    },
    {
      id: 'projects',
      section: 'Projects',
      score: 72,
      feedback: 'Projects describe what you built but not the results.',
      suggestion: 'Add numbers such as users, load time or test coverage to each project.',
    },
    {
      id: 'experience',
      section: 'Internships and experience',
      score: 58,
      feedback: 'There is little evidence of teamwork or real-world work.',
      suggestion: 'Add internships, freelance work, open-source contributions or college events.',
    },
  ],
  missingKeywords: [
    { keyword: 'REST APIs', importance: 'High', where: 'Skills and Projects' },
    { keyword: 'Unit testing', importance: 'High', where: 'Skills and Projects' },
    { keyword: 'TypeScript', importance: 'Medium', where: 'Skills' },
    { keyword: 'Responsive design', importance: 'Medium', where: 'Projects' },
    { keyword: 'Agile', importance: 'Low', where: 'Experience' },
    { keyword: 'CI/CD', importance: 'Low', where: 'Skills' },
  ],
  issues: [
    { type: 'Content', severity: 'High', title: 'Projects lack measurable results', detail: 'Recruiters scan for numbers. Add users, speed gains or test coverage.' },
    { type: 'Content', severity: 'Medium', title: 'Summary is too generic', detail: 'Name the role you want and your strongest skill.' },
    { type: 'Formatting', severity: 'Medium', title: 'Date formats are inconsistent', detail: 'Use one style everywhere, for example "Mar 2026".' },
    { type: 'Formatting', severity: 'Low', title: 'Two fonts are mixed in the skills list', detail: 'Use a single font family for the whole document.' },
    { type: 'Content', severity: 'Low', title: 'No GitHub or portfolio link', detail: 'Add a link so recruiters can open your work.' },
  ],
  strengths: [
    'Clear section order that ATS parsers read well',
    'Relevant core web skills are listed',
    'Education details are complete',
    'Single-column layout with no tables or images',
  ],
  weaknesses: ['Few role-specific keywords', 'No measurable outcomes in projects', 'Limited experience shown'],
  suggestions: [
    { priority: 'High', action: 'Add REST API and testing keywords to your Skills and Projects sections.', why: 'These are the most common missing keywords for frontend roles.' },
    { priority: 'High', action: 'Rewrite each project with one measurable result.', why: 'Numbers make your impact easier to judge in a quick scan.' },
    { priority: 'Medium', action: 'Replace the summary with a two-line, role-specific version.', why: 'It is the first thing a recruiter reads.' },
    { priority: 'Medium', action: 'Add an internship or open-source contribution section.', why: 'It shows you can work with others on real code.' },
    { priority: 'Low', action: 'Standardise date formats and fonts.', why: 'Consistent formatting is easier for parsers to read.' },
  ],
}

function hashName(name) {
  let hash = 0
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) % 9973
  return hash
}

const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)))

export function sectionStatus(score) {
  if (score >= 80) return { label: 'Strong', tone: 'success' }
  if (score >= 65) return { label: 'Good', tone: 'info' }
  return { label: 'Needs work', tone: 'warning' }
}

export function getAnalysis(resume) {
  const offset = resume.scoreOffset ?? (hashName(resume.name) % 17) - 8
  const subscores = Object.fromEntries(Object.entries(base.subscores).map(([key, value]) => [key, clamp(value + offset)]))
  const overall = clamp(subscores.keywords * 0.35 + subscores.content * 0.3 + subscores.formatting * 0.2 + subscores.structure * 0.15)
  const sections = base.sections.map((item) => ({ ...item, score: clamp(item.score + offset) }))
  return { ...base, overall, subscores, sections, skillsOnFile: Object.keys(currentSkills).length }
}

export function verdict(score) {
  if (score >= 80) return 'Strong match for most ATS filters.'
  if (score >= 65) return 'A good base with clear gaps to fix before you apply.'
  return 'Needs work before you send this to recruiters.'
}
