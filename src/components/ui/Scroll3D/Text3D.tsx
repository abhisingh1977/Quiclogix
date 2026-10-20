import React, { useMemo } from 'react'
import { motion, type HTMLMotionProps } from 'motion/react'
import './Scroll3D.css'

export interface Text3DProps {
  /** The text content to animate in 3D */
  children?: React.ReactNode
  /** Plain text string if children is not provided */
  text?: string
  /** HTML element type */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'
  /** Optional HTML id attribute */
  id?: string
  /** Additional CSS class names */
  className?: string
  /** Variant shorthand (e.g. 'gradient') */
  variant?: 'default' | 'gradient' | string
  /** Stagger delay between words in seconds (default: 0.035) */
  stagger?: number
  /** Initial delay before animation starts (default: 0) */
  delay?: number
  /** Intensity of 3D tilt on scroll-in (default: 'medium') */
  depth?: 'subtle' | 'medium' | 'deep'
  /** Apply signature gold/metallic 3D gradient */
  gradient?: boolean
  /** Apply light-catching metallic sheen animation */
  sheen?: boolean
  /** Whether animation fires only once or on each scroll entry (default: true) */
  once?: boolean
}

export const Text3D: React.FC<Text3DProps> = ({
  children,
  text,
  as = 'h2',
  id,
  className = '',
  variant,
  stagger = 0.035,
  delay = 0,
  depth = 'medium',
  gradient = false,
  sheen = false,
  once = true,
}) => {
  const isGradient = gradient || variant === 'gradient'
  const contentString = useMemo(() => {
    if (typeof text === 'string') return text
    if (typeof children === 'string') return children
    return ''
  }, [text, children])

  // Split into words if plain text is available
  const words = useMemo(() => {
    if (!contentString) return []
    return contentString.split(/\s+/).filter(Boolean)
  }, [contentString])

  // 3D rotation and depth parameters based on depth prop
  const depthConfig = useMemo(() => {
    switch (depth) {
      case 'subtle':
        return { rotateX: 28, y: 22, z: -25, blur: '2px' }
      case 'deep':
        return { rotateX: 65, y: 44, z: -60, blur: '6px' }
      case 'medium':
      default:
        return { rotateX: 45, y: 32, z: -40, blur: '4px' }
    }
  }, [depth])

  // If complex JSX children are passed, animate the container as a 3D block
  if (!words.length && children) {
    const Component = motion.create(as as keyof HTMLElementTagNameMap) as React.ComponentType<HTMLMotionProps<any>>
    return (
      <Component
        id={id}
        className={`perspective-container ${isGradient ? 'text-3d-gradient' : ''} ${sheen ? 'text-3d-sheen' : ''} ${className}`}
        initial={{
          opacity: 0,
          y: depthConfig.y,
          rotateX: depthConfig.rotateX,
          z: depthConfig.z,
          filter: `blur(${depthConfig.blur})`,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
          rotateX: 0,
          z: 0,
          filter: 'blur(0px)',
        }}
        viewport={{ once, margin: '-50px' }}
        transition={{
          duration: 0.75,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}
      </Component>
    )
  }

  const Tag = as

  return (
    <Tag
      id={id}
      className={`perspective-container ${isGradient ? 'text-3d-gradient' : ''} ${sheen ? 'text-3d-sheen' : ''} ${className}`}
      aria-label={contentString}
    >
      <span aria-hidden="true" style={{ display: 'inline' }}>
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="text-3d-word-wrap">
            <motion.span
              className="text-3d-word"
              initial={{
                opacity: 0,
                y: depthConfig.y,
                rotateX: depthConfig.rotateX,
                rotateY: (i % 2 === 0 ? -1 : 1) * 6,
                z: depthConfig.z,
                filter: `blur(${depthConfig.blur})`,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                rotateX: 0,
                rotateY: 0,
                z: 0,
                filter: 'blur(0px)',
              }}
              viewport={{ once, margin: '-40px' }}
              transition={{
                duration: 0.65,
                delay: delay + i * stagger,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </span>
    </Tag>
  )
}
