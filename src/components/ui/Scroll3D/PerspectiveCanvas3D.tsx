import React, { useEffect, useRef } from 'react'
import './Scroll3D.css'

interface Point3D {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  size: number
}

export const PerspectiveCanvas3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    let mouseX = 0
    let mouseY = 0
    let targetMouseX = 0
    let targetMouseY = 0
    let scrollY = window.scrollY

    // Create 3D floating nodes
    const NODE_COUNT = Math.min(38, Math.floor(width / 35))
    const nodes: Point3D[] = []

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: (Math.random() - 0.5) * width * 1.4,
        y: (Math.random() - 0.5) * height * 1.4,
        z: Math.random() * 800 - 400,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        vz: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 2 + 1.2,
      })
    }

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / width - 0.5) * 120
      targetMouseY = (e.clientY / height - 0.5) * 120
    }

    const handleScroll = () => {
      scrollY = window.scrollY
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })

    const FOV = 650
    let angle = 0

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05
      mouseY += (targetMouseY - mouseY) * 0.05
      angle += 0.0015

      const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark'
      const goldRgb = '216, 180, 55'
      const accentRgb = isDarkMode ? goldRgb : '17, 22, 19'

      const cx = width / 2 + mouseX
      const cy = height / 2 + mouseY - (scrollY * 0.08) % (height * 0.5)

      // Project and draw nodes
      const projected: Array<{ px: number; py: number; scale: number; alpha: number }> = []

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]

        // Update 3D position
        node.x += node.vx
        node.y += node.vy
        node.z += node.vz

        // Wrap around 3D boundaries
        const boundX = width * 0.7
        const boundY = height * 0.7
        if (node.x < -boundX) node.x = boundX
        if (node.x > boundX) node.x = -boundX
        if (node.y < -boundY) node.y = boundY
        if (node.y > boundY) node.y = -boundY
        if (node.z < -400) node.z = 400
        if (node.z > 400) node.z = -400

        // Perspective projection
        const depth = FOV + node.z
        if (depth <= 0) continue

        const scale = FOV / depth
        const px = cx + node.x * scale
        const py = cy + node.y * scale
        const alpha = Math.max(0.04, Math.min(0.28, (node.z + 400) / 800 * (isDarkMode ? 0.32 : 0.16)))

        projected.push({ px, py, scale, alpha })

        // Draw individual 3D point
        ctx.beginPath()
        ctx.arc(px, py, node.size * scale, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${goldRgb}, ${alpha})`
        ctx.fill()
      }

      // Draw subtle connecting 3D wireframe lines between nearby nodes
      ctx.lineWidth = 0.75
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].px - projected[j].px
          const dy = projected[i].py - projected[j].py
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 130) {
            const lineAlpha = (1 - dist / 130) * Math.min(projected[i].alpha, projected[j].alpha) * (isDarkMode ? 0.6 : 0.35)
            ctx.beginPath()
            ctx.moveTo(projected[i].px, projected[i].py)
            ctx.lineTo(projected[j].px, projected[j].py)
            ctx.strokeStyle = `rgba(${accentRgb}, ${lineAlpha})`
            ctx.stroke()
          }
        }
      }

      animId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="perspective-canvas-container" aria-hidden="true">
      <canvas ref={canvasRef} className="perspective-canvas" />
    </div>
  )
}
