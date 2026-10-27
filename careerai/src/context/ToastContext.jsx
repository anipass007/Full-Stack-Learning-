import { createContext, useCallback, useMemo, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'

export const ToastContext = createContext(null)

const icons = { success: CheckCircle2, error: AlertCircle, info: Info }
const iconTones = { success: 'text-success', error: 'text-danger', info: 'text-accent' }

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const push = useCallback(
    (message, { type = 'info', title, duration = 4000 } = {}) => {
      idRef.current += 1
      const id = idRef.current
      setToasts((current) => [...current, { id, message, type, title }])
      if (duration) setTimeout(() => dismiss(id), duration)
      return id
    },
    [dismiss],
  )

  const api = useMemo(
    () => ({
      show: push,
      success: (message, options) => push(message, { ...options, type: 'success' }),
      error: (message, options) => push(message, { ...options, type: 'error' }),
      info: (message, options) => push(message, { ...options, type: 'info' }),
      dismiss,
    }),
    [push, dismiss],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
        {toasts.map((toast) => {
          const Icon = icons[toast.type]
          return (
            <div
              key={toast.id}
              className="pointer-events-auto flex items-start gap-3 rounded-xl border border-line bg-surface-raised p-4 shadow-pop"
            >
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconTones[toast.type]}`} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                {toast.title && <p className="text-sm font-medium text-ink">{toast.title}</p>}
                <p className="text-sm text-ink-muted">{toast.message}</p>
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
                className="text-ink-faint transition-colors hover:text-ink"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
