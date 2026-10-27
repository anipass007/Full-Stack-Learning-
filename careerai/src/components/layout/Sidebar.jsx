import { NavLink } from 'react-router-dom'
import Logo from '../ui/Logo'
import { cn } from '../../lib/cn'

export default function Sidebar({ roleLabel, groups, onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-line px-5">
        <Logo to="/" />
        <span className="rounded-md bg-brand/15 px-2 py-0.5 text-xs font-medium text-brand-soft">{roleLabel}</span>
      </div>

      <nav aria-label={`${roleLabel} navigation`} className="flex-1 overflow-y-auto px-3 py-4">
        {groups.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="mb-2 px-3 text-xs font-medium text-ink-faint">{group.label}</p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                          isActive ? 'bg-brand/15 text-ink' : 'text-ink-muted hover:bg-white/5 hover:text-ink',
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-brand-soft' : 'text-ink-faint')} aria-hidden="true" />
                          {item.label}
                        </>
                      )}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-line p-4">
        <div className="rounded-xl bg-bg/60 p-3 text-xs text-ink-muted">
          <p className="font-medium text-ink">Supabase-connected</p>
          <p className="mt-1">Accounts, profiles, jobs and saved career progress use your configured database. Scores use local rules, not an AI model.</p>
        </div>
      </div>
    </div>
  )
}
