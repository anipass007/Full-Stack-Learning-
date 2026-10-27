import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Card, { CardHeader } from '../../../components/ui/Card'
import { DemoBadge } from '../../../components/ui/DemoBadge'
import JobCard from '../../../components/jobs/JobCard'

export default function RecommendedJobsCard({ jobs, isSaved, onToggleSave }) {
  return (
    <Card>
      <CardHeader
        title="Recommended jobs"
        description="Sorted by how well they match your skills."
        action={<DemoBadge>Sample jobs</DemoBadge>}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} compact saved={isSaved(job.id)} onToggleSave={onToggleSave} />
        ))}
      </div>
      <Link to="/student/jobs" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-ink">
        Browse all jobs
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </Card>
  )
}
