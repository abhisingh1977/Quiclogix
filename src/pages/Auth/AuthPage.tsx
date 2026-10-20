// AuthPage.tsx — Quiclogix Solutions Applicant Authentication
// Provides sign in, registration, magic links, and local evaluation mode.

import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { getHashParams } from '@/hooks/useNavigation'
import { getDomainBySlug } from '@/data/internshipDomains'
import './AuthPage.css'

export type AuthMode = 'signin' | 'signup'

export function AuthPage() {
  const { user, signInWithPassword, signUpWithPassword, enableDemoUser, isConfigured } = useAuth()
  
  // Initialize mode from URL hash or query params
  const [mode, setMode] = useState<AuthMode>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase()
      if (hash.includes('signup') || hash.includes('register')) return 'signup'
      if (hash.includes('login') || hash.includes('signin')) return 'signin'
      const params = getHashParams()
      if (params.mode === 'signup') return 'signup'
    }
    return 'signin'
  })

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const hashParams = getHashParams()
  const redirectTarget = hashParams.redirect
  const domainParam = hashParams.domain
  const targetDomain = domainParam ? getDomainBySlug(domainParam) : undefined

  // Listen to hash changes in case user navigates to #signup or #login
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase()
      if (hash.includes('signup') || hash.includes('register')) {
        setMode('signup')
        setErrorMessage(null)
      } else if (hash.includes('login') || hash.includes('signin')) {
        setMode('signin')
        setErrorMessage(null)
      }
    }
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  const getPostAuthUrl = useCallback(() => {
    if (redirectTarget === 'apply') {
      return domainParam ? `#apply?domain=${encodeURIComponent(domainParam)}` : '#apply'
    }
    return '#portal'
  }, [redirectTarget, domainParam])

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      window.location.hash = getPostAuthUrl()
    }
  }, [user, getPostAuthUrl])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)
    setIsSubmitting(true)

    try {
      if (mode === 'signin') {
        if (!email.trim() || !password) {
          setErrorMessage('Please enter both your email address and password.')
          setIsSubmitting(false)
          return
        }
        const { error } = await signInWithPassword(email.trim(), password)
        if (error) {
          setErrorMessage(error.message)
        } else {
          window.location.hash = getPostAuthUrl()
        }
      } else if (mode === 'signup') {
        if (!fullName.trim()) {
          setErrorMessage('Please enter your full legal name.')
          setIsSubmitting(false)
          return
        }
        if (!email.trim()) {
          setErrorMessage('Please enter a valid email address.')
          setIsSubmitting(false)
          return
        }
        if (password.length < 6) {
          setErrorMessage('Password must be at least 6 characters in length.')
          setIsSubmitting(false)
          return
        }
        if (password !== confirmPassword) {
          setErrorMessage('Passwords do not match. Please verify both entries.')
          setIsSubmitting(false)
          return
        }
        const res = await signUpWithPassword(email.trim(), password, fullName.trim())
        if (res.error) {
          setErrorMessage(res.error.message)
        } else if (res.requiresConfirmation) {
          setSuccessMessage(
            'Account created successfully! Please check your email to confirm your account before logging in.'
          )
        } else {
          setSuccessMessage('Account created successfully! Proceeding...')
          setTimeout(() => {
            window.location.hash = getPostAuthUrl()
          }, 1200)
        }
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected authentication error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDemoLogin = (role: 'applicant' | 'reviewer' | 'admin') => {
    enableDemoUser(role)
    window.location.hash = getPostAuthUrl()
  }

  const renderPasswordToggle = (isVisible: boolean, toggle: () => void, labelText: string) => (
    <button
      type="button"
      className="auth-password-toggle"
      onClick={toggle}
      aria-label={isVisible ? `Hide ${labelText}` : `Show ${labelText}`}
      title={isVisible ? `Hide ${labelText}` : `Show ${labelText}`}
    >
      {isVisible ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  )

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-card">
            {/* Header */}
            <div className="auth-header">
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '9999px',
                background: isConfigured ? 'rgba(30, 107, 71, 0.1)' : 'rgba(163, 98, 0, 0.1)',
                border: `1px solid ${isConfigured ? 'rgba(30, 107, 71, 0.3)' : 'rgba(163, 98, 0, 0.3)'}`,
                fontSize: 'var(--text-2xs, 12.5px)',
                fontWeight: 600,
                color: isConfigured ? 'var(--color-success, #1e6b47)' : 'var(--color-warning, #a36200)',
                margin: '0 auto var(--space-3)',
              }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: isConfigured ? 'var(--color-success, #1e6b47)' : 'var(--color-warning, #a36200)',
                }} />
                {isConfigured ? 'Supabase Connected' : 'Local Offline Sandbox'}
              </div>
              <br />
              <span className="auth-header__tag">Secure Access</span>
              <h1 className="auth-header__title">
                {mode === 'signin' ? 'Sign in to Quiclogix' : 'Create your account'}
              </h1>
              <p className="auth-header__subtitle">
                {mode === 'signin'
                  ? 'Access your internship applications, cohort progress, and reviews.'
                  : 'Register to begin your internship journey across our 19 engineering domains.'}
              </p>

              {targetDomain && (
                <div style={{
                  marginTop: 'var(--space-3)',
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text)',
                }}>
                  <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>Selected Track:</span>
                  <strong>{targetDomain.name}</strong>
                  <span style={{ color: 'var(--color-text-muted)' }}>({targetDomain.tag})</span>
                </div>
              )}
            </div>

            {/* Notifications */}
            {errorMessage && (
              <div className="auth-form__error" role="alert">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="auth-form__success" role="status">
                {successMessage}
              </div>
            )}

            {/* Form */}
            <form className="auth-form" onSubmit={handleSubmit}>
              {mode === 'signup' && (
                <Input
                  id="auth-full-name"
                  label="Full Name"
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              )}

              <Input
                id="auth-email"
                label="Email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {mode === 'signin' && (
                <Input
                  id="auth-password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  rightIcon={renderPasswordToggle(showPassword, () => setShowPassword(!showPassword), 'password')}
                />
              )}

              {mode === 'signup' && (
                <>
                  <Input
                    id="auth-password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    helperText="Must be at least 6 characters"
                    rightIcon={renderPasswordToggle(showPassword, () => setShowPassword(!showPassword), 'password')}
                  />

                  <Input
                    id="auth-confirm-password"
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Create a strong password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    rightIcon={renderPasswordToggle(showConfirmPassword, () => setShowConfirmPassword(!showConfirmPassword), 'confirm password')}
                  />
                </>
              )}

              <div className="auth-form__footer">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? 'Processing...'
                    : mode === 'signin'
                    ? 'Login'
                    : 'Register'}
                </Button>

                {/* Direct switch links beneath the form */}
                {mode === 'signin' && (
                  <div className="auth-switch-prompt">
                    <span>New here? </span>
                    <button
                      type="button"
                      className="auth-link-btn"
                      onClick={() => {
                        setMode('signup')
                        setErrorMessage(null)
                        setSuccessMessage(null)
                      }}
                    >
                      Register now
                    </button>
                  </div>
                )}

                {mode === 'signup' && (
                  <div className="auth-switch-prompt">
                    <span>Already have an account? </span>
                    <button
                      type="button"
                      className="auth-link-btn"
                      onClick={() => {
                        setMode('signin')
                        setErrorMessage(null)
                        setSuccessMessage(null)
                      }}
                    >
                      Login
                    </button>
                  </div>
                )}
              </div>
            </form>

            {/* Developer / Reviewer Demo Access Box */}
            <div className="auth-demo-box">
              <div className="auth-demo-box__title">
                {isConfigured ? 'Reviewer Preview Mode' : 'Local Development Sandbox'}
              </div>
              <p className="auth-demo-box__desc">
                {isConfigured
                  ? 'Sign in above with Supabase credentials or explore the applicant portal in instant preview mode.'
                  : 'Local sandbox mode active. You can enter any email and password above to sign in or register, or click below for instant access.'}
              </p>
              <div className="auth-demo-actions">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDemoLogin('applicant')}
                >
                  Enter as Applicant
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDemoLogin('reviewer')}
                >
                  Explore as Reviewer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
