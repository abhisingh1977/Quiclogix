export interface BrandMarkProps {
  size?: number
  className?: string
  color?: string
}

/**
 * Quiclogix Geometric Brand Motif
 * A rectilinear, architectural Q monogram with connected precision path.
 */
export function BrandMark({ size = 28, className = '', color = 'currentColor' }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer Rectilinear Q Frame */}
      <rect
        x="3"
        y="3"
        width="22"
        height="22"
        rx="2"
        stroke={color}
        strokeWidth="2.5"
      />
      {/* Precision Internal Matrix Node */}
      <circle
        cx="14"
        cy="14"
        r="3"
        fill={color}
      />
      {/* Motion Transit Path (Q Tail) */}
      <path
        d="M17 17L28 28M24 28H28V24"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
