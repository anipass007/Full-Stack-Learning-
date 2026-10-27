import { BookOpen, Building2, GraduationCap, Layers, Lightbulb, ShieldCheck } from 'lucide-react'
import Section from '../../components/layout/Section'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import PageHeader from '../../components/ui/PageHeader'
import { features } from '../../data/landing'

const helps = [
  'See how a resume reads to an applicant tracking system before sending it out.',
  'Learn which skills a target role asks for and which ones are still missing.',
  'Turn a vague goal into a roadmap with small, trackable tasks.',
  'Practise interview answers and review feedback in a low-pressure setting.',
  'Find and track job applications in one list.',
]

const portals = [
  { icon: GraduationCap, title: 'Students', text: 'Improve the resume, close skill gaps, practise interviews and apply to jobs.' },
  { icon: Building2, title: 'Recruiters', text: 'Post jobs, review applicants and update application status.' },
  { icon: ShieldCheck, title: 'Admins', text: 'Review job listings and manage student or recruiter account roles.' },
]

const connected = [
  'Email/password accounts and role-protected portals',
  'Student profiles, recruiter listings and applications',
  'Saved resume-analysis results, roadmap progress and interview history',
  'Admin job moderation and role changes enforced by database policies',
  'Rule-based resume, skill-gap, roadmap and written interview feedback',
]

const notConnected = [
  'PDF storage (the My resume page is a local browser simulation)',
  'Student dashboard resume score and recommended-job sample cards',
  'User reports, account suspension/deletion, notification delivery and hiring automation',
  'Live analytics charts and platform settings',
  'Landing statistics, testimonials and sample preview content',
]

const stack = ['React', 'Vite', 'Tailwind CSS', 'React Router', 'Lucide icons']

export default function About() {
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <PageHeader
          title="About CareerAI"
          description="CareerAI is a BCA final-year project: a career development and placement platform that helps students prepare for jobs."
          badge={<Badge tone="brand">Project</Badge>}
        />
      </div>

      <Section title="Our mission" description="Make placement preparation clearer for students who do not know where to start." className="pt-4 sm:pt-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_1fr]">
          <Card>
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand-soft">
              <Lightbulb className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="text-ink-muted">
              Many students apply to jobs without knowing how their resume is read or which skills they lack. CareerAI puts resume feedback,
              skill comparison, roadmaps, mock interviews and job tracking in a single, simple workflow.
            </p>
          </Card>
          <Card>
            <h3 className="text-base font-semibold text-ink">Who uses it</h3>
            <ul className="mt-4 space-y-4">
              {portals.map((portal) => {
                const Icon = portal.icon
                return (
                  <li key={portal.title} className="flex items-start gap-3">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                    <p className="text-sm text-ink-muted">
                      <span className="font-medium text-ink">{portal.title}.</span> {portal.text}
                    </p>
                  </li>
                )
              })}
            </ul>
          </Card>
        </div>
      </Section>

      <Section tone="muted" title="What the platform offers">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand-soft">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-ink">{feature.title}</h3>
                  <p className="mt-1.5 text-sm text-ink-muted">{feature.description}</p>
                </div>
              </Card>
            )
          })}
        </div>
      </Section>

      <Section title="How it helps students">
        <Card className="max-w-3xl">
          <ul className="space-y-3">
            {helps.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-ink-muted">
                <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </Section>

      <Section
        tone="muted"
        title="What is connected"
        description="Core account, job and progress workflows use Supabase. Scoring and learning guidance are local rules, not AI model output."
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Card>
            <h3 className="text-base font-semibold text-ink">Connected workflows</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-muted">
              {connected.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h3 className="text-base font-semibold text-ink">Still using samples or not connected</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-muted">
              {notConnected.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>

      <Section title="Built with">
        <div className="flex flex-wrap items-center gap-3">
          <Layers className="h-5 w-5 text-ink-faint" aria-hidden="true" />
          {stack.map((item) => (
            <Badge key={item} tone="neutral" className="px-3 py-1 text-sm">
              {item}
            </Badge>
          ))}
        </div>
        <p className="mt-4 max-w-2xl text-sm text-ink-muted">The app uses free/open-source frontend packages and can run on provider free tiers. No paid AI API is used. The public Supabase key is configured through environment variables.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button to="/signup">Create an account</Button>
          <Button to="/student" variant="secondary">
            Explore the demo
          </Button>
        </div>
      </Section>
    </>
  )
}
