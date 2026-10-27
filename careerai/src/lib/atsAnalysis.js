const MAX_RESUME_CHARS = 20000
const MAX_JOB_DESCRIPTION_CHARS = 5000
const STOP_WORDS = new Set(`about above after again against all also am an and any are as at be because been before being below between both but by can could did do does doing down during each few for from further get got had has have having he her here hers herself him himself his how i if in into is it its itself just less more most my myself no nor not of off on once only or other our ours ourselves out over own same she should so some such than that the their theirs them themselves then there these they this those through to too under until up us very was we were what when where which while who whom why will with would you your yours yourself yourselves the a it job role skill skills work experience responsibility requirements preferred candidate using use used knowledge strong ability development developing including across including`.split(/\s+/))

const SKILL_TERMS = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue', 'Angular', 'HTML', 'CSS', 'Tailwind CSS', 'Node.js', 'Express.js',
  'Python', 'Java', 'C++', 'C#', 'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Firebase', 'Supabase', 'REST API', 'GraphQL',
  'Git', 'GitHub', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud', 'CI/CD', 'Jest', 'Vitest', 'Playwright',
  'Unit testing', 'Testing', 'Figma', 'UI design', 'UX research', 'Wireframing', 'Prototyping', 'Accessibility', 'Responsive design',
  'Data analysis', 'Excel', 'Power BI', 'Tableau', 'Pandas', 'NumPy', 'Machine learning', 'Data visualization', 'Statistics',
  'Communication', 'Leadership', 'Problem solving', 'Agile', 'Scrum', 'Project management', 'SEO', 'Content writing',
]

const ROLE_SKILLS = [
  { match: /front.?end|web developer|react developer/i, terms: ['JavaScript', 'TypeScript', 'React', 'HTML', 'CSS', 'Responsive design', 'REST API', 'Git', 'Accessibility', 'Testing'] },
  { match: /back.?end|server.?side|api developer/i, terms: ['Node.js', 'Express.js', 'Java', 'Python', 'SQL', 'PostgreSQL', 'REST API', 'Docker', 'Testing', 'Git'] },
  { match: /full.?stack/i, terms: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'REST API', 'SQL', 'PostgreSQL', 'Git', 'Testing', 'Docker'] },
  { match: /data analyst|business analyst/i, terms: ['SQL', 'Excel', 'Power BI', 'Tableau', 'Python', 'Pandas', 'Statistics', 'Data analysis', 'Data visualization'] },
  { match: /machine learning|data scientist/i, terms: ['Python', 'SQL', 'Pandas', 'NumPy', 'Machine learning', 'Statistics', 'Data visualization'] },
  { match: /ui.?ux|product designer/i, terms: ['Figma', 'UI design', 'UX research', 'Wireframing', 'Prototyping', 'Accessibility', 'Communication'] },
  { match: /qa|quality assurance|software tester/i, terms: ['Testing', 'Unit testing', 'Jest', 'Playwright', 'SQL', 'Git', 'CI/CD'] },
]

const clamp = (value) => Math.max(0, Math.min(100, Math.round(value)))
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const includesTerm = (text, term) => new RegExp(`(^|[^a-z0-9+#.])${escapeRegExp(term.toLowerCase())}($|[^a-z0-9+#.])`, 'i').test(text)

function collectKeywords(targetRole, jobDescription) {
  const source = `${targetRole} ${jobDescription}`.trim()
  const roleTerms = ROLE_SKILLS.find(({ match }) => match.test(targetRole))?.terms ?? []
  const known = SKILL_TERMS.filter((term) => includesTerm(source, term))
  const words = source.toLowerCase().match(/[a-z][a-z0-9+#.]{2,}/g) ?? []
  const frequencies = new Map()
  words.forEach((word) => {
    const normalized = word.replace(/[.]$/, '')
    if (STOP_WORDS.has(normalized) || SKILL_TERMS.some((term) => term.toLowerCase() === normalized)) return
    frequencies.set(normalized, (frequencies.get(normalized) ?? 0) + 1)
  })
  const descriptionTerms = [...frequencies.entries()]
    .filter(([word, count]) => (jobDescription.toLowerCase().includes(word) && count >= 1))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 12)
    .map(([word]) => word)
  return [...new Set([...roleTerms, ...known, ...descriptionTerms])].slice(0, 24)
}

function extractSkills(text) {
  return SKILL_TERMS.filter((term) => includesTerm(text, term))
}

function analyzeSections(text) {
  const checks = [
    ['summary', 'Summary', /\b(summary|profile|objective|about me)\b/i, 'A short summary helps a reviewer see your direction quickly.', 'Add a 2–3 line summary naming your target role and strongest relevant evidence.'],
    ['education', 'Education', /\b(education|academic|qualification)\b/i, 'Education details are not clearly labelled.', 'Add an Education heading with your course, institution and graduation year.'],
    ['skills', 'Skills', /\b(skills|technical skills|core competencies)\b/i, 'A clearly labelled skills section was not found.', 'Add a Skills section with tools and technologies you can discuss confidently.'],
    ['experience', 'Experience', /\b(experience|employment|internship|work history)\b/i, 'Work or internship history is not clearly labelled.', 'Add relevant work, internship, volunteering or open-source experience.'],
    ['projects', 'Projects', /\b(projects|personal projects|academic projects)\b/i, 'A projects section was not found.', 'Add projects with your role, tools used and measurable outcomes.'],
    ['certifications', 'Certifications', /\b(certifications|certificates|courses)\b/i, 'No certifications or courses section was found.', 'Add relevant certifications or coursework if you have them.'],
  ]
  const email = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(text)
  const phoneCandidate = text.match(/(?:\+?\d[\d\s().-]{7,}\d)/)?.[0] ?? ''
  const phoneDigits = phoneCandidate.replace(/\D/g, '').length
  const phone = phoneDigits >= 10 && phoneDigits <= 15
  const professionalLink = /\b(linkedin\.com|github\.com|gitlab\.com|portfolio|https?:\/\/)/i.test(text)
  const sections = checks.map(([id, section, pattern, missingFeedback, suggestion]) => {
    const present = pattern.test(text)
    return {
      id,
      section,
      score: present ? 88 : 35,
      feedback: present ? `${section} heading detected in the supplied text.` : missingFeedback,
      suggestion,
      present,
    }
  })
  const contactScore = [email, phone, professionalLink].filter(Boolean).length
  sections.unshift({
    id: 'contact',
    section: 'Contact details',
    score: Math.round((contactScore / 3) * 100),
    feedback: `${email ? 'Email' : 'Email not found'} · ${phone ? 'Phone' : 'Phone not found'} · ${professionalLink ? 'Professional link' : 'No professional link found'}.`,
    suggestion: 'Include a reliable email, phone number and (when available) LinkedIn or portfolio link.',
    present: email && phone,
  })
  return { sections, contact: { email, phone, professionalLink } }
}

export function analyzeResumeText({ resumeText, targetRole = '', jobDescription = '' }) {
  const resume = resumeText.trim()
  const role = targetRole.trim()
  const description = jobDescription.trim()
  if (!resume) throw new Error('Paste your resume text before running an analysis.')
  if (resume.length > MAX_RESUME_CHARS) throw new Error(`Resume text must be ${MAX_RESUME_CHARS.toLocaleString()} characters or fewer.`)
  if (description.length > MAX_JOB_DESCRIPTION_CHARS) throw new Error(`Job description must be ${MAX_JOB_DESCRIPTION_CHARS.toLocaleString()} characters or fewer.`)
  if (!role && !description) throw new Error('Enter a target job role or paste a job description.')

  const keywordSet = collectKeywords(role, description)
  const matchedKeywords = keywordSet.filter((term) => includesTerm(resume, term))
  const missingKeywords = keywordSet.filter((term) => !includesTerm(resume, term)).map((keyword, index) => ({
    keyword,
    importance: index < 5 ? 'High' : index < 12 ? 'Medium' : 'Low',
    where: 'Skills, projects or relevant experience',
  }))
  const { sections, contact } = analyzeSections(resume)
  const bulletLines = resume.split(/\r?\n/).filter((line) => /^\s*(?:[-*\u2022]|\d+[.)])\s+/.test(line)).length
  const hasHeadings = sections.filter((item) => item.id !== 'contact' && item.present).length
  const keywordsScore = keywordSet.length ? clamp((matchedKeywords.length / keywordSet.length) * 100) : 55
  const contentScore = clamp((hasHeadings / 6) * 75 + (contact.email ? 10 : 0) + (contact.phone ? 10 : 0) + (bulletLines ? 5 : 0))
  const formattingScore = clamp((bulletLines >= 3 ? 35 : bulletLines ? 20 : 5) + (contact.email ? 25 : 0) + (contact.phone ? 15 : 0) + (resume.split(/\r?\n/).length >= 5 ? 25 : 10))
  const structureScore = clamp((hasHeadings / 6) * 100)
  const subscores = { keywords: keywordsScore, content: contentScore, formatting: formattingScore, structure: structureScore }
  const overall = clamp(keywordsScore * 0.35 + contentScore * 0.3 + formattingScore * 0.2 + structureScore * 0.15)
  const issues = []
  if (!contact.email) issues.push({ type: 'Content', severity: 'High', title: 'Email address not detected', detail: 'Add a clearly written email address so employers can contact you.' })
  if (!contact.phone) issues.push({ type: 'Content', severity: 'High', title: 'Phone number not detected', detail: 'Add a current phone number with country code if applying internationally.' })
  sections.filter((item) => item.id !== 'contact' && !item.present).slice(0, 4).forEach((item) => {
    issues.push({ type: 'Content', severity: item.id === 'skills' || item.id === 'education' ? 'High' : 'Medium', title: `${item.section} section not found`, detail: item.suggestion })
  })
  if (bulletLines === 0) issues.push({ type: 'Formatting', severity: 'Medium', title: 'No bullet points detected', detail: 'Use short bullet points to make responsibilities and results easier to scan.' })
  if (!contact.professionalLink) issues.push({ type: 'Content', severity: 'Low', title: 'No portfolio or professional link detected', detail: 'Add a LinkedIn, GitHub or portfolio link when relevant to your target role.' })

  const suggestions = [
    ...(missingKeywords.length ? [{ priority: 'High', action: `Review ${missingKeywords.slice(0, 3).map((item) => item.keyword).join(', ')} against your actual experience.`, why: 'These target terms were not found. Include them only where they truthfully describe your work.' }] : []),
    ...issues.slice(0, 4).map((issue) => ({ priority: issue.severity, action: issue.title, why: issue.detail })),
  ].slice(0, 6)
  const strengths = [
    ...(matchedKeywords.length ? [`${matchedKeywords.length} of ${keywordSet.length} target keywords were found.`] : []),
    ...(contact.email && contact.phone ? ['Both email and phone details were detected.'] : []),
    ...(bulletLines >= 3 ? ['Several bullet points make the text easier to scan.'] : []),
  ]
  const weaknesses = [
    ...(missingKeywords.length ? [`${missingKeywords.length} target keywords were not found.`] : []),
    ...issues.slice(0, 3).map((issue) => issue.title),
  ]

  return {
    overall,
    subscores,
    sections,
    matchedKeywords,
    missingKeywords,
    issues,
    strengths: strengths.length ? strengths : ['Your supplied text includes the core checks used in this estimate.'],
    weaknesses: weaknesses.length ? weaknesses : ['No major gaps were detected by these basic rules.'],
    suggestions: suggestions.length ? suggestions : [{ priority: 'Low', action: 'Review the resume for accuracy and clarity.', why: 'Rule-based checks cannot judge the full quality or context of your experience.' }],
    skills: extractSkills(resume),
    targetRole: role,
    contact,
  }
}

export const atsLimits = { resume: MAX_RESUME_CHARS, jobDescription: MAX_JOB_DESCRIPTION_CHARS }
