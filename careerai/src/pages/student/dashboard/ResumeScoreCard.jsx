import { FileUp } from 'lucide-react'
import Card, { CardHeader } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import ScoreRing from '../../../components/charts/ScoreRing'
import { verdict } from '../../../data/resumes'

export default function ResumeScoreCard({ resume, analysis }) {
  if (!resume) {
    return (
      <Card>
        <CardHeader title="Resume score" />
        <EmptyState
          icon={FileUp}
          title="No resume yet"
          description="Upload a PDF to see an estimated ATS score."
          action={<Button to="/student/resume">Upload resume</Button>}
        />
      </Card>
    )
  }

  return (
    <Card className="flex flex-col">
      <CardHeader title="Resume score" description={resume.name} />
      <div className="flex flex-1 flex-col items-center gap-4 text-center">
        <ScoreRing value={analysis.overall} label="Estimated ATS score" sublabel="ATS score" />
        <p className="text-sm text-ink-muted">{verdict(analysis.overall)}</p>
        <Button to="/student/resume-analysis" variant="secondary" size="sm">
          View full analysis
        </Button>
      </div>
    </Card>
  )
}
