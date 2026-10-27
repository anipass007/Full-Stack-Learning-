import { Check } from 'lucide-react'
import Card from '../ui/Card'

const highlights = [
  'Check your resume against a sample ATS review',
  'Compare your skills with a target role',
  'Follow a roadmap and practise interviews',
]

// Two-column shell for the login and signup pages.
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="mx-auto grid grid-cols-1 max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:px-8">
      <div className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
        <Card className="mx-auto max-w-md lg:mx-0">
          <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
          <p className="mt-1.5 text-sm text-ink-muted">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </Card>
        {footer && <p className="mx-auto mt-5 max-w-md text-center text-sm text-ink-muted lg:mx-0 lg:text-left">{footer}</p>}
      </div>

      <aside className="hidden lg:block">
        <h2 className="text-xl font-semibold text-ink">One place for your placement preparation</h2>
        <ul className="mt-6 space-y-4">
          {highlights.map((item) => (
            <li key={item} className="flex items-start gap-3 text-ink-muted">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}
