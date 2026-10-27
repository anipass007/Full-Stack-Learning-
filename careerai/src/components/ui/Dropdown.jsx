import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/cn'

// trigger({ open, toggle }) renders the button. children can be a function receiving { close }.
export default function Dropdown({ trigger, children, align = 'right', panelClassName }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const close = useCallback(() => setOpen(false), [])
  const toggle = useCallback(() => setOpen((value) => !value), [])

  useEffect(() => {
    if (!open) return undefined
    const onPointerDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      {trigger({ open, toggle })}
      {open && (
        <div
          className={cn(
            'fixed inset-x-4 top-[4.5rem] z-40 rounded-2xl border border-line bg-surface-raised shadow-pop',
            'sm:absolute sm:inset-x-auto sm:top-full sm:mt-2 sm:w-72',
            align === 'right' ? 'sm:right-0' : 'sm:left-0',
            panelClassName,
          )}
        >
          {typeof children === 'function' ? children({ close }) : children}
        </div>
      )}
    </div>
  )
}
