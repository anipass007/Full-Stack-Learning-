import { useState } from 'react'
import { Bell } from 'lucide-react'
import Dropdown from '../ui/Dropdown'
import { cn } from '../../lib/cn'

export default function NotificationMenu({ notifications: initial }) {
  const [items, setItems] = useState(initial)
  const unreadCount = items.filter((item) => item.unread).length

  const markAllRead = () => setItems((current) => current.map((item) => ({ ...item, unread: false })))

  return (
    <Dropdown
      trigger={({ open, toggle }) => (
        <button
          type="button"
          onClick={toggle}
          aria-haspopup="true"
          aria-expanded={open}
          aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : 'Notifications'}
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-ink-muted transition-colors hover:bg-white/5 hover:text-ink"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
          {unreadCount > 0 && <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-brand ring-2 ring-bg" />}
        </button>
      )}
      panelClassName="sm:w-80"
    >
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <p className="text-sm font-semibold text-ink">Notifications</p>
        <button
          type="button"
          onClick={markAllRead}
          disabled={unreadCount === 0}
          className="text-xs font-medium text-brand-soft transition-colors hover:text-ink disabled:cursor-not-allowed disabled:text-ink-faint"
        >
          Mark all as read
        </button>
      </div>
      <ul className="max-h-80 overflow-y-auto">
        {items.length === 0 && <li className="px-4 py-5 text-sm text-ink-muted">Notifications are not connected yet.</li>}
        {items.map((item) => (
          <li key={item.id} className={cn('border-b border-line px-4 py-3 last:border-b-0', item.unread && 'bg-brand/5')}>
            <div className="flex items-start gap-2">
              {item.unread && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" aria-label="Unread" />}
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink">{item.title}</p>
                <p className="mt-0.5 text-sm text-ink-muted">{item.body}</p>
                <p className="mt-1 text-xs text-ink-faint">{item.time}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {items.length > 0 && <p className="border-t border-line px-4 py-2.5 text-xs text-ink-faint">Notifications are examples and are not synced to your account.</p>}
    </Dropdown>
  )
}
