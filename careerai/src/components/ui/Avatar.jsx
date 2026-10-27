import { cn } from '../../lib/cn'

const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-14 w-14 text-lg' }

export default function Avatar({ name = '', size = 'md', className }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')

  return (
    <span
      aria-hidden="true"
      className={cn('inline-flex shrink-0 items-center justify-center rounded-full bg-brand/20 font-semibold text-brand-soft', sizes[size], className)}
    >
      {initials || '?'}
    </span>
  )
}
