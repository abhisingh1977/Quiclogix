import { motion } from 'motion/react'
import { Badge } from '@/components/ui/Badge'
import { Section } from '@/components/ui/Section'
import { OwnerNotice } from '@/components/ui/OwnerNotice'
import { Button } from '@/components/ui/Button'
import { Card3D } from '@/components/ui/Scroll3D'
import './AboutPage.css'

export function AboutPage() {
  return (
    <div className="about-page">
      {/* ==================== PAGE INTRODUCTORY HERO ==================== */}
      <section className="about-header">
        <div className="about-header__backdrop" aria-hidden="true">
          <div className="about-header__grid-pattern" />
          <div className="about-header__glow" />
        </div>

        <div className="container about-header__container">
          <div className="about-header__grid">
            {/* Left: Editorial Intro */}
            <div className="about-header__content">
              <motion.div
                className="about-header__meta"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="about-header__meta-tag">
                  <span className="about-header__pulse-dot" aria-hidden="true" />
                  <span>About Quiclogix &bull; Engineering Practice</span>
                </div>
              </motion.div>

              <motion.h1
                className="about-header__title"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 }}
              >
                Engineering ideas into{' '}
                <span className="about-header__accent">real-world solutions.</span>
              </motion.h1>

              <motion.p
                className="about-header__lead"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.16 }}
              >
                Quiclogix Solutions was established to bridge the gap between academic theory and production-grade software engineering. We operate simultaneously as a technical engineering advisory and an evaluation-driven talent platform.
              </motion.p>

              <motion.div
                className="about-header__actions"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.22 }}
              >
                <a href="#services">
                  <Button variant="primary" size="md">
                    Explore Capabilities
                  </Button>
                </a>
                <a href="#contact">
                  <Button variant="secondary" size="md">
                    Get in Touch
                  </Button>
                </a>
              </motion.div>
            </div>

            {/* Right: Architectural Identity Brief */}
            <motion.div
              className="about-header__aside"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="about-hero-card">
                <div className="about-hero-card__header">
                  <span className="about-hero-card__eyebrow">PRACTICE OVERVIEW</span>
                  <Badge variant="accent" size="sm">Verified Studio</Badge>
                </div>
                <h3 className="about-hero-card__title">Software Engineering with Architectural Rigor</h3>
                <p className="about-hero-card__text">
                  Bridging disciplined system architecture, relational data modeling, and practical talent development into a cohesive practice.
                </p>

                <div className="about-hero-card__specs">
                  <div className="about-hero-spec-item">
                    <span className="about-hero-spec-item__label">Core Practice</span>
                    <strong className="about-hero-spec-item__val">Technical Advisory &amp; Cloud Systems</strong>
                  </div>
                  <div className="about-hero-spec-item">
                    <span className="about-hero-spec-item__label">Talent Framework</span>
                    <strong className="about-hero-spec-item__val">19-Track Project-Based Cohorts</strong>
                  </div>
                  <div className="about-hero-spec-item">
                    <span className="about-hero-spec-item__label">Engineering Standard</span>
                    <strong className="about-hero-spec-item__val">Strict Types &amp; Zero-Trust Access</strong>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== CORE CONVICTIONS ==================== */}
      <Section
        tag="Principles"
        title="Core Engineering Convictions"
        subtitle="Foundational tenets guiding how we design systems and mentor developers."
        theme="white"
        spacing="spacious"
      >
        <div className="about-values__grid">
          {[
            {
              title: 'Craftsmanship Over Hype',
              desc: 'We prioritize rock-solid fundamentals: strict type safety, disciplined relational constraints, idempotent mutations, and clean operational lifecycles over transient frontend fads.'
            },
            {
              title: 'Uncompromising Transparency',
              desc: 'We never fabricate client logos, project statistics, or vanity metrics. In client advisory and internship programs alike, project scope, timelines, standards, and deliverables are fully disclosed upfront.'
            },
            {
              title: 'Measurable Competence',
              desc: 'Credentials derive worth solely from demonstrated performance. Our evaluation rubrics assess genuine system behavior, automated testing, and security boundaries—not superficial attendance.'
            }
          ].map((val, idx) => (
            <Card3D key={val.title} maxTilt={7} delay={idx * 0.1} innerClassName="about-value-card">
              <div className="about-value-card__header">
                <h3 className="about-value-card__title depth-pop-md">{val.title}</h3>
              </div>
              <p className="about-value-card__desc">{val.desc}</p>
            </Card3D>
          ))}
        </div>
      </Section>

      {/* ==================== COMPANY PROFILE & VERIFIED DATA ==================== */}
      <Section
        tag="Corporate Status"
        title="Corporate Status &amp; Disclosures"
        subtitle="Verified identity parameters alongside explicit pending disclosures."
        theme="dark"
        spacing="spacious"
      >
        <div className="about-profile__grid">
          <Card3D maxTilt={5} innerClassName="about-profile__card">
            <div className="about-profile__badge-line depth-pop-sm">
              <Badge variant="accent" size="sm">Verified Record</Badge>
            </div>
            <h3 className="about-profile__card-title depth-pop-md">Corporate Identity</h3>
            <div className="about-profile__data-table">
              <div className="about-profile__data-row">
                <span className="about-profile__key">Entity Name</span>
                <span className="about-profile__val">Quiclogix Solutions</span>
              </div>
              <div className="about-profile__data-row">
                <span className="about-profile__key">Operating Model</span>
                <span className="about-profile__val">Technology Consulting &amp; Project Training</span>
              </div>
              <div className="about-profile__data-row">
                <span className="about-profile__key">Technology Core</span>
                <span className="about-profile__val">React, TypeScript, Supabase PostgreSQL, Edge Architecture</span>
              </div>
            </div>

            <div className="about-profile__notices">
              <OwnerNotice
                decisionId="B-02"
                title="Legal Registration &amp; Registered Office"
                description="Official registration number (CIN/LLPIN), registered corporate address, and tax identification numbers will be published upon final corporate filing."
              />
              <OwnerNotice
                decisionId="B-07"
                title="Establishment Milestones"
                description="Corporate timeline milestones and leadership background will be published following management review."
              />
            </div>
          </Card3D>

          <Card3D maxTilt={5} delay={0.12} innerClassName="about-profile__card">
            <div className="about-profile__badge-line depth-pop-sm">
              <Badge variant="outline" size="sm">Leadership</Badge>
            </div>
            <h3 className="about-profile__card-title depth-pop-md">Engineering Leadership &amp; Mentors</h3>
            <p className="about-profile__card-copy">
              Quiclogix Solutions projects and cohorts are directed by experienced engineers with active background in modern cloud-native systems, strict TypeScript architectures, and database modeling.
            </p>

            <div className="about-profile__notices">
              <OwnerNotice
                decisionId="B-08"
                title="Leadership &amp; Mentor Profiles"
                description="Public leadership biographies, verified mentor credentials, and authorized profiles will appear here once approved by company management."
              />
            </div>
          </Card3D>
        </div>
      </Section>

      {/* ==================== WORK METHODOLOGY ==================== */}
      <Section
        tag="Delivery Model"
        title="Engineering Delivery Lifecycle"
        subtitle="The 4-stage sequential model we follow for client systems and cohort projects."
        theme="paper"
        spacing="spacious"
      >
        <div className="about-timeline">
          {[
            {
              name: 'Schema & Architecture Modeling',
              body: 'Before client UI code or sprint tickets are drafted, relational schemas, state machines, and API boundaries are formalized with TypeScript interfaces.'
            },
            {
              name: 'Zero-Trust Security & Access Controls',
              body: 'Granular PostgreSQL Row-Level Security, server-validated endpoints, and strict role permissions are baked in as non-negotiable foundations.'
            },
            {
              name: 'Iterative Vertical Slices',
              body: 'Features are built as fully testable vertical units—from database query to client interaction—with automated linting and zero-warning builds.'
            },
            {
              name: 'Audit, Rubric Verification & Release',
              body: 'Comprehensive accessibility audits (WCAG AA), Core Web Vitals profiling, and verifiable documentation accompany every release.'
            }
          ].map((step, idx) => (
            <Card3D key={step.name} maxTilt={6} delay={idx * 0.08} innerClassName="about-timeline__step">
              <div className="about-timeline__header">
                <span className="about-timeline__name depth-pop-sm">{step.name}</span>
              </div>
              <p className="about-timeline__body">{step.body}</p>
            </Card3D>
          ))}
        </div>

        <div className="about-footer-cta">
          <a href="#contact">
            <Button variant="primary" size="lg">
              Start an Engineering Discussion
            </Button>
          </a>
          <a href="#services">
            <Button variant="secondary" size="lg">
              Review Services Scope
            </Button>
          </a>
        </div>
      </Section>
    </div>
  )
}
