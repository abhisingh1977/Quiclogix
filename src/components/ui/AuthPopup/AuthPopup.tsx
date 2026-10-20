import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import './AuthPopup.css'

const STORAGE_KEY = 'qlx_auth_popup_dismissed'
const DELAY_MS = 6000

export interface AuthPopupProps {
  currentPage: string
}

export function AuthPopup({ currentPage }: AuthPopupProps) {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Pages where popup must NOT appear
  const isExcludedPage =
    currentPage === 'auth' ||
    currentPage === 'apply' ||
    currentPage === 'portal'

  const dismiss = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true')
    } catch {
      // sessionStorage unavailable in restricted environments
    }
    setIsOpen(false)
  }, [])

  // Check dismissal or existing auth state
  const isDismissedOrAuth = useCallback(() => {
    if (user) return true
    try {
      return sessionStorage.getItem(STORAGE_KEY) === 'true'
    } catch {
      return false
    }
  }, [user])

  // Timer logic
  useEffect(() => {
    if (isDismissedOrAuth() || isExcludedPage) {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      return
    }

    // Only start timer if not already running and modal not open
    if (!timerRef.current && !isOpen) {
      timerRef.current = setTimeout(() => {
        // Re-check conditions at moment of trigger
        if (!isDismissedOrAuth() && !isExcludedPage) {
          previouslyFocusedElementRef.current = document.activeElement as HTMLElement
          setIsOpen(true)
        }
      }, DELAY_MS)
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isDismissedOrAuth, isExcludedPage, isOpen])

  // Close if user is authenticated
  useEffect(() => {
    if (user) {
      setIsOpen(false)
    }
  }, [user])

  // Scroll lock and focus management
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'

      // Focus close button smoothly
      const focusTimer = setTimeout(() => {
        closeBtnRef.current?.focus()
      }, 50)

      return () => {
        document.body.style.overflow = originalOverflow
        clearTimeout(focusTimer)
        if (previouslyFocusedElementRef.current && previouslyFocusedElementRef.current.focus) {
          previouslyFocusedElementRef.current.focus()
        }
      }
    }
  }, [isOpen])

  // Keyboard navigation: Escape key closes modal & Tab trap
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        dismiss()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, dismiss])

  const handleAction = (mode: 'signin' | 'signup') => {
    dismiss()
    window.location.hash = `#auth?mode=${mode}`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="auth-popup-backdrop"
          onClick={dismiss}
          role="presentation"
        >
          <motion.div
            className="auth-popup-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-popup-title"
            aria-describedby="auth-popup-desc"
            onClick={(e) => e.stopPropagation()} // Prevent accidental close on card click
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Mandatory Accessible Close Cross (✕) Button */}
            <button
              ref={closeBtnRef}
              type="button"
              className="auth-popup-close"
              onClick={dismiss}
              aria-label="Close login popup"
              title="Close login popup"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Content Accent Pill */}
            <div className="auth-popup-badge">
              <span className="auth-popup-badge__dot" aria-hidden="true" />
              <span>Quiclogix Platform</span>
            </div>

            {/* Required Headline & Copy */}
            <h2 id="auth-popup-title" className="auth-popup-title">
              Your next opportunity starts here.
            </h2>
            <p id="auth-popup-desc" className="auth-popup-desc">
              Explore opportunities with Quiclogix Solutions. Sign in to continue or create an account to get started.
            </p>

            {/* Required Actions: Login & Register Now */}
            <div className="auth-popup-actions">
              <Button
                variant="primary"
                size="md"
                onClick={() => handleAction('signin')}
                className="auth-popup-btn"
              >
                Login
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => handleAction('signup')}
                className="auth-popup-btn"
              >
                Register Now
              </Button>
            </div>

            {/* Subtle continue browsing hint */}
            <div className="auth-popup-footer">
              <button
                type="button"
                className="auth-popup-dismiss-link"
                onClick={dismiss}
              >
                Continue exploring as visitor
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
