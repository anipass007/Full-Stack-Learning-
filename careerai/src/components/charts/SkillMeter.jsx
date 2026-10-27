import { cn } from '../../lib/cn'

// Shows current skill level as a bar with a marker at the level the role needs.
export default function SkillMeter({ label, current, required }) {
  const met = current >= required - 5
  const fill = met ? 'bg-success' : current >= required * 0.6 ? 'bg-accent' : 'bg-warning'
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-ink">{label}</span>
        <span className="text-ink-muted">
          {current}% <span className="text-ink-faint">of {required}% needed</span>
        </span>
      </div>
      <div
        role="img"
        aria-label={`${label}: ${current} percent, role needs ${required} percent`}
        className="relative h-2.5 w-full rounded-full bg-white/8"
      >
        <div className={cn('h-full rounded-full transition-[width] duration-500', fill)} style={{ width: `${current}%` }} />
        <span className="absolute -top-1 w-0.5 rounded bg-ink" style={{ left: `${required}%`, height: '18px' }} aria-hidden="true" />
      </div>
    </div>
  )
}
