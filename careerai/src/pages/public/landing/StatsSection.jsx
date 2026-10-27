import Section from '../../../components/layout/Section'
import { DemoBadge } from '../../../components/ui/DemoBadge'
import { stats } from '../../../data/landing'

export default function StatsSection() {
  return (
    <Section
      title="Platform at a glance"
      description="These numbers show how the dashboards will look with real activity."
      badge={<DemoBadge>Sample figures</DemoBadge>}
    >
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-line bg-surface p-6 shadow-card">
            <dd className="text-3xl font-semibold text-ink">{stat.value}</dd>
            <dt className="mt-1 text-sm text-ink-muted">{stat.label}</dt>
          </div>
        ))}
      </dl>
    </Section>
  )
}
