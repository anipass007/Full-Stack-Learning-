import { useEffect, useState } from 'react'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import { RoleBadge } from '../../../components/admin/AdminBadges'
import { formatDate } from '../../../lib/format'
import { Select } from '../../../components/ui/Input'

export default function UserModal({ user, onClose, onSaveRole, saving }) {
  const [role, setRole] = useState('Student')
  useEffect(() => { setRole(user?.role ?? 'Student') }, [user?.id, user?.role])

  return (
    <Modal
      open={Boolean(user)}
      onClose={onClose}
      title={user?.name ?? 'Account'}
      description={user?.email}
      footer={user && <>
        <Button variant="secondary" onClick={onClose} disabled={saving}>Close</Button>
        {user.role !== 'Admin' && <Button onClick={() => onSaveRole(user, role)} loading={saving} disabled={saving || role === user.role}>Save role</Button>}
      </>}
    >
      {user && <div className="space-y-4">
        <RoleBadge role={user.role} />
        <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div><dt className="text-xs text-ink-faint">{user.role === 'Recruiter' ? 'Company' : user.role === 'Student' ? 'Course' : 'Account'}</dt><dd className="mt-1 text-ink">{user.detail || 'Not provided'}</dd></div>
          <div><dt className="text-xs text-ink-faint">Joined</dt><dd className="mt-1 text-ink">{formatDate(user.joinedOn)}</dd></div>
        </dl>
        {user.role === 'Admin' ? (
          <p className="rounded-xl bg-bg/60 p-3 text-sm text-ink-muted">Admin roles can only be assigned through trusted provisioning. Admin accounts cannot change their own role.</p>
        ) : (
          <Select label="Account role" value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="Student">Student</option><option value="Recruiter">Recruiter</option>
          </Select>
        )}
        <p className="text-xs text-ink-faint">Role changes are checked by the admin-only database function. Account suspension and deletion are not available in this schema.</p>
      </div>}
    </Modal>
  )
}
