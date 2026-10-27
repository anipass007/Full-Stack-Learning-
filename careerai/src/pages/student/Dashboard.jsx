import { useMemo } from 'react'
import { ClipboardList, Map as MapIcon, ScanSearch, Target } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import StatCard from '../../components/ui/StatCard'
import { DemoBadge } from '../../components/ui/DemoBadge'
import { jobs } from '../../data/jobs'
import { getAnalysis } from '../../data/resumes'
import { computeSkillMatch } from '../../lib/skillMatch'
import { buildChecklist } from '../../lib/profile'
import { buildCareerRoadmap, normalizeSkillLevels, requirementsForRole } from '../../lib/roadmapPlan'
import { toStudentProfile } from '../../services/profileApi'
import { useAuth } from '../../context/AuthContext'
import { useResumes } from '../../hooks/useResumes'
import { useRoadmap } from '../../hooks/useRoadmap'
import { useApplications } from '../../hooks/useApplications'
import { useSavedJobs } from '../../hooks/useSavedJobs'
import ProfileCompletionCard from './dashboard/ProfileCompletionCard'
import ResumeScoreCard from './dashboard/ResumeScoreCard'
import SkillProgressCard from './dashboard/SkillProgressCard'
import RecommendedJobsCard from './dashboard/RecommendedJobsCard'
import UpcomingTasksCard from './dashboard/UpcomingTasksCard'
import RecentApplicationsCard from './dashboard/RecentApplicationsCard'
import QuickActions from './dashboard/QuickActions'

export default function Dashboard() {
  const { user, profile: profileRow } = useAuth()
  const { resumes, primaryResume } = useResumes()
  const role = profileRow?.target_role ?? ''
  const profile = toStudentProfile(profileRow, user?.email)
  const mySkills = normalizeSkillLevels(profileRow?.skills)
  const roleRequirements = requirementsForRole(role).requirements
  const skills = useMemo(() => roleRequirements.length ? computeSkillMatch(roleRequirements, mySkills) : { match: 0, rows: [] }, [roleRequirements, mySkills])
  const roadmapPlan = useMemo(() => buildCareerRoadmap(role, skills.rows), [role, skills.rows])
  const roadmap = useRoadmap(role, roadmapPlan)
  const { applications } = useApplications()
  const { isSaved, toggleSaved } = useSavedJobs()

  const analysis = useMemo(() => (primaryResume ? getAnalysis(primaryResume) : null), [primaryResume])

  const checklist = buildChecklist(profile, { hasResume: resumes.length > 0, skillCount: Object.keys(mySkills).length, targetRole: role })
  const topJobs = [...jobs].sort((a, b) => b.match - a.match).slice(0, 4)
  const recent = [...applications]
    .sort((a, b) => b.appliedOn.localeCompare(a.appliedOn))
    .slice(0, 3)
    .map((application) => ({
      application,
      job: application.job ? { ...application.job, company: { name: application.job.company } } : null,
    }))
    .filter((item) => item.job)

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${profile.name.trim().split(' ')[0] || 'there'}`}
        description="Here is where your placement preparation stands today."
        badge={<DemoBadge>Sample data</DemoBadge>}
        actions={
          <Button to="/student/resume-analysis">
            Analyse resume
          </Button>
        }
      />

      <section aria-label="Summary" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Resume score" value={analysis ? `${analysis.overall}/100` : 'None'} hint="Estimated ATS score" icon={ScanSearch} tone="brand" />
        <StatCard label="Skill match" value={`${skills.match}%`} hint={role ? `For ${role}` : 'Choose a target role'} icon={Target} tone="info" />
        <StatCard label="Applications" value={applications.length} hint="Across all jobs" icon={ClipboardList} tone="warning" />
        <StatCard label="Roadmap" value={`${roadmap.progress}%`} hint={`${roadmap.doneCount} of ${roadmap.totalCount} tasks`} icon={MapIcon} tone="success" />
      </section>

      <QuickActions />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <RecommendedJobsCard jobs={topJobs} isSaved={isSaved} onToggleSave={toggleSaved} />
          <SkillProgressCard role={role} match={skills.match} rows={skills.rows} />
        </div>
        <div className="space-y-6">
          <ProfileCompletionCard checklist={checklist} />
          <ResumeScoreCard resume={primaryResume} analysis={analysis} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <UpcomingTasksCard roadmap={roadmap} />
        <RecentApplicationsCard items={recent} />
      </div>
    </div>
  )
}
