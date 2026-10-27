import {
  BarChart3,
  Briefcase,
  ClipboardList,
  FileText,
  Flag,
  LayoutDashboard,
  Map as MapIcon,
  MessagesSquare,
  PlusCircle,
  ScanSearch,
  Settings,
  Target,
  UserCog,
  Users,
} from 'lucide-react'

export const studentNav = [
  {
    label: 'Overview',
    items: [{ to: '/student', label: 'Dashboard', icon: LayoutDashboard, end: true }],
  },
  {
    label: 'Resume',
    items: [
      { to: '/student/resume', label: 'My resume', icon: FileText },
      { to: '/student/resume-analysis', label: 'Resume analysis', icon: ScanSearch },
    ],
  },
  {
    label: 'Career growth',
    items: [
      { to: '/student/skill-gap', label: 'Skill gap', icon: Target },
      { to: '/student/roadmap', label: 'Career roadmap', icon: MapIcon },
      { to: '/student/mock-interview', label: 'Mock interview', icon: MessagesSquare },
    ],
  },
  {
    label: 'Jobs',
    items: [
      { to: '/student/jobs', label: 'Find jobs', icon: Briefcase },
      { to: '/student/applications', label: 'My applications', icon: ClipboardList },
    ],
  },
  {
    label: 'Account',
    items: [{ to: '/student/profile', label: 'Profile & settings', icon: Settings }],
  },
]

export const recruiterNav = [
  {
    label: 'Overview',
    items: [{ to: '/recruiter', label: 'Dashboard', icon: LayoutDashboard, end: true }],
  },
  {
    label: 'Hiring',
    items: [
      { to: '/recruiter/jobs', label: 'Manage jobs', icon: Briefcase, end: true },
      { to: '/recruiter/jobs/new', label: 'Post a job', icon: PlusCircle },
      { to: '/recruiter/applicants', label: 'Applicants', icon: Users },
    ],
  },
  {
    label: 'Account',
    items: [{ to: '/recruiter/profile', label: 'Profile & settings', icon: Settings }],
  },
]

export const adminNav = [
  {
    label: 'Overview',
    items: [{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true }],
  },
  {
    label: 'Platform',
    items: [
      { to: '/admin/users', label: 'User management', icon: UserCog },
      { to: '/admin/moderation', label: 'Moderation', icon: Flag },
      { to: '/admin/analytics', label: 'Analytics & settings', icon: BarChart3 },
    ],
  },
]

// Used by Breadcrumbs. Paths that are not listed (like /student/jobs/:jobId) show as "Details".
export const routeLabels = {
  '/student/resume': 'My resume',
  '/student/resume-analysis': 'Resume analysis',
  '/student/skill-gap': 'Skill gap',
  '/student/roadmap': 'Career roadmap',
  '/student/mock-interview': 'Mock interview',
  '/student/jobs': 'Find jobs',
  '/student/applications': 'My applications',
  '/student/profile': 'Profile & settings',
  '/recruiter/jobs': 'Manage jobs',
  '/recruiter/jobs/new': 'Post a job',
  '/recruiter/applicants': 'Applicants',
  '/recruiter/profile': 'Profile & settings',
  '/admin/users': 'User management',
  '/admin/moderation': 'Moderation',
  '/admin/analytics': 'Analytics & settings',
}

// Sample accounts shown in the top bar. They are not real users.
export const demoUsers = {
  student: { name: 'Riya Verma', email: 'riya.verma@example.com', role: 'Student' },
  recruiter: { name: 'Neha Kapoor', email: 'neha.kapoor@example.com', role: 'Recruiter' },
  admin: { name: 'Admin User', email: 'admin@example.com', role: 'Administrator' },
}

const fixedTitles = {
  '/': 'Home',
  '/login': 'Log in',
  '/signup': 'Sign up',
  '/about': 'About',
  '/student': 'Student dashboard',
  '/recruiter': 'Recruiter dashboard',
  '/admin': 'Admin dashboard',
}

export function getPageTitle(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/'
  const label = fixedTitles[path] ?? routeLabels[path] ?? (path.startsWith('/student/jobs/') ? 'Job details' : 'Page not found')
  return `${label} | CareerAI`
}
