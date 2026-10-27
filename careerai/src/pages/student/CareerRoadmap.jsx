import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { RotateCcw } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Tabs from '../../components/ui/Tabs'
import ProgressBar from '../../components/ui/ProgressBar'
import EmptyState from '../../components/ui/EmptyState'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'
import { Input, Textarea } from '../../components/ui/Input'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { useCareerRole } from '../../hooks/useCareerRole'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../hooks/useToast'
import { requirementsForRole, normalizeSkillLevels, buildCareerRoadmap } from '../../lib/roadmapPlan'
import { computeSkillMatch } from '../../lib/skillMatch'
import { roleNames } from '../../data/skills'
import { useRoadmap } from '../../hooks/useRoadmap'
import MilestoneCard from './roadmap/MilestoneCard'

export default function CareerRoadmap() {
  const toast = useToast()
  const location = useLocation()
  const { profile } = useAuth()
  const { role, setRole, saving: savingRole, error: roleError, saveRole } = useCareerRole()
  const [customRequirements, setCustomRequirements] = useState(location.state?.customRequirements ?? '')
  const [filter, setFilter] = useState('all')
  const [resetOpen, setResetOpen] = useState(false)
  const mySkills = useMemo(() => normalizeSkillLevels(profile?.skills), [profile?.skills])

  useEffect(() => {
    if (location.state?.targetRole) setRole(location.state.targetRole)
    if (location.state?.customRequirements) setCustomRequirements(location.state.customRequirements)
  }, [location.state, setRole])

  const roleDetails = useMemo(() => requirementsForRole(role, customRequirements), [role, customRequirements])
  const skillRows = useMemo(() => roleDetails.requirements.length
    ? computeSkillMatch(roleDetails.requirements, mySkills).rows
    : [], [roleDetails.requirements, mySkills])
  const milestones = useMemo(() => buildCareerRoadmap(role, skillRows), [role, skillRows])
  const roadmap = useRoadmap(role, milestones)

  const currentIndex = milestones.findIndex((milestone) => milestone.tasks.some((task) => !roadmap.isDone(task.id)))
  const statusOfTask = (task, milestoneIndex) => {
    if (roadmap.isDone(task.id)) return 'Completed'
    return milestoneIndex === currentIndex ? 'Pending' : 'Upcoming'
  }
  const statusOfMilestone = (milestone, milestoneIndex) => {
    if (milestone.tasks.every((task) => roadmap.isDone(task.id))) return 'Completed'
    return milestoneIndex === currentIndex ? 'In progress' : 'Upcoming'
  }
  const entries = milestones.map((milestone, index) => ({
    milestone,
    index,
    status: statusOfMilestone(milestone, index),
    tasks: milestone.tasks.map((task) => ({ task, status: statusOfTask(task, index) })),
  }))
  const counts = { Completed: 0, Pending: 0, Upcoming: 0 }
  entries.forEach((entry) => entry.tasks.forEach((item) => { counts[item.status] += 1 }))
  const tabs = [
    { id: 'all', label: 'All tasks', count: roadmap.totalCount },
    { id: 'Pending', label: 'Pending', count: counts.Pending },
    { id: 'Upcoming', label: 'Upcoming', count: counts.Upcoming },
    { id: 'Completed', label: 'Completed', count: counts.Completed },
  ]
  const visible = entries
    .map((entry) => ({ ...entry, tasks: filter === 'all' ? entry.tasks : entry.tasks.filter((item) => item.status === filter) }))
    .filter((entry) => entry.tasks.length > 0)

  const persistRole = async () => {
    if (await saveRole()) toast.success('Target career role saved to your profile.')
  }
  const handleToggle = async (task) => {
    const wasDone = roadmap.isDone(task.id)
    if (await roadmap.toggleTask(task.id)) toast.success(wasDone ? `Reopened: ${task.title}` : `Completed: ${task.title}`)
  }
  const handleReset = async () => {
    if (await roadmap.reset()) {
      setResetOpen(false)
      toast.info('Saved progress for this role was cleared.')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Career roadmap"
        description={role ? `A rule-based learning plan for ${role}. Mark tasks complete as you finish them.` : 'Choose a target role to create a practical learning plan.'}
        badge={<Badge tone="info">Rule-based plan</Badge>}
        actions={<Button variant="secondary" icon={RotateCcw} onClick={() => setResetOpen(true)} disabled={!role.trim() || roadmap.loading || roadmap.totalCount === 0}>Reset progress</Button>}
      />

      <Card>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <div>
            <Input label="Target career role" list="roadmap-role-options" maxLength={80} placeholder="Select or enter a role" value={role} onChange={(event) => setRole(event.target.value)} />
            <datalist id="roadmap-role-options">{roleNames.map((name) => <option key={name} value={name} />)}</datalist>
          </div>
          {!roleDetails.builtIn && role.trim() ? (
            <Textarea label="Skills required for this role" hint="Comma-separated skill names; each uses a 70% baseline. Re-enter this list after a reload to restore this custom plan." rows={2} maxLength={500} value={customRequirements} onChange={(event) => setCustomRequirements(event.target.value)} placeholder="For example: SQL, Excel, Reporting" />
          ) : <p className="text-sm text-ink-muted">Built-in roles use the local baseline skill requirements.</p>}
          <Button variant="secondary" onClick={persistRole} loading={savingRole} disabled={savingRole || !role.trim()}>Save target role</Button>
        </div>
        {roleError && <p role="alert" className="mt-3 text-sm text-danger">{roleError}</p>}
      </Card>

      {roadmap.error && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-danger/25 bg-danger/10 p-4" role="alert">
          <p className="text-sm text-danger">{roadmap.error}</p>
          <Button variant="secondary" size="sm" onClick={roadmap.refresh}>Try again</Button>
        </div>
      )}

      <Card>
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="text-base font-semibold text-ink">Overall progress</h2>
            <p className="mt-1 text-sm text-ink-muted">
              {roadmap.doneCount} of {roadmap.totalCount} tasks done.{' '}
              <Link to="/student/skill-gap" className="font-medium text-accent hover:text-ink">Review the skill gaps behind this plan</Link>
            </p>
            <ProgressBar className="mt-4" value={roadmap.progress} showValue tone="success" label="Roadmap complete" />
          </div>
          <dl className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-success/10 px-4 py-3"><dd className="text-xl font-semibold text-success">{counts.Completed}</dd><dt className="text-xs text-ink-muted">Completed</dt></div>
            <div className="rounded-xl bg-warning/10 px-4 py-3"><dd className="text-xl font-semibold text-warning">{counts.Pending}</dd><dt className="text-xs text-ink-muted">Pending</dt></div>
            <div className="rounded-xl bg-white/5 px-4 py-3"><dd className="text-xl font-semibold text-ink">{counts.Upcoming}</dd><dt className="text-xs text-ink-muted">Upcoming</dt></div>
          </dl>
        </div>
      </Card>

      {roadmap.loading ? <div className="space-y-4" role="status" aria-label="Loading roadmap progress"><Skeleton className="h-40 rounded-2xl" /><Skeleton className="h-40 rounded-2xl" /></div> : !role.trim() ? (
        <EmptyState title="Choose your target role" description="Select a built-in role or enter a custom role to generate a learning roadmap." />
      ) : milestones.length === 0 ? (
        <EmptyState title="Add role skill requirements" description="Choose a built-in role or enter comma-separated skills for your custom role." />
      ) : visible.length === 0 ? (
        <div className="space-y-4">
          <Tabs tabs={tabs} value={filter} onChange={setFilter} label="Filter tasks" />
          <EmptyState title="No tasks here" description="Nothing matches this filter right now." action={<Button onClick={() => setFilter('all')}>Show all tasks</Button>} />
        </div>
      ) : (
        <>
          <Tabs tabs={tabs} value={filter} onChange={setFilter} label="Filter tasks" />
          <ol className="relative space-y-5 before:absolute before:bottom-6 before:left-4 before:top-6 before:w-px before:bg-line">
            {visible.map((entry) => (
              <MilestoneCard
                key={entry.milestone.id}
                milestone={entry.milestone}
                index={entry.index}
                status={entry.status}
                tasks={entry.tasks}
                doneCount={entry.milestone.tasks.filter((task) => roadmap.isDone(task.id)).length}
                onToggle={handleToggle}
                savingTaskId={roadmap.savingTaskId}
                disabled={roadmap.loading || Boolean(roadmap.error)}
              />
            ))}
          </ol>
        </>
      )}

      <ConfirmDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={handleReset}
        title="Reset roadmap progress?"
        description={`Saved task progress for ${role || 'this role'} will be cleared.`}
        confirmLabel="Reset progress"
      />
    </div>
  )
}
