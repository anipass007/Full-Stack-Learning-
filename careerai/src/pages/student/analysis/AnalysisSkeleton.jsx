import Card from '../../../components/ui/Card'
import Skeleton from '../../../components/ui/Skeleton'

export default function AnalysisSkeleton() {
  return (
    <div className="space-y-5" role="status" aria-label="Analysing resume">
      <Card>
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[auto_1fr]">
          <Skeleton className="mx-auto h-44 w-44 rounded-full" />
          <div className="space-y-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <Skeleton key={item} className="h-40 w-full rounded-2xl" />
        ))}
      </div>
      <p className="text-center text-sm text-ink-muted">Saving analysis results...</p>
    </div>
  )
}
