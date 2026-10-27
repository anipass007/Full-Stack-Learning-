import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Lightbulb } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card, { CardHeader } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Tabs from '../../components/ui/Tabs'
import EmptyState from '../../components/ui/EmptyState'
import { Input, Textarea } from '../../components/ui/Input'
import ScoreRing from '../../components/charts/ScoreRing'
import SkillMeter from '../../components/charts/SkillMeter'
import { roleNames, learningActions } from '../../data/skills'
import { computeSkillMatch } from '../../lib/skillMatch'
import { normalizeSkillLevels, requirementsForRole } from '../../lib/roadmapPlan'
import { useCareerRole } from '../../hooks/useCareerRole'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../hooks/useToast'

const priorityTone = { High: 'danger', Medium: 'warning', Low: 'neutral', none: 'success' }
const statusTone = { Strong: 'success', Developing: 'info', Missing: 'danger' }
const importanceLabel = { critical: 'Critical', important: 'Important', nice: 'Nice to have' }

export default function SkillGap() {
  const toast = useToast()
  const { profile } = useAuth()
  const { role, setRole, saving: savingRole, error: roleError, saveRole } = useCareerRole()
  const [customRequirements, setCustomRequirements] = useState('')
  const [filter, setFilter] = useState('all')
  const mySkills = useMemo(() => normalizeSkillLevels(profile?.skills), [profile?.skills])
  const roleDetails = useMemo(() => requirementsForRole(role, customRequirements), [role, customRequirements])
  const analysis = useMemo(() => roleDetails.requirements.length
    ? computeSkillMatch(roleDetails.requirements, mySkills)
    : { match: 0, rows: [] }, [roleDetails.requirements, mySkills])
  const { match, rows } = analysis

  const counts = {
    Strong: rows.filter((row) => row.status === 'Strong').length,
    Developing: rows.filter((row) => row.status === 'Developing').length,
    Missing: rows.filter((row) => row.status === 'Missing').length,
  }
  const tabs = [
    { id: 'all', label: 'All skills', count: rows.length },
    { id: 'Missing', label: 'Missing', count: counts.Missing },
    { id: 'Developing', label: 'Developing', count: counts.Developing },
    { id: 'Strong', label: 'Strong', count: counts.Strong },
  ]
  const visible = filter === 'all' ? rows : rows.filter((row) => row.status === filter)
  const toLearn = rows.filter((row) => row.priority !== 'none').slice(0, 4)
  const existingSkills = Object.entries(mySkills).sort((a, b) => b[1] - a[1])
  const isBuiltInRole = roleDetails.builtIn

  const persistRole = async () => {
    if (await saveRole()) toast.success('Target career role saved to your profile.')
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Skill gap analysis" description="Compare the skill levels in your profile with transparent role-specific baselines." badge={<Badge tone="info">Rule-based analysis</Badge>} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="flex flex-col gap-5">
          <div className="space-y-3">
            <Input label="Target career role" list="career-role-options" maxLength={80} placeholder="Select or enter a role" value={role} onChange={(event) => setRole(event.target.value)} />
            <datalist id="career-role-options">{roleNames.map((name) => <option key={name} value={name} />)}</datalist>
            {!isBuiltInRole && role.trim() && (
              <Textarea label="Skills required for this role" hint="Comma-separated skill names; each is assigned a 70% baseline." rows={3} maxLength={500} placeholder="For example: SQL, Excel, Reporting" value={customRequirements} onChange={(event) => setCustomRequirements(event.target.value)} />
            )}
            <Button variant="secondary" onClick={persistRole} loading={savingRole} disabled={savingRole || !role.trim()}>Save target role</Button>
            {roleError && <p role="alert" className="text-sm text-danger">{roleError}</p>}
          </div>

          {rows.length ? <>
            <div className="flex justify-center"><ScoreRing value={match} size={170} label={`Skill match for ${role}`} sublabel="skill match" /></div>
            <dl className="grid w-full grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-success/10 p-3"><dd className="text-xl font-semibold text-success">{counts.Strong}</dd><dt className="text-xs text-ink-muted">Strong</dt></div>
              <div className="rounded-xl bg-accent/10 p-3"><dd className="text-xl font-semibold text-accent">{counts.Developing}</dd><dt className="text-xs text-ink-muted">Developing</dt></div>
              <div className="rounded-xl bg-danger/10 p-3"><dd className="text-xl font-semibold text-danger">{counts.Missing}</dd><dt className="text-xs text-ink-muted">Missing</dt></div>
            </dl>
          </> : <EmptyState title={role.trim() ? 'Add role requirements' : 'Choose a target role'} description={role.trim() ? 'Enter comma-separated skills for this custom role to generate your comparison.' : 'Select one of the built-in roles or enter a custom role.'} />}
          <p className="text-xs text-ink-faint">Built-in role levels are local planning baselines, not a market-wide standard.</p>
        </Card>

        <Card>
          <CardHeader title="Your skills vs. the role" description="Current levels come from your saved student profile. The marker shows the role baseline." action={<Button to="/student/profile" variant="secondary" size="sm">Edit current skills</Button>} />
          {rows.length === 0 ? <EmptyState title="No comparison yet" description="Choose a built-in role or enter required skills for a custom role." /> : <>
            <Tabs tabs={tabs} value={filter} onChange={setFilter} label="Filter skills" className="mb-5" />
            {visible.length === 0 ? <EmptyState title="Nothing here" description="No skills fall in this group for the selected role." /> : (
              <ul className="space-y-5">
                {visible.map((row) => (
                  <li key={row.skill}>
                    <SkillMeter label={row.skill} current={row.current} required={row.required} />
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge tone={statusTone[row.status]}>{row.status}</Badge>
                      <Badge>{importanceLabel[row.importance]}</Badge>
                      {row.priority !== 'none' && <Badge tone={priorityTone[row.priority]}>{row.priority} priority</Badge>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>}
        </Card>
      </div>

      <Card>
        <CardHeader title="Your saved current skills" description="These values are read from your authenticated profile, not sample defaults." action={<Link to="/student/profile" className="text-sm font-medium text-accent hover:text-ink">Manage skills</Link>} />
        {existingSkills.length ? <div className="flex flex-wrap gap-2">{existingSkills.map(([skill, level]) => <Badge key={skill}>{skill}: {level}%</Badge>)}</div> : <p className="text-sm text-ink-muted">No skills have been saved yet. Add skills and levels in Profile & settings.</p>}
      </Card>

      <Card>
        <CardHeader title="Prioritized learning recommendations" description="Recommendations are ordered by the size and importance of each skill gap." />
        {!rows.length ? <p className="text-sm text-ink-muted">Add role requirements to see learning recommendations.</p> : toLearn.length === 0 ? (
          <p className="rounded-xl bg-success/10 p-4 text-sm text-success">Your saved levels meet these role baselines. Consider a deeper project to keep practising.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {toLearn.map((row) => (
              <li key={row.skill} className="rounded-xl border border-line bg-bg/40 p-4">
                <div className="flex items-start justify-between gap-3"><div className="flex items-center gap-2.5"><Lightbulb className="h-4 w-4 shrink-0 text-warning" aria-hidden="true" /><h3 className="text-sm font-semibold text-ink">{row.skill}</h3></div><Badge tone={priorityTone[row.priority]}>{row.priority} priority</Badge></div>
                <p className="mt-2 text-sm text-ink-muted">{learningActions[row.skill] ?? `Practise ${row.skill} with a small project.`}</p>
                <p className="mt-2 text-xs text-ink-faint">Current {row.current}%; baseline {row.required}%.</p>
              </li>
            ))}
          </ul>
        )}
        <Link to="/student/roadmap" state={{ targetRole: role, customRequirements }} className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-ink">
          Turn these into roadmap tasks <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Card>
    </div>
  )
}
