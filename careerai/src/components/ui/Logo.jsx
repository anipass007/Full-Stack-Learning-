import { Link } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'

export default function Logo({ to = '/', className = '' }) {
  return (
    <Link to={to} className={`inline-flex items-center gap-2.5 ${className}`} aria-label="CareerAI home">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient">
        <TrendingUp className="h-4 w-4 text-white" aria-hidden="true" />
      </span>
      <span className="text-lg font-semibold tracking-tight text-ink">CareerAI</span>
    </Link>
  )
}
