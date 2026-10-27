import { useEffect, useMemo, useState } from 'react'
import { Bookmark, Search, SearchX } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Tabs from '../../components/ui/Tabs'
import Skeleton from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'
import { Input, Select } from '../../components/ui/Input'
import JobCard from '../../components/jobs/JobCard'
import { useAuth } from '../../context/AuthContext'
import { useFilter } from '../../hooks/useFilter'
import { useSavedJobs } from '../../hooks/useSavedJobs'
import { useApplications } from '../../hooks/useApplications'
import { useToast } from '../../hooks/useToast'
import { listApprovedJobs } from '../../services/jobsApi'

const uniqueValues = (items, key) => [...new Set(items.map((job) => job[key]).filter(Boolean))]
function addMatchScore(job, skills) {
  const available = Object.entries(skills ?? {}).filter(([, level]) => Number(level) > 0).map(([name]) => name.toLowerCase())
  const score = job.skills.length ? Math.round(job.skills.filter((skill) => available.includes(skill.toLowerCase())).length / job.skills.length * 100) : 0
  return { ...job, match: score, isLive: true }
}

export default function FindJobs() {
  const toast = useToast()
  const { profile } = useAuth()
  const { savedIds, isSaved, toggleSaved } = useSavedJobs()
  const { hasApplied } = useApplications()
  const [tab, setTab] = useState('all')
  const [sort, setSort] = useState('match')
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    listApprovedJobs().then((rows) => { if (active) setJobs(rows) })
      .catch((loadError) => { if (active) setError(loadError.message || 'Unable to load approved jobs.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const allJobs = useMemo(() => jobs.map((job) => addMatchScore(job, profile?.skills)), [jobs, profile?.skills])
  const typeOptions = useMemo(() => uniqueValues(allJobs, 'type'), [allJobs])
  const modeOptions = useMemo(() => uniqueValues(allJobs, 'mode'), [allJobs])
  const experienceOptions = useMemo(() => uniqueValues(allJobs, 'experience'), [allJobs])
  const { query, setQuery, filters, setFilter, results, reset, isFiltered } = useFilter(allJobs, {
    searchKeys: ['title', 'companyName', 'skills', 'location'],
    initialFilters: { type: 'all', mode: 'all', experience: 'all' },
  })
  const visible = useMemo(() => {
    const list = tab === 'saved' ? results.filter((job) => savedIds.includes(job.id)) : results
    const compare = sort === 'match' ? (a, b) => b.match - a.match : (a, b) => a.title.localeCompare(b.title)
    return [...list].sort(compare)
  }, [results, tab, savedIds, sort])
  const handleToggle = (id) => {
    const wasSaved = isSaved(id)
    toggleSaved(id)
    toast.info(wasSaved ? 'Removed from saved jobs.' : 'Job saved.')
  }
  const tabs = [
    { id: 'all', label: 'All jobs', count: results.length },
    { id: 'saved', label: 'Saved', count: results.filter((job) => savedIds.includes(job.id)).length },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Find jobs" description="Search approved openings and compare their skills with your profile." />
      <Card><div className="space-y-4">
        <Input label="Search" type="search" icon={Search} placeholder="Job title, company, skill or location" value={query} onChange={(event) => setQuery(event.target.value)} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Select label="Job type" value={filters.type} onChange={(event) => setFilter('type', event.target.value)}><option value="all">All types</option>{typeOptions.map((value) => <option key={value}>{value}</option>)}</Select>
          <Select label="Work mode" value={filters.mode} onChange={(event) => setFilter('mode', event.target.value)}><option value="all">All modes</option>{modeOptions.map((value) => <option key={value}>{value}</option>)}</Select>
          <Select label="Experience" value={filters.experience} onChange={(event) => setFilter('experience', event.target.value)}><option value="all">Any experience</option>{experienceOptions.map((value) => <option key={value}>{value}</option>)}</Select>
          <Select label="Sort by" value={sort} onChange={(event) => setSort(event.target.value)}><option value="match">Best match</option><option value="title">Title (A to Z)</option></Select>
        </div>
      </div></Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs tabs={tabs} value={tab} onChange={setTab} label="Job list" />
        <div className="flex items-center gap-3"><p aria-live="polite" className="text-sm text-ink-muted">{loading ? 'Loading jobs' : `${visible.length} ${visible.length === 1 ? 'job' : 'jobs'} shown`}</p>{isFiltered && <Button variant="ghost" size="sm" onClick={reset}>Clear filters</Button>}</div>
      </div>

      {loading ? <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3" role="status" aria-label="Loading jobs">{[0, 1, 2, 3, 4, 5].map((item) => <Skeleton key={item} className="h-52 w-full rounded-2xl" />)}</div> : error ? (
        <EmptyState icon={SearchX} tone="danger" title="Jobs could not be loaded" description={error} />
      ) : visible.length === 0 ? (
        tab === 'saved' && !isFiltered ? <EmptyState icon={Bookmark} title="No saved approved jobs" description="Use the bookmark icon on a job card to keep it here." action={<Button onClick={() => setTab('all')}>Browse all jobs</Button>} /> :
          <EmptyState icon={SearchX} title={jobs.length === 0 ? 'No approved jobs yet' : 'No jobs match'} description={jobs.length === 0 ? 'Approved job listings will appear here.' : 'Try a different keyword or remove some filters.'} action={isFiltered ? <Button onClick={reset}>Clear filters</Button> : undefined} />
      ) : <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">{visible.map((job) => <JobCard key={job.id} job={job} saved={isSaved(job.id)} applied={hasApplied(job.id)} onToggleSave={handleToggle} />)}</div>}
    </div>
  )
}
