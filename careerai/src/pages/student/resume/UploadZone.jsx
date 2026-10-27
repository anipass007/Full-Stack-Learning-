import { useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, UploadCloud } from 'lucide-react'
import Button from '../../../components/ui/Button'
import ProgressBar from '../../../components/ui/ProgressBar'
import { formatFileSize } from '../../../lib/format'
import { cn } from '../../../lib/cn'

// status: { kind: 'idle' | 'error' | 'success', message }, upload: { name, size, progress } | null
export default function UploadZone({ onFiles, upload, status }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const busy = Boolean(upload)

  const handleDrop = (event) => {
    event.preventDefault()
    setDragging(false)
    if (!busy) onFiles(event.dataTransfer.files)
  }

  return (
    <div>
      <div
        onDragOver={(event) => {
          event.preventDefault()
          if (!busy) setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'flex flex-col items-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors',
          dragging ? 'border-brand bg-brand/10' : 'border-line bg-surface',
          status.kind === 'error' && 'border-danger/50',
        )}
      >
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand/15 text-brand-soft">
          <UploadCloud className="h-6 w-6" aria-hidden="true" />
        </span>
        <p className="text-base font-semibold text-ink">Drag a PDF here or choose a file</p>
        <p className="mt-1.5 text-sm text-ink-muted">PDF only, up to 5 MB. Keep it to one or two pages.</p>

        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="sr-only"
          aria-label="Choose a PDF resume"
          tabIndex={-1}
          onChange={(event) => {
            onFiles(event.target.files)
            event.target.value = ''
          }}
        />
        <Button className="mt-5" onClick={() => inputRef.current?.click()} disabled={busy} loading={busy}>
          {busy ? 'Uploading' : 'Choose PDF'}
        </Button>

        {upload && (
          <div className="mt-6 w-full max-w-md text-left">
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="truncate font-medium text-ink">{upload.name}</span>
              <span className="shrink-0 text-ink-faint">{formatFileSize(upload.size)}</span>
            </div>
            <ProgressBar value={upload.progress} showValue size="sm" label="Simulated upload" />
          </div>
        )}
      </div>

      <div aria-live="polite" className="mt-3 min-h-6">
        {status.kind === 'error' && (
          <p role="alert" className="flex items-start gap-2 text-sm text-danger">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {status.message}
          </p>
        )}
        {status.kind === 'success' && (
          <p className="flex items-start gap-2 text-sm text-success">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {status.message}
          </p>
        )}
      </div>
    </div>
  )
}
