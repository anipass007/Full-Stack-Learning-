import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Section from '../../../components/layout/Section'
import { features } from '../../../data/landing'

export default function FeaturesSection() {
  return (
    <Section
      id="features"
      title="Everything a student needs to get placement-ready"
      description="Four tools that work together, from checking your resume to practising the interview."
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Card key={feature.title} interactive className="flex flex-col">
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand-soft">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="text-base font-semibold text-ink">{feature.title}</h3>
              <p className="mt-2 flex-1 text-sm text-ink-muted">{feature.description}</p>
              <Link
                to={feature.to}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-ink"
              >
                {feature.cta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Card>
          )
        })}
      </div>
    </Section>
  )
}
