import { Briefcase, ClipboardList, TrendingUp, Users } from 'lucide-react'
import Card, { CardHeader } from '../../../components/ui/Card'
import StatCard from '../../../components/ui/StatCard'
import ProgressBar from '../../../components/ui/ProgressBar'
import LineChart from '../../../components/charts/LineChart'
import MiniBarChart from '../../../components/charts/MiniBarChart'
import { analytics, platformTotals } from '../../../data/admin'

const fmt = (value) => value.toLocaleString('en-IN')
const last = (list) => list[list.length - 1]

export default function AnalyticsTab() {
  const totalUsers = last(analytics.students) + last(analytics.recruiters)
  const previousUsers = analytics.students[analytics.students.length - 2] + analytics.recruiters[analytics.recruiters.length - 2]
  const newUsers = totalUsers - previousUsers
  const statusTotal = analytics.applicationsByStatus.reduce((sum, item) => sum + item.value, 0)
  const maxJobs = Math.max(...analytics.jobsPerMonth.map((item) => item.value))

  return (
    <div className="space-y-6">
      <section aria-label="Key numbers" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total users" value={fmt(totalUsers)} hint="Students and recruiters" icon={Users} tone="brand" />
        <StatCard label="New users this month" value={fmt(newUsers)} hint={`${((newUsers / previousUsers) * 100).toFixed(1)}% growth`} icon={TrendingUp} tone="success" />
        <StatCard label="Jobs posted this month" value={fmt(last(analytics.jobsPerMonth).value)} hint={`${fmt(platformTotals.jobs)} in total`} icon={Briefcase} tone="info" />
        <StatCard label="Applications in total" value={fmt(platformTotals.applications)} hint="All statuses" icon={ClipboardList} tone="warning" />
      </section>

      <Card>
        <CardHeader title="User growth" description="Registered students and recruiters over the last 12 months." />
        <LineChart
          label="User growth over 12 months"
          labels={analytics.months}
          series={[
            { name: 'Students', color: '#60A5FA', values: analytics.students },
            { name: 'Recruiters', color: '#8B5CF6', values: analytics.recruiters },
          ]}
        />
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Jobs posted per month" description="New job posts over the last 6 months." />
          <MiniBarChart label="Jobs posted per month" data={analytics.jobsPerMonth} max={maxJobs} />
        </Card>
        <Card>
          <CardHeader title="Applications by status" description={`${fmt(statusTotal)} applications in total.`} />
          <ul className="space-y-4">
            {analytics.applicationsByStatus.map((item) => (
              <li key={item.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-ink-muted">{item.label}</span>
                  <span className="font-medium text-ink">
                    {fmt(item.value)} <span className="font-normal text-ink-faint">({Math.round((item.value / statusTotal) * 100)}%)</span>
                  </span>
                </div>
                <ProgressBar value={Math.round((item.value / statusTotal) * 100)} size="sm" label={`${item.label} share`} className="[&>div:first-child]:hidden" />
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <CardHeader title="Platform activity" description="Who was active on the platform in the last 7 days." />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {analytics.activeShare.map((item) => (
            <ProgressBar key={item.label} label={item.label} value={item.value} showValue tone={item.label === 'Students' ? 'info' : item.label === 'Recruiters' ? 'brand' : 'warning'} />
          ))}
        </div>
      </Card>
    </div>
  )
}
