import type React from 'react'
import './Card.css'

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'outline' | 'glass'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hoverable?: boolean
  as?: 'div' | 'article' | 'section'
}

export function Card({
  variant = 'default',
  padding = 'md',
  hoverable = false,
  as: Component = 'div',
  children,
  className = '',
  ...props
}: CardProps) {
  const resolvedVariant = variant === 'outline' ? 'outlined' : variant
  const classes = [
    'card',
    `card--${resolvedVariant}`,
    `card--pad-${padding}`,
    hoverable ? 'card--hoverable' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  )
}

export function CardHeader({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`card__header ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardBody({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`card__body ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`card__footer ${className}`} {...props}>
      {children}
    </div>
  )
}
