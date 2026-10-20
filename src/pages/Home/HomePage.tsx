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
        <div className="container">
          <div className="home-hero__content">
            <motion.div
              className="home-hero__badge-wrap"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="home-hero__tag floating-3d-badge">
                <span className="home-hero__dot" aria-hidden="true" />
                Technology Practice &bull; Applied Studio
              </span>
            </motion.div>

            <Text3D
              as="h1"
              className="home-hero__headline"
              text="Thoughtful software engineering for modern businesses."
              depth="deep"
              sheen={true}
              gradient={true}
              delay={0.1}
            />

            <motion.p
              className="home-hero__lead"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              Quiclogix Solutions designs durable web platforms and cloud architectures, while preparing emerging engineers through production-standard project cohorts.
            </motion.p>

            <motion.div
              className="home-hero__actions"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <a href="#services">
                <Button variant="primary" size="lg">
                  Explore Services
                </Button>
              </a>
              <a href="#internship">
                <Button variant="secondary" size="lg">
                  Internship Program
                </Button>
              </a>
            </motion.div>

            <motion.div
              className="home-hero__quick-meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <span>Looking to verify a credential?</span>
              <a href="#verify" className="home-hero__verify-link">
                Public Certificate Lookup &rarr;
              </a>
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
