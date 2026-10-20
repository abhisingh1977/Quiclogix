import { useEffect, useRef, useState } from 'react'
import './CursorAccent.css'

export function CursorAccent() {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return false
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return hasFinePointer && !prefersReducedMotion
  })

  const cursorRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: -100, y: -100 })
  const targetRef = useRef({ x: -100, y: -100 })
  const modeRef = useRef<'default' | 'text' | 'interactive'>('default')
  const visibleRef = useRef(false)

  useEffect(() => {
    const checkMedia = () => {
      const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      setEnabled(hasFinePointer && !prefersReducedMotion)
    }

    const hoverMq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')

    hoverMq.addEventListener('change', checkMedia)
    motionMq.addEventListener('change', checkMedia)

    return () => {
      hoverMq.removeEventListener('change', checkMedia)
      motionMq.removeEventListener('change', checkMedia)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    let animId: number
    const cursor = cursorRef.current

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX
      targetRef.current.y = e.clientY

      if (!visibleRef.current) {
        visibleRef.current = true
        posRef.current.x = e.clientX
        posRef.current.y = e.clientY
        if (cursor) {
          cursor.setAttribute('data-visible', 'true')
        }
      }

      const target = e.target as HTMLElement | null
      if (target && cursor) {
        const isInteractive = !!target.closest(
          'a, button, input, textarea, select, [role="button"], label[for], .navbar__theme-toggle, .navbar__hamburger'
        )
        const isText =
          !isInteractive &&
          !!target.closest(
            'p, h1, h2, h3, h4, h5, h6, li, span, dt, dd, blockquote, code, figcaption, article, label'
          )

        const nextMode = isInteractive ? 'interactive' : isText ? 'text' : 'default'
        if (modeRef.current !== nextMode) {
          modeRef.current = nextMode
          cursor.setAttribute('data-mode', nextMode)
        }
      }
    }

    const handleMouseLeave = () => {
      visibleRef.current = false
      if (cursor) {
        cursor.setAttribute('data-visible', 'false')
      }
    }

    const render = () => {
      // Smooth lerp follow
      const factor = 0.35
      posRef.current.x += (targetRef.current.x - posRef.current.x) * factor
      posRef.current.y += (targetRef.current.y - posRef.current.y) * factor

      if (cursor && visibleRef.current) {
        cursor.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`
      }
      animId = requestAnimationFrame(render)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    animId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animId)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      ref={cursorRef}
      className="cursor-accent"
      data-visible="false"
      data-mode="default"
      aria-hidden="true"
    />
  )
}
