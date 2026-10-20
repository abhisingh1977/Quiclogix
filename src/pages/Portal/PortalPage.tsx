// PortalPage.tsx — Quiclogix Solutions Applicant Dashboard
// Displays applicant status, active applications, progress stepper, and profile management.

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { supabase } from '@/lib/supabase/client'
import type { ApplicationStatus } from '@/types/database.types'
import { getDomainById } from '@/data/internshipDomains'
import './PortalPage.css'

export interface ApplicationRecord {
  id: string
  applicant_id: string
  cohort_id: string
  domain_id: string
  status: ApplicationStatus
  submitted_at: string | null
  reviewed_at: string | null
  decision_note: string | null
  created_at: string
  updated_at: string
  domain_name?: string
  cohort_name?: string
  education_or_experience?: string
  portfolio_url?: string
  resume_path?: string
  skills?: string[]
}

const DEMO_APP_STORAGE_KEY = 'qlx_demo_application'
const DEMO_APPS_STORAGE_KEY = 'qlx_demo_applications_v2'

export function PortalPage() {
  const { user, profile, roles, signOut, updateProfile, isDemoMode } = useAuth()
  const [application, setApplication] = useState<ApplicationRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [editFullName, setEditFullName] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileFeedback, setProfileFeedback] = useState<string | null>(null)

  // Redirect to Auth if not logged in
  useEffect(() => {
    if (!user) {
      window.location.hash = '#auth'
    }
  }, [user])

  // Fetch application record on mount or user change
  useEffect(() => {
    let isMounted = true
    if (!user) return

    const loadData = async () => {
      // Demo mode: read from localStorage
      if (isDemoMode) {
        const rawV2 = localStorage.getItem(DEMO_APPS_STORAGE_KEY)
        if (rawV2) {
          try {
            const apps = JSON.parse(rawV2)
            if (Array.isArray(apps) && apps.length > 0) {
              const latest = apps[apps.length - 1]
              const domainInfo = getDomainById(latest.domain_id)
              const mapped: ApplicationRecord = {
                id: latest.id,
                applicant_id: user.id,
                cohort_id: '33333333-3333-3333-3333-333333333301',
                domain_id: latest.domain_id,
                domain_name: domainInfo?.name || 'Selected Track',
                cohort_name: 'Upcoming Studio Cohort',
                status: latest.status,
                submitted_at: latest.submitted_at,
                reviewed_at: null,
                decision_note: null,
                education_or_experience: latest.course_or_degree ? `${latest.course_or_degree}${latest.branch_specialization ? ` (${latest.branch_specialization})` : ''} • ${latest.institution_name}` : undefined,
                skills: typeof latest.skills === 'string' ? latest.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : latest.skills,
                portfolio_url: latest.portfolio_url,
                resume_path: latest.resume_path,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }
              if (isMounted) setApplication(mapped)
              if (isMounted) setIsLoading(false)
              return
            }
          } catch {
            // fallback
          }
        }

        const saved = localStorage.getItem(DEMO_APP_STORAGE_KEY)
        if (saved) {
          try {
            const parsed = JSON.parse(saved)
            parsed.domain_name = getDomainById(parsed.domain_id)?.name || parsed.domain_name || 'Selected Track'
            if (isMounted) setApplication(parsed)
          } catch {
            if (isMounted) setApplication(null)
          }
        } else {
          const initialDemo: ApplicationRecord = {
            id: '44444444-4444-4444-4444-444444444401',
            applicant_id: user.id,
            cohort_id: '33333333-3333-3333-3333-333333333301',
            domain_id: '11111111-1111-1111-1111-111111111101',
            domain_name: 'App Development',
            cohort_name: 'Cohort 2026-Alpha (Preview Template)',
            status: 'draft',
            submitted_at: null,
            reviewed_at: null,
            decision_note: null,
            education_or_experience: 'B.Tech Computer Science, 3rd Year • National Institute of Technology',
            skills: ['Flutter', 'Dart', 'State Management'],
            portfolio_url: 'https://github.com/example/mobile-projects',
            resume_path: `${user.id}/44444444-4444-4444-4444-444444444401/resume.pdf`,
            created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
            updated_at: new Date().toISOString(),
          }
          localStorage.setItem(DEMO_APP_STORAGE_KEY, JSON.stringify(initialDemo))
          if (isMounted) setApplication(initialDemo)
        }
        if (isMounted) setIsLoading(false)
        return
      }

      // Live Supabase lookup
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('applications')
            .select(`
              *,
              internship_domains (name),
              cohorts (name),
              application_details (education_or_experience, course_or_degree, branch_specialization, institution_name, portfolio_url, resume_path, skills)
            `)
            .eq('applicant_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()

          if (!error && data && isMounted) {
            const details = (data as any).application_details
            const eduFormatted = details?.course_or_degree
              ? `${details.course_or_degree}${details.branch_specialization ? ` (${details.branch_specialization})` : ''} • ${details.institution_name || ''}`
              : details?.education_or_experience

            const formatted: ApplicationRecord = {
              id: data.id,
              applicant_id: data.applicant_id,
              cohort_id: data.cohort_id,
              domain_id: data.domain_id,
              status: data.status,
              submitted_at: data.submitted_at,
              reviewed_at: data.reviewed_at,
              decision_note: data.decision_note,
              created_at: data.created_at,
              updated_at: data.updated_at,
              domain_name: (data as any).internship_domains?.name || getDomainById(data.domain_id)?.name || 'Selected Track',
              cohort_name: (data as any).cohorts?.name || 'Upcoming Cohort',
              education_or_experience: eduFormatted,
              portfolio_url: details?.portfolio_url,
              resume_path: details?.resume_path,
              skills: details?.skills,
            }
            setApplication(formatted)
          } else if (isMounted) {
            setApplication(null)
          }
        } catch (err) {
          console.warn('Error loading application record:', err)
        } finally {
          if (isMounted) setIsLoading(false)
        }
      } else {
        if (isMounted) setIsLoading(false)
      }
    }

    void loadData()

    return () => {
      isMounted = false
    }
  }, [isDemoMode, user])

  const openProfileModal = () => {
    setEditFullName(profile?.full_name || '')
    setEditPhone(profile?.phone || '')
    setIsEditProfileOpen(true)
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileSaving(true)
    setProfileFeedback(null)

    const { error } = await updateProfile({
      full_name: editFullName.trim(),
      phone: editPhone.trim() || null,
    })

    setProfileSaving(false)
    if (error) {
      setProfileFeedback(`Update failed: ${error.message}`)
    } else {
      setProfileFeedback('Profile updated successfully.')
      setTimeout(() => {
        setIsEditProfileOpen(false)
        setProfileFeedback(null)
      }, 1000)
    }
  }

  // Visual status badge
  const renderStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'accepted':
        return <Badge variant="success">Accepted</Badge>
      case 'rejected':
        return <Badge variant="error">Rejected</Badge>
      case 'under_review':
        return <Badge variant="warning">Under Review</Badge>
      case 'submitted':
        return <Badge variant="info">Submitted</Badge>
      case 'withdrawn':
        return <Badge variant="default">Withdrawn</Badge>
      case 'draft':
      default:
        return <Badge variant="accent">Draft Saved</Badge>
    }
  }

  // Stepper state computation
  const getStepProgress = (status: ApplicationStatus) => {
    switch (status) {
      case 'accepted':
      case 'rejected':
        return 4
      case 'under_review':
        return 3
      case 'submitted':
        return 2
      case 'draft':
      default:
        return 1
    }
  }

  const currentStep = application ? getStepProgress(application.status) : 0

  return (
    <div className="portal-page">
      <div className="container">
        {/* Portal Header */}
        <div className="portal-header">
          <div className="portal-header__welcome">
            <div className="portal-header__badge-row">
              <span className="portal-header__tag">Applicant Space</span>
              <Badge variant="accent">
                {roles[0]?.toUpperCase() || 'APPLICANT'}
              </Badge>
              {isDemoMode && (
                <Badge variant="warning">Demo Sandbox Mode</Badge>
              )}
            </div>
            <h1 className="portal-header__title">
              Welcome back, {profile?.full_name || 'Participant'}
            </h1>
            <p className="portal-header__subtitle">
              Manage your internship intake application, profile details, and track selection.
            </p>
          </div>

          <div className="portal-header__controls">
            <Button
              variant="secondary"
              size="sm"
              onClick={openProfileModal}
            >
              Edit Profile
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Portal Content Grid */}
        <div className="portal-grid">
          {/* Main Column */}
          <div className="portal-main">
            {isLoading ? (
              <div className="portal-app-card" style={{ textAlign: 'center', padding: '48px 0' }}>
                <p style={{ color: 'var(--color-text-muted)' }}>Loading application details...</p>
              </div>
            ) : application ? (
              <div className="portal-app-card">
                <div className="portal-app-card__header">
                  <div>
                    <h2 className="portal-app-card__track">
                      {application.domain_name || 'Selected Practice Track'}
                    </h2>
                    <div className="portal-app-card__cohort">
                      {application.cohort_name || 'Cohort 2026-Alpha'} • Initiated {new Date(application.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  {renderStatusBadge(application.status)}
                </div>

                {/* Progress Stepper */}
                <div className="portal-stepper" aria-label="Application Progress">
                  <div className={`portal-step ${currentStep >= 1 ? (currentStep > 1 ? 'portal-step--completed' : 'portal-step--active') : ''}`}>
                    <div className="portal-step__dot">1</div>
                    <span className="portal-step__label">Draft</span>
                  </div>
                  <div className={`portal-step ${currentStep >= 2 ? (currentStep > 2 ? 'portal-step--completed' : 'portal-step--active') : ''}`}>
                    <div className="portal-step__dot">2</div>
                    <span className="portal-step__label">Submitted</span>
                  </div>
                  <div className={`portal-step ${currentStep >= 3 ? (currentStep > 3 ? 'portal-step--completed' : 'portal-step--active') : ''}`}>
                    <div className="portal-step__dot">3</div>
                    <span className="portal-step__label">Review</span>
                  </div>
                  <div className={`portal-step ${currentStep >= 4 ? 'portal-step--completed' : ''}`}>
                    <div className="portal-step__dot">4</div>
                    <span className="portal-step__label">Decision</span>
                  </div>
                </div>

                {/* Key Summary Details */}
                <div className="portal-details-grid">
                  <div className="portal-detail-item">
                    <div className="portal-detail-item__label">Application ID</div>
                    <div className="portal-detail-item__value" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                      {application.id.slice(0, 8)}...{application.id.slice(-4)}
                    </div>
                  </div>
                  <div className="portal-detail-item">
                    <div className="portal-detail-item__label">Status Phase</div>
                    <div className="portal-detail-item__value" style={{ textTransform: 'capitalize' }}>
                      {application.status.replace('_', ' ')}
                    </div>
                  </div>
                  <div className="portal-detail-item">
                    <div className="portal-detail-item__label">Portfolio / GitHub</div>
                    <div className="portal-detail-item__value">
                      {application.portfolio_url ? (
                        <a href={application.portfolio_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent-text)', textDecoration: 'underline' }}>
                          View Link
                        </a>
                      ) : (
                        'Not provided'
                      )}
                    </div>
                  </div>
                  <div className="portal-detail-item">
                    <div className="portal-detail-item__label">Resume File</div>
                    <div className="portal-detail-item__value">
                      {application.resume_path ? 'resume.pdf (Attached)' : 'Pending upload'}
                    </div>
                  </div>
                </div>

                {/* Decision Note or Review Notification */}
                {application.decision_note && (
                  <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--color-accent)' }}>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Review Team Note
                    </div>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                      {application.decision_note}
                    </div>
                  </div>
                )}

                {/* Action CTA */}
                <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                  {application.status === 'draft' ? (
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => { window.location.hash = `#apply?domain=${encodeURIComponent(application.domain_id)}` }}
                    >
                      Continue Application &rarr;
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => { window.location.hash = `#apply?domain=${encodeURIComponent(application.domain_id)}` }}
                    >
                      View Submitted Application
                    </Button>
                  )}
                  <a href="#internship">
                    <Button variant="secondary" size="md">
                      Browse 19 Domains
                    </Button>
                  </a>
                </div>
              </div>
            ) : (
              <div className="portal-empty-card">
                <h2 className="portal-empty-card__title">Ready to begin your internship application?</h2>
                <p className="portal-empty-card__desc">
                  Explore all 19 available technical domains on the Internship tab, choose your specialization, and submit your application.
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a href="#internship">
                    <Button variant="primary" size="md">
                      Explore 19 Domains &rarr;
                    </Button>
                  </a>
                  <a href="#apply">
                    <Button variant="secondary" size="md">
                      Open Application Form
                    </Button>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="portal-sidebar">
            {/* Applicant Profile Card */}
            <div className="portal-sidebar-card">
              <h3 className="portal-sidebar-card__title">Applicant Profile</h3>
              <div className="portal-profile-row">
                <span className="portal-profile-row__label">Full Legal Name</span>
                <span className="portal-profile-row__value">{profile?.full_name || 'Not provided'}</span>
              </div>
              <div className="portal-profile-row">
                <span className="portal-profile-row__label">Verified Email</span>
                <span className="portal-profile-row__value">{user?.email || 'N/A'}</span>
              </div>
              <div className="portal-profile-row">
                <span className="portal-profile-row__label">Contact Phone</span>
                <span className="portal-profile-row__value">{profile?.phone || 'Not specified'}</span>
              </div>
              <div className="portal-profile-row">
                <span className="portal-profile-row__label">Platform Role</span>
                <span className="portal-profile-row__value" style={{ textTransform: 'capitalize' }}>
                  {roles.join(', ') || 'Applicant'}
                </span>
              </div>
            </div>

            {/* Program Policies Card */}
            <div className="portal-sidebar-card">
              <h3 className="portal-sidebar-card__title">Intake Governance</h3>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 'var(--space-3)' }}>
                Applications are reviewed objectively against track-specific prerequisites and project briefs.
              </p>
              <ul style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', lineHeight: 1.6, paddingLeft: '16px' }}>
                <li>Drafts remain private to your authenticated account.</li>
                <li>Submitted applications cannot be modified.</li>
                <li>Decisions are communicated directly in this portal.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="portal-modal-backdrop" onClick={() => setIsEditProfileOpen(false)}>
          <div className="portal-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="portal-modal__title">Update Contact Profile</h2>
            {profileFeedback && (
              <div style={{ marginBottom: '16px', fontSize: 'var(--font-size-sm)', color: profileFeedback.includes('failed') ? '#B53630' : '#1E6B47' }}>
                {profileFeedback}
              </div>
            )}
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <Input
                label="Full Legal Name"
                type="text"
                required
                value={editFullName}
                onChange={(e) => setEditFullName(e.target.value)}
              />
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+91 98765 43210"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
              />
              <div className="portal-modal__actions">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditProfileOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={profileSaving}
                >
                  {profileSaving ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
