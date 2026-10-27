import { Menu } from 'lucide-react'
import Breadcrumbs from './Breadcrumbs'
import NotificationMenu from './NotificationMenu'
import ProfileMenu from './ProfileMenu'

export default function Topbar({ roleLabel, user, profilePath, notifications, onOpenMenu }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-bg/85 px-4 backdrop-blur sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Open navigation menu"
        className="flex h-10 w-10 items-center justify-center rounded-xl text-ink-muted transition-colors hover:bg-white/5 hover:text-ink lg:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>
      <div className="min-w-0 flex-1">
        <Breadcrumbs roleLabel={roleLabel} />
      </div>
      <NotificationMenu notifications={notifications} />
      <ProfileMenu user={user} profilePath={profilePath} />
    </header>
  )
}
