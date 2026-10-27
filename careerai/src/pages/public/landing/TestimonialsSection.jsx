import { Quote } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Avatar from '../../../components/ui/Avatar'
import Section from '../../../components/layout/Section'
import { DemoBadge } from '../../../components/ui/DemoBadge'
import { testimonials } from '../../../data/landing'

export default function TestimonialsSection() {
  return (
    <Section
      tone="muted"
      title="What users could say"
      description="Written as examples of the feedback the platform is designed to earn."
      badge={<DemoBadge>Sample content</DemoBadge>}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {testimonials.map((item) => (
          <Card key={item.name} as="figure" className="flex flex-col">
            <Quote className="h-5 w-5 text-brand-soft" aria-hidden="true" />
            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink">{item.quote}</blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
              <Avatar name={item.name} size="sm" />
              <div>
                <p className="text-sm font-medium text-ink">{item.name}</p>
                <p className="text-xs text-ink-faint">{item.role}</p>
              </div>
            </figcaption>
          </Card>
        ))}
      </div>
    </Section>
  )
}
