import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { X } from 'lucide-react'
import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'
import ErrorBoundary from '../components/layout/ErrorBoundary'

// Shared shell for the student, recruiter and admin portals.
export default function DashboardLayout({ roleLabel, groups, user, profilePath, notifications }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const closeRef = useRef(null)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return undefined
    closeRef.current?.focus()
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  return (
    <div className="min-h-screen bg-bg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-line bg-surface/60 lg:block">
        <Sidebar roleLabel={roleLabel} groups={groups} />
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div className="absolute inset-0 bg-black/65" onClick={() => setMenuOpen(false)} aria-hidden="true" />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85%] border-r border-line bg-surface shadow-pop">
            <button
              ref={closeRef}
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close navigation menu"
              className="absolute right-3 top-3.5 z-10 flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-white/5 hover:text-ink"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <Sidebar roleLabel={roleLabel} groups={groups} onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <Topbar
          roleLabel={roleLabel}
          user={user}
          profilePath={profilePath}
          notifications={notifications}
          onOpenMenu={() => setMenuOpen(true)}
        />
        <main id="main" tabIndex={-1} className="mx-auto w-full max-w-7xl px-4 py-6 focus:outline-none sm:px-6 lg:px-8">
          <ErrorBoundary key={pathname} standalone={false}>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}
