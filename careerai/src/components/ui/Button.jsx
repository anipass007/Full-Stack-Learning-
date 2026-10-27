import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'
import Spinner from './Spinner'

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-55'

const variants = {
  primary: 'bg-brand text-white hover:bg-brand-hover',
  secondary: 'border border-line bg-surface text-ink hover:bg-surface-raised',
  ghost: 'text-ink-muted hover:bg-white/5 hover:text-ink',
  danger: 'bg-danger/15 text-danger hover:bg-danger/25',
}

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  to,
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  disabled,
  type = 'button',
  className,
  children,
  ...rest
}) {
  const classes = cn(base, variants[variant], sizes[size], className)
  const content = (
    <>
      {loading ? <Spinner /> : Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />}
      {children}
      {IconRight && <IconRight className="h-4 w-4 shrink-0" aria-hidden="true" />}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    )
  }

  return (
    <button type={type} className={classes} disabled={disabled || loading} {...rest}>
      {content}
    </button>
  )
}
