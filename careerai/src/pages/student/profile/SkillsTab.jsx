import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import Card, { CardHeader } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import { Input } from '../../../components/ui/Input'
import { currentSkills } from '../../../data/student'
import { targetRoles } from '../../../data/skills'
import { useToast } from '../../../hooks/useToast'

// Skill names the role requirements use. Matching them keeps the skill gap page accurate.
const knownSkills = [...new Set([...Object.keys(currentSkills), ...Object.values(targetRoles).flatMap((list) => list.map((item) => item.skill))])].sort()

export default function SkillsTab({ skills: savedSkills, onSave, saving = false, saveError = '' }) {
  const toast = useToast()
  const [skills, setSkills] = useState(savedSkills)
  const [name, setName] = useState('')
  const [level, setNewLevel] = useState(50)
  const [error, setError] = useState('')
  const [removing, setRemoving] = useState(null)

  useEffect(() => setSkills(savedSkills), [savedSkills])

  const entries = Object.entries(skills).sort((a, b) => b[1] - a[1])

  const submit = (event) => {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return setError('Enter a skill name.')
    if (trimmed.length > 30) return setError('Keep the name under 30 characters.')
    const canonical = knownSkills.find((item) => item.toLowerCase() === trimmed.toLowerCase()) ?? trimmed
    if (Object.keys(skills).some((item) => item.toLowerCase() === canonical.toLowerCase())) return setError(`${canonical} is already in your list.`)
    setSkills((current) => ({ ...current, [canonical]: Number(level) }))
    setName('')
    setNewLevel(50)
    setError('')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader title="Add a skill" description="Your levels feed the skill gap, dashboard and job match views." />
        <form onSubmit={submit} noValidate className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div>
            <Input
              label="Skill name"
              list="known-skills"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                if (error) setError('')
              }}
              error={error}
              placeholder="For example, TypeScript"
            />
            <datalist id="known-skills">
              {knownSkills.map((skill) => (
                <option key={skill} value={skill} />
              ))}
            </datalist>
          </div>
          <div>
            <label htmlFor="new-skill-level" className="mb-1.5 block text-sm font-medium text-ink">
              Level: {level}%
            </label>
            <input
              id="new-skill-level"
              type="range"
              min="0"
              max="100"
              step="5"
              value={level}
              onChange={(event) => setNewLevel(event.target.value)}
              className="h-11 w-full accent-brand"
            />
          </div>
          <Button type="submit" icon={Plus} className="h-11">
            Add skill
          </Button>
        </form>
      </Card>

      <Card>
        <CardHeader title="Your skills" description={`${entries.length} skills listed`} />
        {entries.length === 0 ? (
          <EmptyState title="No skills yet" description="Add a skill above to start your skill gap analysis." />
        ) : (
          <ul className="divide-y divide-line">
            {entries.map(([skill, value]) => (
              <li key={skill} className="grid grid-cols-1 items-center gap-3 py-3 first:pt-0 last:pb-0 sm:grid-cols-[180px_1fr_auto]">
                <label htmlFor={`skill-${skill}`} className="text-sm font-medium text-ink">
                  {skill}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id={`skill-${skill}`}
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={value}
                    onChange={(event) => setSkills((current) => ({ ...current, [skill]: Number(event.target.value) }))}
                    className="w-full accent-brand"
                  />
                  <span className="w-10 shrink-0 text-right text-sm text-ink-muted">{value}%</span>
                </div>
          <Button variant="ghost" size="sm" icon={Trash2} onClick={() => setRemoving(skill)} aria-label={`Remove ${skill}`}>
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <ConfirmDialog
        open={Boolean(removing)}
        onClose={() => setRemoving(null)}
        onConfirm={() => {
          setSkills((current) => {
            const next = { ...current }
            delete next[removing]
            return next
          })
          setRemoving(null)
        }}
        title="Remove this skill?"
        description={removing ? `${removing} will be removed from your skill list and skill gap results.` : ''}
        confirmLabel="Remove skill"
      />
      {saveError && <p role="alert" className="text-sm text-danger">{saveError}</p>}
      <Button loading={saving} onClick={async () => { if (await onSave(skills)) toast.success('Skills updated.') }}>
        {saving ? 'Saving skills' : 'Save skills'}
      </Button>
    </div>
  )
}
