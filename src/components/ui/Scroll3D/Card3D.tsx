import React, { useRef, useState, useCallback } from 'react'
import { motion } from 'motion/react'
import './Scroll3D.css'

export interface Card3DProps {
  children: React.ReactNode
  className?: string
  innerClassName?: string
  /** Tilt depth preset or custom degree */
  depth?: 'subtle' | 'standard' | 'medium' | 'deep' | number
  maxTilt?: number
  glare?: boolean
  delay?: number
  onClick?: () => void
  style?: React.CSSProperties
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  className = '',
  innerClassName = '',
  depth,
  maxTilt,
  glare = true,
  delay = 0,
  onClick,
  style,
}) => {
  // Resolve tilt limit based on depth or maxTilt
  const effectiveMaxTilt = React.useMemo(() => {
    if (typeof maxTilt === 'number') return maxTilt
    if (typeof depth === 'number') return depth
    switch (depth) {
      case 'subtle':
        return 4
      case 'deep':
        return 14
      case 'standard':
      case 'medium':
      default:
        return 8
    }
  }, [depth, maxTilt])

  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      const width = rect.width
      const height = rect.height

      // Relative coordinates from -1 to 1
      const mouseX = (e.clientX - rect.left) / width - 0.5
      const mouseY = (e.clientY - rect.top) / height - 0.5

      // Invert Y for natural perspective tilt
      const rotateX = -mouseY * effectiveMaxTilt * 2
      const rotateY = mouseX * effectiveMaxTilt * 2

      setTilt({ x: rotateX, y: rotateY })
      setGlarePos({
        x: Math.round(((e.clientX - rect.left) / width) * 100),
        y: Math.round(((e.clientY - rect.top) / height) * 100),
      })
    },
    [effectiveMaxTilt]
  )

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setTilt({ x: 0, y: 0 })
  }, [])

  return (
    <motion.div
      ref={cardRef}
      className={`card-3d-wrapper ${className}`}
      initial={{ opacity: 0, y: 35, rotateX: 18, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={style}
    >
      <div
        className={`card-3d-inner ${isHovered ? 'card-3d-hovered' : ''} ${innerClassName}`}
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(12px) scale(1.015)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)',
        }}
      >
        {glare && (
          <div
            className="card-3d-glare"
            style={{
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(216, 180, 55, 0.18) 0%, transparent 65%)`,
            }}
          />
        )}
        {children}
      </div>
    </motion.div>
  )
}
