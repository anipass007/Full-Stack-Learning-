import { cn } from '../../lib/cn'

// Page section with a consistent width, spacing and heading block.
export default function Section({ id, title, description, badge, align = 'left', tone = 'default', className, children }) {
  return (
    <section id={id} className={cn('py-14 sm:py-20', tone === 'muted' && 'border-y border-line bg-surface/30', className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(title || description) && (
          <div className={cn('mb-10 max-w-2xl', align === 'center' && 'mx-auto text-center')}>
            <div className={cn('flex flex-wrap items-center gap-3', align === 'center' && 'justify-center')}>
              <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h2>
              {badge}
            </div>
            {description && <p className="mt-3 text-base text-ink-muted">{description}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
