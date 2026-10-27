import { Link, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { routeLabels } from '../../data/navigation'

export default function Breadcrumbs({ roleLabel }) {
  const { pathname } = useLocation()
  const [base, ...rest] = pathname.split('/').filter(Boolean)

  const items = [{ label: roleLabel, to: `/${base}` }]
  if (rest.length === 0) {
    items.push({ label: 'Dashboard' })
  } else {
    rest.forEach((_, index) => {
      const path = `/${[base, ...rest.slice(0, index + 1)].join('/')}`
      items.push({ label: routeLabels[path] ?? 'Details', to: path })
    })
  }

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex items-center gap-1.5 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1.5">
              {index > 0 && <ChevronRight className="hidden h-3.5 w-3.5 shrink-0 text-ink-faint sm:block" aria-hidden="true" />}
              {isLast || !item.to ? (
                <span aria-current="page" className="truncate font-medium text-ink">
                  {item.label}
                </span>
              ) : (
                <Link to={item.to} className="hidden truncate text-ink-muted transition-colors hover:text-ink sm:inline">
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
