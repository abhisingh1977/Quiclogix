import { motion } from 'motion/react'
import { Button } from '@/components/ui/Button'
import { Section } from '@/components/ui/Section'
import { OwnerNotice } from '@/components/ui/OwnerNotice'
import { ArchitectureCanvas } from '@/components/ui/ArchitectureCanvas'
import { Text3D, Card3D } from '@/components/ui/Scroll3D'
import './HomePage.css'

export function HomePage() {
  return (
    <div className="home-page">
      {/* ==================== HERO SECTION ==================== */}
      <section className="home-hero">
        {/* Scoped ambient architectural backdrop */}
        <div className="home-hero__backdrop" aria-hidden="true">
          <div className="home-hero__grid-pattern" />
          <div className="home-hero__glow home-hero__glow--primary" />
          <div className="home-hero__glow home-hero__glow--secondary" />
        </div>

        <div className="container home-hero__container">
          <div className="home-hero__grid">
            {/* Left Column: Editorial Headline & Actions */}
            <div className="home-hero__content">
              <motion.div
                className="home-hero__badge-wrap"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="home-hero__tag">
                  <span className="home-hero__pulse-dot" aria-hidden="true">
                    <span className="home-hero__pulse-ring" />
                  </span>
                  <span className="home-hero__tag-text">Technology Practice &bull; Applied Studio</span>
                </div>
              </motion.div>

              <motion.h1
                className="home-hero__headline"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                Thoughtful software engineering for{' '}
                <span className="home-hero__headline-accent">modern businesses.</span>
              </motion.h1>

              <motion.p
                className="home-hero__lead"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                Quiclogix Solutions designs durable web platforms and cloud architectures, while preparing emerging engineers through production-standard project cohorts.
              </motion.p>

              <motion.div
                className="home-hero__actions"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
              >
                <a href="#services" className="home-hero__cta-link">
                  <Button variant="primary" size="lg" className="home-hero__btn-primary">
                    <span>Explore Services</span>
                    <svg className="home-hero__btn-arrow" viewBox="0 0 16 16" fill="none" width="16" height="16" aria-hidden="true">
                      <path d="M3.33334 8H12.6667M12.6667 8L8.66668 4M12.6667 8L8.66668 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Button>
                </a>
                <a href="#internship" className="home-hero__cta-link">
                  <Button variant="secondary" size="lg" className="home-hero__btn-secondary">
                    <span>Internship Program</span>
                  </Button>
                </a>
              </motion.div>

              <motion.div
                className="home-hero__quick-meta"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.42 }}
              >
                <div className="home-hero__verify-wrap">
                  <span className="home-hero__meta-label">Looking to verify a credential?</span>
                  <a href="#verify" className="home-hero__verify-link">
                    Public Certificate Lookup
                    <span aria-hidden="true" className="home-hero__link-arrow">&rarr;</span>
                  </a>
                </div>

                <div className="home-hero__spec-chips">
                  <span className="home-hero__chip">19 Domain Tracks</span>
                  <span className="home-hero__chip-divider" aria-hidden="true">&bull;</span>
                  <span className="home-hero__chip">PostgreSQL RLS</span>
                  <span className="home-hero__chip-divider" aria-hidden="true">&bull;</span>
                  <span className="home-hero__chip">Zero Vendor Lock-in</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Architectural Engineering Visual */}
            <motion.div
              className="home-hero__visual-col"
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Satellite Floating Badge: Applied Tracks */}
              <motion.div
                className="home-hero__satellite home-hero__satellite--top"
                animate={{ y: [-4, 5, -4] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="home-hero__satellite-dot" />
                <span className="home-hero__satellite-text">19 Technical Disciplines</span>
              </motion.div>

              {/* Main Architecture Console Card */}
              <div className="home-hero__console">
                {/* Console Window Header */}
                <div className="home-hero__console-header">
                  <div className="home-hero__console-dots" aria-hidden="true">
                    <span className="home-hero__dot home-hero__dot--red" />
                    <span className="home-hero__dot home-hero__dot--amber" />
                    <span className="home-hero__dot home-hero__dot--green" />
                  </div>
                  <div className="home-hero__console-title">
                    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" className="home-hero__file-icon" aria-hidden="true">
                      <path d="M9.5 2H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V5.5L9.5 2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 2v4h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>quiclogix-pipeline.ts</span>
                  </div>
                  <div className="home-hero__console-status">
                    <span className="home-hero__status-indicator" />
                    <span>strict-verified</span>
                  </div>
                </div>

                {/* Console Body: 3-Tier Architecture Pipeline */}
                <div className="home-hero__console-body">
                  {/* Tier 01: Client Layer */}
                  <div className="home-hero__node home-hero__node--client">
                    <div className="home-hero__node-header">
                      <div className="home-hero__node-tag">
                        <span className="home-hero__node-step">01</span>
                        <span className="home-hero__node-label">Presentation Tier</span>
                      </div>
                      <span className="home-hero__tech-pill">React 19 &bull; TS</span>
                    </div>
                    <p className="home-hero__node-desc">
                      Synchronized TypeScript interfaces, WCAG 2.2 AA contrast, accessible semantic structure.
                    </p>
                  </div>

                  {/* Flow Connector */}
                  <div className="home-hero__connector" aria-hidden="true">
                    <div className="home-hero__connector-line" />
                    <div className="home-hero__connector-pulse" />
                  </div>

                  {/* Tier 02: Edge & Auth Gateway */}
                  <div className="home-hero__node home-hero__node--edge">
                    <div className="home-hero__node-header">
                      <div className="home-hero__node-tag">
                        <span className="home-hero__node-step">02</span>
                        <span className="home-hero__node-label">Security &amp; RPC Gateway</span>
                      </div>
                      <span className="home-hero__tech-pill">Zero-Trust</span>
                    </div>
                    <p className="home-hero__node-desc">
                      Security Definer functions, caller isolation, automated rate limits and idempotency keys.
                    </p>
                  </div>

                  {/* Flow Connector */}
                  <div className="home-hero__connector" aria-hidden="true">
                    <div className="home-hero__connector-line" />
                    <div className="home-hero__connector-pulse" />
                  </div>

                  {/* Tier 03: PostgreSQL Core */}
                  <div className="home-hero__node home-hero__node--database">
                    <div className="home-hero__node-header">
                      <div className="home-hero__node-tag">
                        <span className="home-hero__node-step">03</span>
                        <span className="home-hero__node-label">PostgreSQL Relational Core</span>
                      </div>
                      <span className="home-hero__tech-pill home-hero__tech-pill--gold">Row-Level Security</span>
                    </div>
                    <p className="home-hero__node-desc">
                      Declarative RLS enforcement, automated SQL migrations, immutable audit trail.
                    </p>
                  </div>
                </div>

                {/* Console Footer: Live Metrics Bar */}
                <div className="home-hero__console-footer">
                  <div className="home-hero__metric">
                    <span className="home-hero__metric-label">PIPELINE AUDIT</span>
                    <span className="home-hero__metric-value">100 / 100</span>
                  </div>
                  <div className="home-hero__metric-sep" aria-hidden="true" />
                  <div className="home-hero__metric">
                    <span className="home-hero__metric-label">LATENCY</span>
                    <span className="home-hero__metric-value">&lt; 28ms</span>
                  </div>
                  <div className="home-hero__metric-sep" aria-hidden="true" />
                  <div className="home-hero__metric">
                    <span className="home-hero__metric-label">ENGINEERING</span>
                    <span className="home-hero__metric-value">Production</span>
                  </div>
                </div>
              </div>

              {/* Satellite Floating Badge: Security Status */}
              <motion.div
                className="home-hero__satellite home-hero__satellite--bottom"
                animate={{ y: [5, -4, 5] }}
                transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="home-hero__shield-badge" aria-hidden="true">
                  <svg viewBox="0 0 16 16" width="12" height="12" fill="none">
                    <path d="M8 1.5L2.5 3.8v4.6c0 3.3 2.3 6.4 5.5 7.1 3.2-.7 5.5-3.8 5.5-7.1V3.8L8 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 7.8l1.4 1.4 2.8-2.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span className="home-hero__satellite-text">Row-Level Security Verified</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== TWO CORE PILLARS ==================== */}
      <section className="home-pillars-section">
        <div className="container">
          <div className="home-pillars-grid">
            {/* Pillar 01: Engineering Advisory */}
            <Card3D maxTilt={10} delay={0.05} innerClassName="home-pillar-card">
              <div className="home-pillar-card__top">
                <span className="home-pillar-card__tag depth-pop-sm">Consulting Practice</span>
                <h2 className="home-pillar-card__title depth-pop-md">
                  Systems Architecture &amp; Web Engineering
                </h2>
              </div>
              <p className="home-pillar-card__desc">
                We partner with teams to architect, build, and modernize web platforms. From strict TypeScript component systems to PostgreSQL Row-Level Security, we build software that lasts.
              </p>
              <ul className="home-pillar-card__list">
                <li>Bespoke web applications &amp; internal tooling</li>
                <li>PostgreSQL data modeling &amp; security policies</li>
                <li>Codebase audits &amp; WCAG accessibility remediation</li>
              </ul>
              <div className="home-pillar-card__action depth-pop-sm">
                <a href="#services" className="home-pillar-card__link">
                  <span>View Services &amp; Scope</span>
                  <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </Card3D>

            {/* Pillar 02: Applied Studio Internship */}
            <Card3D maxTilt={10} delay={0.15} innerClassName="home-pillar-card">
              <div className="home-pillar-card__top">
                <span className="home-pillar-card__tag depth-pop-sm">Applied Studio</span>
                <h2 className="home-pillar-card__title depth-pop-md">
                  One-Month Project-Oriented Internship
                </h2>
              </div>
              <p className="home-pillar-card__desc">
                An intensive four-week sprint where developers work against real engineering briefs, submit pull requests, and receive quantifiable rubric feedback from active mentors.
              </p>
              <ul className="home-pillar-card__list">
                <li>Production-standard Git workflows &amp; code reviews</li>
                <li>Deterministic evaluation against published rubrics</li>
                <li>Cryptographically verifiable completion credentials</li>
              </ul>
              <div className="home-pillar-card__action depth-pop-sm">
                <a href="#internship" className="home-pillar-card__link">
                  <span>Explore Internship Curriculum</span>
                  <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </Card3D>
          </div>
        </div>
      </section>

      {/* ==================== ARCHITECTURAL WORKBENCH ==================== */}
      <section className="home-workbench-section">
        <div className="container">
          <div className="home-section-header">
            <span className="home-section-tag floating-3d-badge">Interactive Architecture</span>
            <Text3D
              as="h2"
              className="home-section-title"
              text="Our Architectural Model: From Schema to Interface"
              depth="medium"
            />
            <p className="home-section-subtitle">
              Every system we design and every project built in our studio follows a disciplined three-tier pipeline. Explore each tier to inspect declarative database security, verifiable logic, and type-safe interfaces.
            </p>
          </div>

          <div className="home-workbench-wrapper">
            <Card3D maxTilt={4} glare={true}>
              <ArchitectureCanvas />
            </Card3D>
          </div>
        </div>
      </section>

      {/* ==================== CAPABILITIES & DISCIPLINES ==================== */}
      <Section
        title="Consulting Capabilities"
        subtitle="Verifiable code quality, architectural clarity, and zero vendor lock-in."
        theme="paper"
        spacing="spacious"
      >
        <div className="home-capabilities-grid">
          {[
            {
              title: 'Custom Web Platforms',
              text: 'End-to-end development of bespoke web applications, customer portals, and internal workflows. Built with React 19, strict TypeScript contracts, and accessible styling tokens.',
              meta: ['React 19', 'TypeScript', 'WCAG 2.2 AA'],
            },
            {
              title: 'Database & Cloud Security',
              text: 'Relational database modeling with PostgreSQL Row-Level Security, automated SQL migrations, and isolated serverless edge runtimes that guard critical data.',
              meta: ['PostgreSQL RLS', 'Edge Compute', 'Audit Trails'],
            },
            {
              title: 'Audits & Modernization',
              text: 'Comprehensive repository evaluations: eliminating implicit any types, resolving performance bottlenecks, and fixing keyboard navigation and color contrast defects.',
              meta: ['Code Audits', 'Accessibility', 'Performance'],
            },
          ].map((cap, idx) => (
            <Card3D
              key={cap.title}
              maxTilt={8}
              delay={idx * 0.1}
              innerClassName="home-capability-card"
            >
              <h3 className="home-capability-card__title depth-pop-md">{cap.title}</h3>
              <p className="home-capability-card__text">{cap.text}</p>
              <div className="home-capability-card__meta depth-pop-sm">
                {cap.meta.map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
            </Card3D>
          ))}
        </div>

        <div className="home-capabilities-footer">
          <a href="#services">
            <Button variant="secondary" size="md">
              Review Detailed Service Scope &rarr;
            </Button>
          </a>
          <OwnerNotice
            decisionId="P-02"
            title="Client Case Studies Policy"
            description="Client case studies and metrics are published only with written authorization under confidentiality agreements. Quiclogix does not publish fabricated client logos or unverified metrics."
            variant="inline"
          />
        </div>
      </Section>

      {/* ==================== ENGINEERING PRINCIPLES ==================== */}
      <section className="home-principles-section">
        <div className="container">
          <div className="home-section-header">
            <span className="home-section-tag floating-3d-badge">Engineering Approach</span>
            <Text3D
              as="h2"
              className="home-section-title"
              text="Disciplined Standards for Production Software"
              depth="medium"
            />
            <p className="home-section-subtitle">
              The core principles that govern our consulting engagements and our studio internship curriculum.
            </p>
          </div>

          <div className="home-principles-grid">
            {[
              {
                title: 'Type-Safe Boundaries',
                text: 'Database schemas, server functions, and client interfaces share synchronized type definitions. Compile-time checks prevent subtle runtime regressions before code ever ships.',
              },
              {
                title: 'Security at the Engine',
                text: 'Access control is enforced at the PostgreSQL database layer via declarative Row-Level Security, ensuring that untrusted client requests cannot compromise user data.',
              },
              {
                title: 'Objective Rubric Evaluation',
                text: "Whether deploying a production system or assessing an intern's project, work is evaluated against concrete milestones, automated test suites, and quantifiable standards.",
              },
              {
                title: 'Mentorship in Real Repositories',
                text: 'Engineers build lasting competence by writing real code in production repositories with pull requests, automated linters, and actionable code review feedback.',
              },
            ].map((p, idx) => (
              <Card3D
                key={p.title}
                maxTilt={6}
                delay={idx * 0.08}
                innerClassName="home-principle-item"
              >
                <h3 className="home-principle-item__title depth-pop-md">{p.title}</h3>
                <p className="home-principle-item__text">{p.text}</p>
              </Card3D>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== THE APPLIED INTERNSHIP SPRINT ==================== */}
      <Section
        title="The One-Month Studio Sprint"
        subtitle="A project-oriented engineering training platform engineered for measurable skill growth."
        theme="paper"
        spacing="spacious"
      >
        <div className="home-sprint-overview">
          <div className="home-sprint-timeline">
            {[
              {
                week: 'Week 1',
                title: 'Scaffolding & Specification',
                text: 'Project initialization, strict TypeScript configuration, design token setup, and domain interface modeling.',
              },
              {
                week: 'Week 2',
                title: 'Data Modeling & Security',
                text: 'PostgreSQL schema migrations, Row-Level Security policies, and edge API functions enforcing data isolation.',
              },
              {
                week: 'Week 3',
                title: 'Client Applications & UX',
                text: 'Component composition, state management, form validation, error boundaries, and WCAG AA accessibility compliance.',
              },
              {
                week: 'Week 4',
                title: 'Review & Verification',
                text: 'Comprehensive rubric grading across code quality, test coverage, and security, followed by credential digest issuance.',
              },
            ].map((step, idx) => (
              <Card3D
                key={step.week}
                maxTilt={6}
                delay={idx * 0.08}
                innerClassName="home-sprint-step"
              >
                <div className="home-sprint-step__badge depth-pop-sm">{step.week}</div>
                <h4 className="home-sprint-step__title depth-pop-md">{step.title}</h4>
                <p className="home-sprint-step__text">{step.text}</p>
              </Card3D>
            ))}
          </div>

          <div className="home-sprint-footer">
            <div className="home-sprint-footer__actions">
              <a href="#internship">
                <Button variant="primary" size="md">
                  View Full Internship Details
                </Button>
              </a>
              <a href="#contact">
                <Button variant="secondary" size="md">
                  Admissions Inquiry
                </Button>
              </a>
            </div>

            <div className="home-sprint-footer__notice">
              <OwnerNotice
                decisionId="I-04 / I-06"
                title="Cohort Schedule &amp; Enrollment Guidelines"
                description="Upcoming cohort dates, enrollment guidelines, and onboarding criteria will be published prior to open enrollment."
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ==================== CLOSING INQUIRY CTA ==================== */}
      <section className="home-cta-section">
        <div className="container">
          <Card3D maxTilt={5} innerClassName="home-cta-card">
            <div className="home-cta-card__content">
              <Text3D
                as="h2"
                className="home-cta-card__title"
                text="Ready to discuss a project or join an upcoming cohort?"
                depth="subtle"
              />
              <p className="home-cta-card__lead">
                Whether you need architectural advisory for your web application or want to build verified engineering skills, we respond within 24 to 48 business hours.
              </p>
            </div>
            <div className="home-cta-card__actions depth-pop-sm">
              <a href="#contact">
                <Button variant="primary" size="lg">
                  Submit an Inquiry
                </Button>
              </a>
              <a href="#about">
                <Button variant="secondary" size="lg">
                  About Quiclogix
                </Button>
              </a>
            </div>
          </Card3D>
        </div>
      </section>
    </div>
  )
}
