import { useState } from 'react'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import { Select, Textarea } from '../../../components/ui/Input'
import { rejectionReasons } from '../../../data/admin'

function RejectForm({ job, onClose, onConfirm }) {
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState({})

  const submit = (event) => {
    event.preventDefault()
    const found = {}
    if (!reason) found.reason = 'Choose a reason so the recruiter knows what to fix.'
    if (reason === 'Other' && note.trim().length < 10) found.note = 'Add a short explanation of at least 10 characters.'
    setErrors(found)
    if (Object.keys(found).length > 0) return
    onConfirm(job, reason === 'Other' ? note.trim() : note.trim() ? `${reason}: ${note.trim()}` : reason)
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <Select
        label="Reason"
        required
        value={reason}
        onChange={(event) => {
          setReason(event.target.value)
          setErrors({})
        }}
        error={errors.reason}
      >
        <option value="">Choose a reason</option>
        {rejectionReasons.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </Select>
      <Textarea
        label="Note to the recruiter (optional)"
        required={reason === 'Other'}
        rows={3}
        value={note}
        onChange={(event) => {
          setNote(event.target.value)
          if (errors.note) setErrors({})
        }}
        error={errors.note}
      />
      <div className="flex flex-wrap justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="danger">
          Reject job
        </Button>
      </div>
    </form>
  )
}

export default function RejectModal({ job, onClose, onConfirm }) {
  return (
    <Modal open={Boolean(job)} onClose={onClose} title="Reject this job?" description={job ? `${job.title} at ${job.company}` : undefined}>
      {job && <RejectForm key={job.id} job={job} onClose={onClose} onConfirm={onConfirm} />}
    </Modal>
  )
}
