import { useEffect, useRef, useState } from 'react'
import PageHeader from '../../components/ui/PageHeader'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { DemoNotice } from '../../components/ui/DemoBadge'
import { useResumes } from '../../hooks/useResumes'
import { useToast } from '../../hooks/useToast'
import { formatDate, formatFileSize } from '../../lib/format'
import UploadZone from './resume/UploadZone'
import ResumeList from './resume/ResumeList'

const MAX_BYTES = 5 * 1024 * 1024
const MAX_RESUMES = 5

export default function MyResume() {
  const { resumes, addResume, removeResume, setPrimary } = useResumes()
  const toast = useToast()

  const [upload, setUpload] = useState(null)
  const [status, setStatus] = useState({ kind: 'idle', message: '' })
  const [viewing, setViewing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  // File objects only live in memory for this browser session. Only name, size and date are saved.
  const sessionUrls = useRef({})
  const timer = useRef(null)

  useEffect(
    () => () => {
      clearInterval(timer.current)
      Object.values(sessionUrls.current).forEach((url) => URL.revokeObjectURL(url))
    },
    [],
  )

  const startUpload = (file) => {
    let progress = 0
    setUpload({ name: file.name, size: file.size, progress })
    timer.current = setInterval(() => {
      progress = Math.min(100, progress + 10 + Math.floor(Math.random() * 15))
      if (progress < 100) {
        setUpload({ name: file.name, size: file.size, progress })
        return
      }
      clearInterval(timer.current)
      const id = addResume({ name: file.name, size: file.size })
      sessionUrls.current[id] = URL.createObjectURL(file)
      setUpload(null)
      setStatus({ kind: 'success', message: `${file.name} was added to your list.` })
      toast.success('Resume added. The file stays in your browser only.', { title: 'Upload complete' })
    }, 180)
  }

  const handleFiles = (fileList) => {
    const file = fileList?.[0]
    if (!file) return
    if (fileList.length > 1) {
      setStatus({ kind: 'error', message: 'Choose one file at a time.' })
      return
    }
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    if (!isPdf) {
      setStatus({ kind: 'error', message: `"${file.name}" is not a PDF. Export your resume as a PDF and try again.` })
      return
    }
    if (file.size === 0) {
      setStatus({ kind: 'error', message: 'This file is empty. Choose a different PDF.' })
      return
    }
    if (file.size > MAX_BYTES) {
      setStatus({ kind: 'error', message: `This file is ${formatFileSize(file.size)}. The limit is 5 MB.` })
      return
    }
    if (resumes.length >= MAX_RESUMES) {
      setStatus({ kind: 'error', message: 'You have reached the limit of 5 resumes. Delete one to add another.' })
      return
    }
    setStatus({ kind: 'idle', message: '' })
    startUpload(file)
  }

  const confirmDelete = () => {
    const target = deleting
    removeResume(target.id)
    if (sessionUrls.current[target.id]) {
      URL.revokeObjectURL(sessionUrls.current[target.id])
      delete sessionUrls.current[target.id]
    }
    setStatus({ kind: 'idle', message: '' })
    toast.success(`${target.name} was deleted.`)
  }

  const previewUrl = viewing ? sessionUrls.current[viewing.id] : null

  return (
    <div className="space-y-6">
      <PageHeader
        title="My resume"
        description="Add the PDFs you want reviewed. Your primary resume is the one used on your dashboard."
      />
      <DemoNotice>
        Uploads are simulated. The PDF is not sent to a server, and only its name, size and date are saved in this browser. A real upload needs a
        backend and file storage.
      </DemoNotice>

      <UploadZone onFiles={handleFiles} upload={upload} status={status} />

      <ResumeList
        resumes={resumes}
        onView={setViewing}
        onDelete={setDeleting}
        onMakePrimary={(resume) => {
          setPrimary(resume.id)
          toast.success(`${resume.name} is now your primary resume.`)
        }}
      />

      <Modal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        title={viewing?.name ?? 'Resume'}
        description={viewing ? `PDF · ${formatFileSize(viewing.size)} · Added ${formatDate(viewing.uploadedAt)}` : undefined}
        size="lg"
        footer={<Button onClick={() => setViewing(null)}>Close</Button>}
      >
        {previewUrl ? (
          <iframe title={`Preview of ${viewing.name}`} src={previewUrl} className="h-[60vh] w-full rounded-xl border border-line bg-white" />
        ) : (
          <p className="rounded-xl bg-bg/60 p-4 text-sm text-ink-muted">
            No preview is available. Sample resumes have no file attached, and files chosen earlier are cleared when the page reloads.
          </p>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Delete this resume?"
        description={deleting ? `"${deleting.name}" will be removed from your list. This cannot be undone.` : ''}
        confirmLabel="Delete resume"
      />
    </div>
  )
}
