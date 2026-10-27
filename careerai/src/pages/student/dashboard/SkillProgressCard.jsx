import Card, { CardHeader } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import SkillMeter from '../../../components/charts/SkillMeter'

export default function SkillProgressCard({ role, match, rows }) {
  return (
    <Card>
      <CardHeader
        title="Skill progress"
        description={role ? `Target role: ${role}` : 'Choose a target role in your profile to see a comparison.'}
        action={role && rows.length ? <Badge tone={match >= 75 ? 'success' : 'info'}>{match}% match</Badge> : null}
      />
      {rows.length ? <div className="space-y-4">
        {rows.slice(0, 5).map((row) => (
          <SkillMeter key={row.skill} label={row.skill} current={row.current} required={row.required} />
        ))}
      </div> : <p className="text-sm text-ink-muted">No saved role requirements or skill levels are available yet.</p>}
      <Button to="/student/skill-gap" variant="secondary" size="sm" className="mt-5">
        See full skill gap
      </Button>
    </Card>
  )
}
