import Section from '../../../components/layout/Section'
import { steps } from '../../../data/landing'

export default function HowItWorksSection() {
  return (
    <Section id="how-it-works" tone="muted" title="How it works" description="Four steps, in order.">
      <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step.title} className="relative rounded-2xl border border-line bg-surface p-5 shadow-card">
            <span className="mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
              {index + 1}
            </span>
            <h3 className="text-base font-semibold text-ink">{step.title}</h3>
            <p className="mt-2 text-sm text-ink-muted">{step.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}
