import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown, LogOut, Settings } from 'lucide-react'
import Avatar from '../ui/Avatar'
import Dropdown from '../ui/Dropdown'
import { useToast } from '../../hooks/useToast'
import { useAuth } from '../../context/AuthContext'

export default function ProfileMenu({ user, profilePath }) {
  const navigate = useNavigate()
  const toast = useToast()
  const { signOut } = useAuth()

  const logOut = async (close) => {
    close()
    const { error } = await signOut()
    if (error) {
      toast.error(error.message || 'Unable to sign out.')
      return
    }
    toast.info('You have been signed out.')
    navigate('/login', { replace: true })
  }

  return (
    <Dropdown
      trigger={({ open, toggle }) => (
        <button
          type="button"
          onClick={toggle}
          aria-haspopup="true"
          aria-expanded={open}
          aria-label="Open profile menu"
          className="flex items-center gap-2 rounded-xl py-1 pl-1 pr-2 transition-colors hover:bg-white/5"
        >
          <Avatar name={user.name} size="sm" />
          <span className="hidden text-sm font-medium text-ink sm:block">{user.name}</span>
          <ChevronDown className="hidden h-4 w-4 text-ink-faint sm:block" aria-hidden="true" />
        </button>
      )}
    >
      {({ close }) => (
        <>
          <div className="border-b border-line px-4 py-3">
            <p className="text-sm font-semibold text-ink">{user.name}</p>
            <p className="truncate text-xs text-ink-muted">{user.email}</p>
            <p className="mt-1 text-xs capitalize text-ink-faint">{user.role} account</p>
          </div>
          <div className="p-2">
            {profilePath && (
              <Link
                to={profilePath}
                onClick={close}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-white/5 hover:text-ink"
              >
                <Settings className="h-4 w-4" aria-hidden="true" />
                Profile & settings
              </Link>
            )}
          </div>
          <div className="border-t border-line p-2">
            <button
              type="button"
              onClick={() => logOut(close)}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-danger transition-colors hover:bg-danger/10"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Log out
            </button>
          </div>
        </>
      )}
    </Dropdown>
  )
}
