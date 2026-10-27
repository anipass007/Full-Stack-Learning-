import Modal from '../../../components/ui/Modal'
import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import { ApplicantStatusBadge } from '../../../components/recruiter/StatusBadges'
import { formatDate } from '../../../lib/format'

export default function ApplicantModal({ applicant, onClose, onStatusChange }) {
  return (
    <Modal
      open={Boolean(applicant)}
      onClose={onClose}
      title={applicant?.name ?? 'Candidate'}
      description={applicant ? `${applicant.jobTitle} · Applied ${formatDate(applicant.appliedOn)}` : undefined}
      size="lg"
      footer={
        applicant && (
          <>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            {applicant.status !== 'Rejected' && (
              <Button variant="danger" onClick={() => onStatusChange(applicant, 'Rejected')}>
                Reject
              </Button>
            )}
            {applicant.status === 'New' && <Button onClick={() => onStatusChange(applicant, 'Shortlisted')}>Shortlist</Button>}
          </>
        )
      }
    >
      {applicant && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <ApplicantStatusBadge status={applicant.status} />
            <Badge tone="info">{applicant.match}% match</Badge>
          </div>

          <p className="rounded-xl border border-line bg-bg/50 p-4 text-sm text-ink-muted">
            {applicant.profileAvailable ? 'Candidate profile details are shown below. No resume is attached to this application.' : 'Candidate profile details are unavailable.'}
          </p>

          <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-ink-faint">Email</dt>
              <dd className="mt-1 text-ink">{applicant.email || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-faint">Education</dt>
              <dd className="mt-1 text-ink">{applicant.education || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-faint">Experience</dt>
              <dd className="mt-1 text-ink">{applicant.experience || 'Not provided'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs text-ink-faint">Summary</dt>
              <dd className="mt-1 text-ink-muted">{applicant.summary || 'No summary provided.'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs text-ink-faint">Skills</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {applicant.skills.length ? applicant.skills.map((skill) => (
                  <Badge key={skill} tone="brand">
                    {skill}
                  </Badge>
                )) : <span className="text-ink-faint">No skills listed.</span>}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </Modal>
  )
}
