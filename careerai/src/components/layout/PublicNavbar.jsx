import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from '../ui/Logo'
import Button from '../ui/Button'
import { cn } from '../../lib/cn'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
]

const linkClass = ({ isActive }) =>
  cn('rounded-lg px-3 py-2 text-sm font-medium transition-colors', isActive ? 'text-ink' : 'text-ink-muted hover:text-ink')

export default function PublicNavbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button to="/login" variant="ghost">
            Log in
          </Button>
          <Button to="/signup">Sign up</Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="public-mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-ink-muted transition-colors hover:bg-white/5 hover:text-ink md:hidden"
        >
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <div id="public-mobile-menu" className="border-t border-line px-4 pb-4 pt-2 md:hidden">
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} onClick={() => setOpen(false)} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button to="/login" variant="secondary" onClick={() => setOpen(false)}>
              Log in
            </Button>
            <Button to="/signup" onClick={() => setOpen(false)}>
              Sign up
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
