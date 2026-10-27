import { Component } from 'react'
import { AlertTriangle } from 'lucide-react'
import EmptyState from '../ui/EmptyState'
import Button from '../ui/Button'

// Shows a readable message instead of a blank screen if a page crashes while rendering.
export default class ErrorBoundary extends Component {
  static defaultProps = { standalone: true }

  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('CareerAI page error:', error, info?.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    const content = (
      <div className={this.props.standalone ? 'mx-auto max-w-2xl px-4 py-20' : 'mx-auto max-w-2xl py-12'}>
        <EmptyState
          icon={AlertTriangle}
          tone="danger"
          title="Something went wrong on this page"
          description="The rest of the app is fine. Reload the page, or go back to the home page. If it keeps happening, resetting the demo data usually fixes it."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={() => window.location.reload()}>Reload page</Button>
              <a
                href="/"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-line bg-surface px-4 text-sm font-medium text-ink transition-colors hover:bg-surface-raised"
              >
                Go to home
              </a>
            </div>
          }
        />
      </div>
    )
    return this.props.standalone ? (
      <main id="main" tabIndex={-1} className="focus:outline-none">
        {content}
      </main>
    ) : (
      content
    )
  }
}
