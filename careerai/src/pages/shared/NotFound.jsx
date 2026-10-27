import { SearchX } from 'lucide-react'
import EmptyState from '../../components/ui/EmptyState'
import Button from '../../components/ui/Button'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <EmptyState
        icon={SearchX}
        title="Page not found"
        description="This address does not match any page in CareerAI. Check the link or go back to the home page."
        action={<Button to="/">Go to home</Button>}
      />
    </div>
  )
}
