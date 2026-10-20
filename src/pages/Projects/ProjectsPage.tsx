import { Badge } from '@/components/ui/Badge'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { OwnerNotice } from '@/components/ui/OwnerNotice'
import { Text3D, Card3D } from '@/components/ui/Scroll3D'
import './ProjectsPage.css'

interface CaseStudy {
  id: string
  title: string
  classification: string
  status: string
  context: string
  architecture: string
  stack: string[]
  metrics: string[]
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'verification-engine',
    title: 'Public Credential Verification Engine & Audit Gateway',
    classification: 'Reference Implementation',
    status: 'Production System',
    context:
      'Engineered as the reference core for Quiclogix credential validation. Required public certificate lookup, tamper-resistant record hashing, rate-limiting, and zero unauthorized data exposure.',
    architecture:
      'Designed PostgreSQL schema with 16 normalized tables, 5 role-based access levels, Edge Functions for idempotency, and sub-second cold starts.',
    stack: ['React 19', 'TypeScript', 'PostgreSQL / RLS', 'SHA-256 Digest', 'Vite'],
    metrics: [
      'Sub-50ms query response time with database indexing',
      'Zero client-trust security posture verified via policy matrix',
      'Immutable audit log recording every verification attempt',
    ],
  },
  {
    id: 'payment-reconciliation',
    title: 'Idempotent Payment Webhook & State Machine Pipeline',
    classification: 'Architecture Blueprint',
    status: 'System Blueprint',
    context:
      'A reference architecture designed to eliminate race conditions, duplicate charges, and lost webhook notifications during high-concurrency payment lifecycles.',
    architecture:
      'Architected state-machine transitions requiring database-level row locking, HMAC signature verification, append-only transaction logs, and auto-reconciliation workers.',
    stack: ['PostgreSQL Functions', 'HMAC SHA-256', 'Serverless Edge', 'Idempotency Keys'],
    metrics: [
      'Guaranteed deduplication via gateway event unique constraints',
      'Strict status transitions preventing unauthorized access promotion',
      'Auditable event trails compliant with financial reporting standards',
    ],
  },
  {
    id: 'design-tokens-benchmark',
    title: 'Quiclogix Editorial Tokenized Design System',
    classification: 'Design System',
    status: 'Production System',
    context:
      'A zero-dependency UI component architecture built to prove that editorial visual polish, responsive ergonomics, and strict WCAG AA contrast can coexist.',
    architecture:
      'Crafted modular CSS Custom Properties system utilizing 4px spatial units, Newsreader serif and Plus Jakarta Sans typography, accessible focus rings, and reduced-motion fallback.',
    stack: ['Vanilla CSS Tokens', 'ARIA 1.2', 'React 19 Primitives', 'WCAG AA'],
    metrics: [
      '100% keyboard accessible with visible focus indicators',
      'Zero layout shift (CLS: 0.0) across all breakpoints',
      'Sub-35ms static lint execution with zero runtime warnings',
    ],
  },
]

export function ProjectsPage() {
  return (
    <div className="projects-page">
      {/* ==================== HEADER ==================== */}
      <section className="projects-header">
        <div className="container projects-header__container">
          <div className="projects-header__meta">
            <span className="projects-header__meta-tag floating-3d-badge">Case Studies &bull; Reference Patterns</span>
          </div>
          <Text3D
            as="h1"
            className="projects-header__title"
            text="Case studies grounded in architectural honesty."
            depth="deep"
            sheen={true}
            gradient={true}
          />
          <p className="projects-header__lead">
            Quiclogix Solutions maintains strict standards of public transparency: all case studies, benchmarks, and prototypes below are explicitly categorized to distinguish internal engineering references from external commercial work.
          </p>

          <div className="projects-header__notice">
            <OwnerNotice
              decisionId="P-02"
              title="Client Case Studies Notice"
              description="Commercial enterprise client case studies are subject to non-disclosure agreements and will be published upon formal client authorization. Quiclogix does not publish fabricated client testimonials."
              variant="inline"
            />
          </div>
        </div>
      </section>

      {/* ==================== CASE STUDIES DOSSIER ==================== */}
      <Section
        tag="Case Studies"
        title="Architectural Benchmarks"
        subtitle="Technical breakdowns detailing problem context, system design, stack, and verified outcomes."
        theme="white"
        spacing="spacious"
      >
        <div className="projects-dossier">
          {CASE_STUDIES.map((study, idx) => (
            <Card3D key={study.id} maxTilt={6} delay={idx * 0.1} innerClassName="dossier-card">
              <div className="dossier-card__header">
                <div className="dossier-card__meta depth-pop-sm">
                  <Badge variant="outline" size="sm">{study.classification}</Badge>
                  <span className="dossier-card__status">{study.status}</span>
                </div>
                <h3 className="dossier-card__title depth-pop-md">{study.title}</h3>
              </div>

              <div className="dossier-card__body">
                <div className="dossier-card__col">
                  <span className="dossier-card__label">Problem Context</span>
                  <p className="dossier-card__text">{study.context}</p>
                </div>

                <div className="dossier-card__col">
                  <span className="dossier-card__label">System Architecture</span>
                  <p className="dossier-card__text">{study.architecture}</p>
                </div>

                <div className="dossier-card__col">
                  <span className="dossier-card__label">Verifiable Outcomes</span>
                  <ul className="dossier-card__outcomes">
                    {study.metrics.map((metric, mIdx) => (
                      <li key={mIdx}>
                        <span className="dossier-card__bullet">—</span>
                        <span>{metric}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="dossier-card__footer depth-pop-sm">
                <div className="dossier-card__stack">
                  {study.stack.map((item) => (
                    <code key={item}>{item}</code>
                  ))}
                </div>
              </div>
            </Card3D>
          ))}
        </div>
      </Section>

      {/* ==================== INTEGRITY STANDARDS ==================== */}
      <Section
        tag="Integrity"
        title="Engineering Verification Standards"
        subtitle="How we maintain accountability in public technical representations."
        theme="dark"
        spacing="spacious"
      >
        <div className="projects-standards__grid">
          {[
            {
              title: 'Zero Fictitious Logos',
              desc: 'We never populate client grids with unverified corporate logos or stock company emblems. Every commercial mention is backed by authorization.'
            },
            {
              title: 'Reproducible Benchmarks',
              desc: 'Performance claims and lighthouse scores correspond to actual production audit runs conducted against published codebases.'
            },
            {
              title: 'Clear Work Classifications',
              desc: 'We explicitly label whether a codebase is an internal benchmark, an architectural prototype, or client delivery work.'
            }
          ].map((std, sIdx) => (
            <Card3D key={std.title} maxTilt={6} delay={sIdx * 0.08} innerClassName="projects-standard-card">
              <h4 className="projects-standard-card__title depth-pop-md">{std.title}</h4>
              <p className="projects-standard-card__desc">{std.desc}</p>
            </Card3D>
          ))}
        </div>

        <div className="projects-cta">
          <Text3D as="h3" className="projects-cta__title" text="Discuss Your Technical Architecture" depth="subtle" />
          <p className="projects-cta__desc">
            We evaluate existing codebases, design robust full-stack systems, and provide architectural leadership.
          </p>
          <a href="#contact">
            <Button variant="primary" size="lg">
              Start an Architectural Consultation
            </Button>
          </a>
        </div>
      </Section>
    </div>
  )
}
