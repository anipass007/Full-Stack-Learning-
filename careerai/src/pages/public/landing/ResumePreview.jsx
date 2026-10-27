import Card from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import { DemoBadge } from '../../../components/ui/DemoBadge'
import ProgressBar from '../../../components/ui/ProgressBar'
import ScoreRing from '../../../components/charts/ScoreRing'

// A small, static look at the resume report so visitors see the product right away.
export default function ResumePreview() {
  return (
    <Card className="w-full max-w-md justify-self-center lg:justify-self-end" aria-label="Sample resume report">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-ink">Resume report</h2>
        <DemoBadge>Sample report</DemoBadge>
      </div>

      <div className="flex items-center gap-5">
        <ScoreRing value={78} size={120} strokeWidth={10} label="Sample ATS score" sublabel="ATS score" />
        <div className="min-w-0 flex-1 space-y-3">
          <ProgressBar value={85} label="Skills" showValue tone="success" size="sm" />
          <ProgressBar value={70} label="Projects" showValue size="sm" />
          <ProgressBar value={62} label="Keywords" showValue tone="warning" size="sm" />
        </div>
      </div>

      <div className="mt-6 border-t border-line pt-5">
        <p className="text-sm font-medium text-ink">Missing keywords</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge tone="warning">REST APIs</Badge>
          <Badge tone="warning">Unit testing</Badge>
          <Badge tone="warning">Git workflow</Badge>
        </div>
        <p className="mt-4 text-sm text-ink-muted">Add a project that shows how you built and tested an API.</p>
      </div>
    </Card>
  )
}
