import quiclogixLogo from '@/assets/quiclogix-logo.png'
import './Logo.css'

export interface LogoProps {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Surface treatment context */
  surface?: 'light' | 'dark' | 'auto'
  className?: string
}

export function Logo({
  size = 'md',
  surface = 'auto',
  className = '',
}: LogoProps) {
  const classes = [
    'quiclogix-logo',
    `quiclogix-logo--${size}`,
    `quiclogix-logo--${surface}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      <img
        src={quiclogixLogo}
        alt="Quiclogix Solutions"
        className="quiclogix-logo__img"
        width={761}
        height={195}
        loading="eager"
        decoding="async"
      />
    </div>
  )
}
