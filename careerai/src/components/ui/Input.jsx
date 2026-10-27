import { forwardRef, useId } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/cn'

const fieldBase =
  'w-full rounded-xl border bg-bg/60 px-3.5 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:cursor-not-allowed disabled:opacity-60'

function Field({ id, label, hint, error, required, children }) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
          {label}
          {required && (
            <span className="ml-0.5 text-danger" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-faint">
            {hint}
          </p>
        )
      )}
    </div>
  )
}

function describedBy(id, error, hint) {
  if (error) return `${id}-error`
  if (hint) return `${id}-hint`
  return undefined
}

export const Input = forwardRef(function Input(
  { label, hint, error, icon: Icon, rightSlot, required, id, className, ...props },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId
  return (
    <Field id={inputId} label={label} hint={hint} error={error} required={required}>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
        )}
        <input
          ref={ref}
          id={inputId}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(inputId, error, hint)}
          className={cn(fieldBase, 'h-11', Icon && 'pl-10', rightSlot && 'pr-12', error ? 'border-danger/70' : 'border-line', className)}
          {...props}
        />
        {rightSlot && <div className="absolute right-1.5 top-1/2 -translate-y-1/2">{rightSlot}</div>}
      </div>
    </Field>
  )
})

export const Textarea = forwardRef(function Textarea({ label, hint, error, required, id, className, rows = 4, ...props }, ref) {
  const autoId = useId()
  const inputId = id ?? autoId
  return (
    <Field id={inputId} label={label} hint={hint} error={error} required={required}>
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(inputId, error, hint)}
        className={cn(fieldBase, 'py-3', error ? 'border-danger/70' : 'border-line', className)}
        {...props}
      />
    </Field>
  )
})

export const Select = forwardRef(function Select({ label, hint, error, required, id, className, children, ...props }, ref) {
  const autoId = useId()
  const inputId = id ?? autoId
  return (
    <Field id={inputId} label={label} hint={hint} error={error} required={required}>
      <div className="relative">
        <select
          ref={ref}
          id={inputId}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(inputId, error, hint)}
          className={cn(fieldBase, 'h-11 appearance-none pr-10', error ? 'border-danger/70' : 'border-line', className)}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
      </div>
    </Field>
  )
})

export const Checkbox = forwardRef(function Checkbox({ label, id, className, ...props }, ref) {
  const autoId = useId()
  const inputId = id ?? autoId
  return (
    <label htmlFor={inputId} className={cn('inline-flex cursor-pointer items-center gap-2.5 text-sm text-ink-muted', className)}>
      <input
        ref={ref}
        id={inputId}
        type="checkbox"
        className="h-4 w-4 rounded border-line bg-bg/60 accent-brand"
        {...props}
      />
      {label}
    </label>
  )
})

export default Input
