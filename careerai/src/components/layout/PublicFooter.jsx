import { Link } from 'react-router-dom'
import Logo from '../ui/Logo'

const columns = [
  {
    title: 'Platform',
    links: [
      { to: '/', label: 'Home' },
      { to: '/about', label: 'About' },
      { to: '/signup', label: 'Create account' },
      { to: '/login', label: 'Log in' },
    ],
  },
  {
    title: 'Portals',
    links: [
      { to: '/student', label: 'Student portal' },
      { to: '/recruiter', label: 'Recruiter portal' },
      { to: '/admin', label: 'Admin portal' },
    ],
  },
]

export default function PublicFooter() {
  return (
    <footer className="border-t border-line bg-surface/40">
      <div className="mx-auto grid grid-cols-1 max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-ink-muted">
            A career development and placement platform for students. Built as a BCA final-year project.
          </p>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <h2 className="text-sm font-semibold text-ink">{column.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-ink-muted transition-colors hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line px-4 py-5 text-center text-xs text-ink-faint">
        Job listings and account data use the configured Supabase project. Landing statistics, testimonials and sample previews are illustrative; PDF storage and admin analytics are not connected.
      </div>
    </footer>
  )
}
