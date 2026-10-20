import { useState, type FormEvent } from 'react'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { OwnerNotice } from '@/components/ui/OwnerNotice'
import { Text3D, Card3D } from '@/components/ui/Scroll3D'
import './ContactPage.css'

interface FormData {
  fullName: string
  email: string
  subject: string
  inquiryType: 'consulting' | 'internship' | 'verification' | 'general'
  message: string
  honeypot: string // spam prevention
}

interface FormErrors {
  fullName?: string
  email?: string
  subject?: string
  message?: string
}

export function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    subject: '',
    inquiryType: 'consulting',
    message: '',
    honeypot: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required.'
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters.'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address.'
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject line is required.'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Inquiry message cannot be empty.'
    } else if (formData.message.trim().length < 15) {
      newErrors.message = 'Please provide at least 15 characters describing your inquiry.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    // Honeypot trap check
    if (formData.honeypot) {
      setSubmitStatus('success')
      return
    }

    if (!validate()) return

    setIsSubmitting(true)
    setSubmitStatus('idle')

    // Simulated dispatch (actual SMTP dispatch will be active upon domain ratification)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      setFormData({
        fullName: '',
        email: '',
        subject: '',
        inquiryType: 'consulting',
        message: '',
        honeypot: '',
      })
    }, 600)
  }

  return (
    <div className="contact-page">
      {/* ==================== HEADER ==================== */}
      <section className="contact-header">
        <div className="container contact-header__container">
          <div className="contact-header__meta">
            <span className="contact-header__meta-tag">Contact &bull; Corporate Communications</span>
          </div>
          <Text3D as="h1" className="contact-header__title" variant="gradient">
            Connect with Quiclogix Solutions.
          </Text3D>
          <p className="contact-header__lead">
            Submit technical consulting requirements, architectural review inquiries, or upcoming internship cohort questions.
          </p>
        </div>
      </section>

      {/* ==================== INQUIRY FORM & INFO ==================== */}
      <Section
        tag="Inquiry Form"
        theme="white"
        spacing="spacious"
      >
        <div className="contact-layout">
          {/* Form Column */}
          <div className="contact-form-card">
            <div className="contact-form-card__header">
              <h3 className="contact-form-card__title">Direct Technical Inquiry</h3>
              <p className="contact-form-card__desc">
                Fill in the details below. Messages are triaged directly by our engineering and admissions leads.
              </p>
            </div>

            {submitStatus === 'success' && (
              <div className="contact-alert contact-alert--success" role="status">
                <span className="contact-alert__badge">SUCCESS</span>
                <div>
                  <strong>Inquiry Validated Successfully</strong>
                  <p>In this preview build, client validation and anti-spam controls passed. Live SMTP dispatch will operate upon production domain configuration.</p>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="contact-alert contact-alert--error" role="alert">
                <span className="contact-alert__badge">ERROR</span>
                <div>
                  <strong>Transmission Issue</strong>
                  <p>There was an issue processing your submission. Please recheck the fields and retry.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form" noValidate>
              {/* Honeypot hidden input */}
              <div style={{ display: 'none' }} aria-hidden="true">
                <label htmlFor="website_hp">Leave empty</label>
                <input
                  id="website_hp"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                />
              </div>

              <div className="contact-form__row">
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  required
                  value={formData.fullName}
                  error={errors.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value })
                    if (errors.fullName) setErrors({ ...errors, fullName: undefined })
                  }}
                />

                <Input
                  label="Work / Academic Email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={formData.email}
                  error={errors.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value })
                    if (errors.email) setErrors({ ...errors, email: undefined })
                  }}
                />
              </div>

              <div className="contact-select-wrap">
                <label htmlFor="inquiry-type" className="contact-select-label">
                  Inquiry Category <span className="contact-required">*</span>
                </label>
                <select
                  id="inquiry-type"
                  className="contact-select"
                  value={formData.inquiryType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      inquiryType: e.target.value as FormData['inquiryType'],
                    })
                  }
                >
                  <option value="consulting">Enterprise Software Consulting</option>
                  <option value="internship">Internship Program &amp; Cohort Admission</option>
                  <option value="verification">Credential / Certificate Verification</option>
                  <option value="general">General Corporate Inquiry</option>
                </select>
              </div>

              <Input
                label="Subject"
                placeholder="Brief summary of your project or inquiry"
                required
                value={formData.subject}
                error={errors.subject}
                onChange={(e) => {
                  setFormData({ ...formData, subject: e.target.value })
                  if (errors.subject) setErrors({ ...errors, subject: undefined })
                }}
              />

              <Textarea
                label="Message Details"
                placeholder="Detail your requirements, project scope, timeline, or cohort question..."
                required
                value={formData.message}
                error={errors.message}
                onChange={(e) => {
                  setFormData({ ...formData, message: e.target.value })
                  if (errors.message) setErrors({ ...errors, message: undefined })
                }}
                hint="Minimum 15 characters."
              />

              <div className="contact-form__actions">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Inquiry Message'}
                </Button>
              </div>
            </form>
          </div>

          {/* Corporate Communications Column */}
          <div className="contact-info-card">
            <div className="contact-info-card__header">
              <h3 className="contact-info-card__title">Corporate Communications</h3>
            </div>

            <div className="contact-param-block">
              <span className="contact-param-block__label">Official Inquiry Route</span>
              <OwnerNotice
                decisionId="B-01 / E-01"
                title="Company Sender Domain &amp; Email"
                description="Custom corporate domain routing (e.g. contact@quiclogix.com) will be active upon domain configuration."
                variant="inline"
              />
            </div>

            <div className="contact-param-block">
              <span className="contact-param-block__label">Registered Corporate Address</span>
              <OwnerNotice
                decisionId="B-02"
                title="Corporate Registered Office Address"
                description="Official registered postal address will appear here once corporate incorporation filings are confirmed."
              />
            </div>

            <div className="contact-param-block">
              <span className="contact-param-block__label">Operational Schedule</span>
              <div className="contact-param-block__val">
                Monday – Friday: 09:30 – 18:30 IST
              </div>
              <p className="contact-param-block__sub">
                Critical client infrastructure communications monitored continuously.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ==================== SLA & PRIVACY GUARANTEE ==================== */}
      <Section
        tag="Standards"
        title="Communication Commitments"
        subtitle="Our operational commitments for inbound communications."
        theme="dark"
        spacing="spacious"
      >
        <div className="contact-sla-grid">
          <Card3D depth="subtle" className="contact-sla-item">
            <h4 className="contact-sla-item__title">24–48h Response SLA</h4>
            <p className="contact-sla-item__desc">
              All formal project inquiries and admission questions receive written responses within 1 to 2 business days.
            </p>
          </Card3D>

          <Card3D depth="subtle" className="contact-sla-item">
            <h4 className="contact-sla-item__title">Non-Disclosure Discipline</h4>
            <p className="contact-sla-item__desc">
              Any architecture diagrams, product specifications, or business requirements shared are held in strict confidence.
            </p>
          </Card3D>

          <Card3D depth="subtle" className="contact-sla-item">
            <h4 className="contact-sla-item__title">Zero Spam &amp; No List Selling</h4>
            <p className="contact-sla-item__desc">
              We never add inquiries to unsolicited marketing drip campaigns or sell contact details to third-party brokers.
            </p>
          </Card3D>
        </div>
      </Section>
    </div>
  )
}
