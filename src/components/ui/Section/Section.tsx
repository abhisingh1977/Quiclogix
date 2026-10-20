import type React from 'react'
import './Section.css'

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Section heading — rendered as h2 */
  title?: string
  /** Subheading text below the title */
  subtitle?: string
  /** Section category identifier / metadata tag */
  tag?: string
  /** Visual spacing density */
  spacing?: 'default' | 'compact' | 'spacious' | 'normal'
  /** Background theme */
  theme?: 'paper' | 'white' | 'dark'
  /** Background treatment (legacy alias) */
  variant?: 'default' | 'alternate' | 'accent' | 'secondary' | 'paper' | 'white' | 'dark'
  /** Background alias */
  background?: 'default' | 'alternate' | 'accent' | 'secondary' | 'paper' | 'white' | 'dark'
  /** Center the title and subtitle */
  centered?: boolean
}

export function Section({
  title,
  subtitle,
  tag,
  spacing = 'default',
  theme,
  variant,
  background,
  centered = false,
  children,
  className = '',
  ...props
}: SectionProps) {
  const resolvedSpacing = spacing === 'normal' ? 'default' : spacing
  let resolvedTheme = theme || background || variant || 'paper'

  if (resolvedTheme === 'default') resolvedTheme = 'paper'
  if (resolvedTheme === 'secondary' || resolvedTheme === 'alternate') resolvedTheme = 'white'

  const classes = [
    'section-block',
    `section-${resolvedTheme}`,
    `section-block--${resolvedSpacing}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section className={classes} {...props}>
      <div className="container">
        {(title || subtitle || tag) && (
          <div className={`editorial-header ${centered ? 'editorial-header--centered' : ''}`}>
            {tag && <div className="editorial-tag">{tag}</div>}
            {title && <h2 className="editorial-title">{title}</h2>}
            {subtitle && <p className="editorial-subtitle">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
