import { useRef, useState } from 'react'
import Button from '../ui/Button'
import { Input, Select, Textarea } from '../ui/Input'
import { draftToJob, experienceLevels, jobTypes, salaryUnits, validateJob, workModes } from '../../lib/jobForm'

// Used for both "Post a job" and the edit dialog on Manage jobs.
export default function JobForm({ initial, submitLabel = 'Save', loading = false, error = '', onSubmit, onCancel }) {
  const [draft, setDraft] = useState(initial)
  const [errors, setErrors] = useState({})
  const formRef = useRef(null)

  const set = (field) => (event) => {
    setDraft((current) => ({ ...current, [field]: event.target.value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const submit = (event) => {
    event.preventDefault()
    const found = validateJob(draft)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"]')?.focus())
      return
    }
    onSubmit(draftToJob(draft))
  }

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="space-y-5">
      {error && <p role="alert" className="rounded-xl border border-danger/25 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Job title" required value={draft.title} onChange={set('title')} error={errors.title} placeholder="Frontend Developer Intern" />
        <Input label="Company" required value={draft.company} onChange={set('company')} error={errors.company} />
        <Input label="Location" required value={draft.location} onChange={set('location')} error={errors.location} placeholder="Remote, or a city" />
        <Select label="Work mode" value={draft.mode} onChange={set('mode')}>
          {workModes.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </Select>
        <Select label="Job type" value={draft.type} onChange={set('type')}>
          {jobTypes.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </Select>
        <Select label="Experience" value={draft.experience} onChange={set('experience')}>
          {experienceLevels.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </Select>
      </div>

      <fieldset>
        <legend className="mb-1.5 text-sm font-medium text-ink">Salary range (optional)</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input aria-label="Minimum salary" type="number" min="0" step="any" placeholder="Minimum" value={draft.salaryMin} onChange={set('salaryMin')} />
          <Input aria-label="Maximum salary" type="number" min="0" step="any" placeholder="Maximum" value={draft.salaryMax} onChange={set('salaryMax')} error={errors.salaryMax} />
          <Select aria-label="Salary unit" value={draft.salaryUnit} onChange={set('salaryUnit')}>
            {salaryUnits.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </Select>
        </div>
      </fieldset>

      <Textarea
        label="Job description"
        required
        rows={5}
        value={draft.description}
        onChange={set('description')}
        error={errors.description}
        hint="What the team does and what this person will work on. At least 50 characters."
      />
      <Textarea
        label="Responsibilities"
        required
        rows={4}
        value={draft.responsibilities}
        onChange={set('responsibilities')}
        error={errors.responsibilities}
        hint="One responsibility per line."
        placeholder={'Build responsive interface components\nFix UI bugs reported by users'}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Required skills" required value={draft.skills} onChange={set('skills')} error={errors.skills} hint="Separate with commas. Up to 12." placeholder="React, JavaScript, Git" />
        <Input label="Application deadline (optional)" type="date" value={draft.deadline} onChange={set('deadline')} error={errors.deadline} />
      </div>

      <div className="flex flex-wrap gap-3 pt-1">
        <Button type="submit" loading={loading}>
          {loading ? 'Saving' : submitLabel}
        </Button>
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
