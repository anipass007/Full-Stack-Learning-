import Button from '../../../components/ui/Button'

export default function CtaSection() {
  return (
    <section className="px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-3xl border border-brand/30 bg-surface px-6 py-12 text-center shadow-card sm:px-12">
        <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Start with your resume</h2>
        <p className="mx-auto mt-3 max-w-xl text-ink-muted">Create a student or recruiter account to use CareerAI. Admin access is provisioned by a trusted operator.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button to="/signup" size="lg">
            Create an account
          </Button>
          <Button to="/login" size="lg" variant="secondary">
            Log in
          </Button>
        </div>
      </div>
    </section>
  )
}
