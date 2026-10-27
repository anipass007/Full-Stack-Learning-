import { ArrowRight } from 'lucide-react'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import ResumePreview from './ResumePreview'

export default function HeroSection() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto grid grid-cols-1 max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:px-8">
        <div>
          <Badge tone="brand" className="mb-5">
            Career platform for students
          </Badge>
          <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Know where your resume stands before you apply.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink-muted">
            CareerAI helps students check their resume, find skill gaps, follow a career roadmap and practise interviews, all in one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/signup" size="lg" iconRight={ArrowRight}>
              Create an account
            </Button>
            <Button to="/student" size="lg" variant="secondary">
              Explore the student portal
            </Button>
          </div>
          <p className="mt-5 text-sm text-ink-faint">Supabase handles accounts and job data. Career guidance scores use explainable local rules; landing figures are samples.</p>
        </div>
        <ResumePreview />
      </div>
    </section>
  )
}
