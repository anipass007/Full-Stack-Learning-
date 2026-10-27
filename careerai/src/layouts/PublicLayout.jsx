import { Outlet, useLocation } from 'react-router-dom'
import ErrorBoundary from '../components/layout/ErrorBoundary'
import PublicNavbar from '../components/layout/PublicNavbar'
import PublicFooter from '../components/layout/PublicFooter'

export default function PublicLayout() {
  const { pathname } = useLocation()
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <PublicNavbar />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <ErrorBoundary key={pathname} standalone={false}>
          <Outlet />
        </ErrorBoundary>
      </main>
      <PublicFooter />
    </div>
  )
}
