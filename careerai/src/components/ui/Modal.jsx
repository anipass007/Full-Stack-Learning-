import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'

const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' }

export default function Modal({ open, onClose, title, description, children, footer, size = 'md' }) {
  const titleId = useId()
  const panelRef = useRef(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return undefined
    const previouslyFocused = document.activeElement
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onCloseRef.current?.()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      previouslyFocused?.focus?.()
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <div className="absolute inset-0 bg-black/65" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn('relative max-h-[90vh] w-full overflow-y-auto rounded-2xl border border-line bg-surface p-6 shadow-pop outline-none', sizes[size])}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-ink-faint transition-colors hover:bg-white/5 hover:text-ink"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
        <h2 id={titleId} className="pr-8 text-lg font-semibold text-ink">
          {title}
        </h2>
        {description && <p className="mt-1.5 text-sm text-ink-muted">{description}</p>}
        {children && <div className="mt-5">{children}</div>}
        {footer && <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
