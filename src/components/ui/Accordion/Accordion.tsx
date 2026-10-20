import { useState } from 'react'
import type React from 'react'
import './Accordion.css'

export interface AccordionItem {
  id: string
  title: string
  content: React.ReactNode
}

export interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  className?: string
}

export function Accordion({ items, allowMultiple = false, className = '' }: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>(items.length > 0 ? [items[0].id] : [])

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
      )
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]))
    }
  }

  return (
    <div className={`accordion ${className}`}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id)
        return (
          <div
            key={item.id}
            className={`accordion__item ${isOpen ? 'accordion__item--open' : ''}`}
          >
            <button
              type="button"
              className="accordion__trigger"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
              id={`accordion-trigger-${item.id}`}
            >
              <span className="accordion__title">{item.title}</span>
              <svg
                className={`accordion__chevron ${isOpen ? 'accordion__chevron--open' : ''}`}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <div
              id={`accordion-content-${item.id}`}
              role="region"
              aria-labelledby={`accordion-trigger-${item.id}`}
              className={`accordion__content ${isOpen ? 'accordion__content--open' : ''}`}
              hidden={!isOpen}
            >
              <div className="accordion__body">{item.content}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
