import { Map as MapIcon, MessagesSquare, ScanSearch, Target } from 'lucide-react'

export const features = [
  {
    icon: ScanSearch,
    title: 'Resume analysis',
    description: 'See an estimated ATS score, missing keywords and section-wise feedback for your resume.',
    to: '/student/resume-analysis',
    cta: 'View sample report',
  },
  {
    icon: Target,
    title: 'Skill gap analysis',
    description: 'Compare your skills with a target role and see which gaps to close first.',
    to: '/student/skill-gap',
    cta: 'See skill match',
  },
  {
    icon: MapIcon,
    title: 'Career roadmaps',
    description: 'Follow a milestone-based plan with learning tasks you can tick off as you go.',
    to: '/student/roadmap',
    cta: 'Open roadmap',
  },
  {
    icon: MessagesSquare,
    title: 'Mock interviews',
    description: 'Practise role-based questions, submit written answers and get structured feedback.',
    to: '/student/mock-interview',
    cta: 'Try an interview',
  },
]

export const steps = [
  { title: 'Upload your resume', description: 'Add a PDF so the platform has something to review.' },
  { title: 'Review score and gaps', description: 'Read your resume feedback and compare your skills with a target role.' },
  { title: 'Follow your roadmap', description: 'Work through learning tasks and track your progress.' },
  { title: 'Practise and apply', description: 'Run mock interviews, then apply to jobs that match your skills.' },
]

export const stats = [
  { value: '12,400', label: 'Students (sample figure)' },
  { value: '860', label: 'Recruiters (sample figure)' },
  { value: '3,200', label: 'Jobs posted (sample figure)' },
  { value: '78', label: 'Average ATS score (sample figure)' },
]

export const testimonials = [
  {
    quote: 'The skill gap view told me exactly what to learn before applying. I stopped guessing.',
    name: 'Ananya R.',
    role: 'Sample student, BCA final year',
  },
  {
    quote: 'Shortlisting is faster when candidates list their skills in the same format.',
    name: 'Karan M.',
    role: 'Sample recruiter, IT services',
  },
  {
    quote: 'Moderation tools keep the job board clean without a lot of manual checking.',
    name: 'Sample Admin',
    role: 'Placement cell coordinator',
  },
]

export const faqs = [
  {
    question: 'Does CareerAI use an AI model for resume and interview feedback?',
    answer:
      'No. Resume and interview scores use transparent, rule-based checks in your browser. They are estimates and are not guaranteed to match an employer’s ATS or interview evaluation.',
  },
  {
    question: 'Is my resume PDF uploaded?',
    answer: 'No. PDF storage is not connected. Resume analysis accepts pasted text in your browser and saves derived feedback, not the pasted resume.',
  },
  {
    question: 'Are job listings and platform statistics live?',
    answer: 'Approved job listings come from the configured database. Landing-page statistics and testimonials are illustrative sample content.',
  },
  {
    question: 'Do I need to pay for anything?',
    answer: 'No. The project uses only free, open-source tools and no paid APIs.',
  },
  {
    question: 'How do I get a recruiter or admin account?',
    answer: 'You can sign up as a student or recruiter. Admin accounts must be created and assigned by a trusted project operator; public signup cannot create admins.',
  },
  {
    question: 'Which areas are still being completed?',
    answer:
      'PDF storage, user reports, account suspension/deletion, and live analytics/settings are not connected. Existing operational features use Supabase and database access policies.',
  },
]
