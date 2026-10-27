import { forwardRef, useState } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { Input } from './Input'

const PasswordInput = forwardRef(function PasswordInput({ label = 'Password', ...props }, ref) {
  const [visible, setVisible] = useState(false)
  return (
    <Input
      ref={ref}
      label={label}
      icon={Lock}
      type={visible ? 'text' : 'password'}
      rightSlot={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-faint transition-colors hover:bg-white/5 hover:text-ink"
        >
          {visible ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
        </button>
      }
      {...props}
    />
  )
})

export default PasswordInput
