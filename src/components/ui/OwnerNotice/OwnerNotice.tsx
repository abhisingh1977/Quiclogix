import type React from 'react'
import { Badge } from '@/components/ui/Badge'
import './OwnerNotice.css'

export interface OwnerNoticeProps {
  decisionId: string
  title: string
  description?: string
  children?: React.ReactNode
  variant?: 'inline' | 'block'
}

export function OwnerNotice({
  decisionId,
  title,
  description,
  children,
  variant = 'block',
}: OwnerNoticeProps) {
  if (variant === 'inline') {
    return (
      <span className="owner-notice-inline" data-decision-id={decisionId} title={title}>
        <span className="owner-notice-inline__tag">Notice</span>
        <span className="owner-notice-inline__text">{title}</span>
      </span>
    )
  }

  return (
    <div className="owner-notice-block" role="note" data-decision-id={decisionId} aria-label={title}>
      <div className="owner-notice-block__header">
        <Badge variant="accent" size="sm">
          Policy Disclosure
        </Badge>
      </div>
      <h4 className="owner-notice-block__title">{title}</h4>
      {description && <p className="owner-notice-block__desc">{description}</p>}
      {children && <div className="owner-notice-block__content">{children}</div>}
    </div>
  )
}
