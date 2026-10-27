import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Section from '../../../components/layout/Section'
import { faqs } from '../../../data/landing'
import { cn } from '../../../lib/cn'

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <Section id="faq" title="Frequently asked questions" description="Straight answers about what this demo does and does not do.">
      <div className="max-w-3xl divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
        {faqs.map((faq, index) => {
          const open = openIndex === index
          return (
            <div key={faq.question}>
              <h3>
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? -1 : index)}
                  aria-expanded={open}
                  aria-controls={`faq-panel-${index}`}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-ink transition-colors hover:bg-white/5 sm:text-base"
                >
                  {faq.question}
                  <ChevronDown
                    className={cn('h-4 w-4 shrink-0 text-ink-faint transition-transform duration-200', open && 'rotate-180')}
                    aria-hidden="true"
                  />
                </button>
              </h3>
              {open && (
                <div id={`faq-panel-${index}`} className="px-5 pb-5 text-sm text-ink-muted">
                  {faq.answer}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Section>
  )
}
