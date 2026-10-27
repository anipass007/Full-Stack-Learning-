import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import JobForm from '../../components/recruiter/JobForm'
import { emptyJobDraft } from '../../lib/jobForm'
import { useAuth } from '../../context/AuthContext'
import { useRecruiterJobs } from '../../hooks/useRecruiterJobs'
import { useToast } from '../../hooks/useToast'

export default function PostJob() {
  const toast = useToast()
  const { profile } = useAuth()
  const { addJob, saving } = useRecruiterJobs({ loadOnMount: false })
  const [posted, setPosted] = useState(null)
  const [formKey, setFormKey] = useState(0)
  const [error, setError] = useState('')
  const defaults = {
    companyName: profile?.company_name ?? '',
    preferences: {
      defaultMode: profile?.preferences?.defaultMode ?? 'Remote',
      defaultType: profile?.preferences?.defaultType ?? 'Internship',
    },
  }

  const handleSubmit = async (data) => {
    setError('')
    try {
      await addJob(data)
      setPosted(data.title)
      toast.success(`${data.title} was submitted for review.`, { title: 'Job posted' })
    } catch (submitError) {
      setError(submitError.message || 'Unable to submit this job.')
    }
  }

  if (posted) return (
    <div className="space-y-6">
      <PageHeader title="Post a job" />
      <Card className="mx-auto max-w-2xl text-center">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success"><CheckCircle2 className="h-7 w-7" aria-hidden="true" /></span>
        <h2 className="text-xl font-semibold text-ink">Job submitted</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted"><span className="font-medium text-ink">{posted}</span> is saved and pending review. Students can see it after an admin approves it.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button to="/recruiter/jobs">View in Manage jobs</Button>
          <Button variant="secondary" onClick={() => { setPosted(null); setFormKey((value) => value + 1) }}>Post another job</Button>
        </div>
      </Card>
    </div>
  )

  return (
    <div className="space-y-6">
      <PageHeader title="Post a job" description="Tell students about the role. New jobs start as pending review." />
      <Card className="max-w-3xl">
        <JobForm key={formKey} initial={emptyJobDraft(defaults)} submitLabel="Submit for review" loading={saving} error={error} onSubmit={handleSubmit} />
      </Card>
    </div>
  )
}
