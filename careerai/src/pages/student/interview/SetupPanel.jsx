import { Play } from 'lucide-react'
import Card, { CardHeader } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Tabs from '../../../components/ui/Tabs'
import { Select } from '../../../components/ui/Input'
import { difficulties, interviewCategories, interviewRoles } from '../../../data/interview'

export default function SetupPanel({ config, onChange, onStart }) {
  const selected = difficulties.find((item) => item.id === config.difficulty)
  return (
    <Card>
      <CardHeader title="Start a mock interview" description="Choose a role, category and difficulty. Questions and feedback use local rules." />
      <div className="space-y-5">
        <Select label="Role" value={config.role} onChange={(event) => onChange({ ...config, role: event.target.value })}>
          {interviewRoles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </Select>
        <Select label="Interview category" value={config.category} onChange={(event) => onChange({ ...config, category: event.target.value })}>
          {interviewCategories.map((category) => <option key={category.id} value={category.id}>{category.id}</option>)}
        </Select>
        <p className="-mt-3 text-sm text-ink-muted">{interviewCategories.find((item) => item.id === config.category)?.description}</p>
        <div>
          <p className="mb-1.5 text-sm font-medium text-ink">Difficulty</p>
          <Tabs
            tabs={difficulties.map((item) => ({ id: item.id, label: item.id }))}
            value={config.difficulty}
            onChange={(difficulty) => onChange({ ...config, difficulty })}
            label="Choose difficulty"
          />
          <p className="mt-2 text-sm text-ink-muted">{selected?.description}</p>
        </div>
        <ul className="space-y-1.5 rounded-xl bg-bg/50 p-4 text-sm text-ink-muted">
          <li>4 questions, about 10 minutes.</li>
          <li>Write at least 15 words per answer, or skip a question.</li>
          <li>Rule-based feedback covers relevance, completeness and clarity.</li>
        </ul>
        <Button size="lg" icon={Play} onClick={onStart}>
          Start interview
        </Button>
      </div>
    </Card>
  )
}
