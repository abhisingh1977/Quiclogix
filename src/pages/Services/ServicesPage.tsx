import { Badge } from '@/components/ui/Badge'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { OwnerNotice } from '@/components/ui/OwnerNotice'
import { Text3D, Card3D } from '@/components/ui/Scroll3D'
import './ServicesPage.css'

interface ServiceItem {
  id: string
  title: string
  category: string
  problem: string
  deliverables: string[]
  audience: string
  stack: string[]
}

const SERVICES: ServiceItem[] = [
  {
    id: 'fullstack-web',
    title: 'Custom Web Application Development',
    category: 'Engineering & Build',
    problem:
      'Organizations struggle with brittle, poorly typed web codebases that suffer from regression bugs, slow load times, and unmaintainable state management.',
    deliverables: [
      'Full-stack architecture blueprint, data dictionary & entity relationship modeling',
      'Production React 19 + TypeScript frontend with custom accessible design system',
      'High-throughput REST / RPC endpoint architecture with validation schemas',
      'Automated CI/CD workflows, zero-warning lint checks, and type-safe builds',
    ],
    audience:
      'Growing startups and technology companies needing scalable, maintainable bespoke web platforms.',
    stack: ['React 19', 'TypeScript', 'Node.js', 'Vite', 'PostgreSQL'],
  },
  {
    id: 'cloud-db',
    title: 'PostgreSQL & Cloud Backend Architecture',
    category: 'Data & Infrastructure',
    problem:
      'Engineering teams frequently miss fine-grained database access controls, leading to multi-tenant data bleed risks, unvalidated client mutations, and unindexed bottlenecks.',
    deliverables: [
      'Relational schema design with foreign key constraints, triggers, and check expressions',
      'Row-Level Security (RLS) policies enforcing multi-tenant isolation at the engine level',
      'Serverless Edge Functions with request signature verification and idempotency locks',
      'Private and public cloud storage bucket access policies with signed URL delivery',
    ],
    audience:
      'Companies upgrading legacy databases or migrating to Supabase PostgreSQL infrastructure.',
    stack: ['Supabase', 'PostgreSQL', 'Row-Level Security', 'Edge Functions', 'Storage'],
  },
  {
    id: 'modernization-audit',
    title: 'System Modernization & Technical Audits',
    category: 'Architecture Advisory',
    problem:
      'Legacy applications suffer from accumulating tech debt, untyped JavaScript chaos, critical accessibility gaps, and slow Core Web Vitals affecting user retention.',
    deliverables: [
      'Exhaustive codebase & security review with prioritized remediation matrix',
      'Progressive TypeScript migration roadmaps with zero operational downtime',
      'WCAG 2.1 AA accessibility remediation and Lighthouse performance optimization (90+)',
      'Automated linting rulesets, dead-code removal, and dependency vulnerability audits',
    ],
    audience:
      'Organizations with aging codebases seeking risk-managed refactoring without business interruption.',
    stack: ['TypeScript', 'Lighthouse', 'WCAG AA', 'Oxlint', 'Static Analysis'],
  },
  {
    id: 'design-system',
    title: 'Design Systems & UI Engineering',
    category: 'Frontend Craft',
    problem:
      'Inconsistent brand representation, duplicate UI components across teams, and poor design-to-code alignment drastically slow engineering velocity.',
    deliverables: [
      'Tokenized design system architecture (4px spacing scale, curated typography, semantic colors)',
      'Accessible, keyboard-navigable UI component library adhering to ARIA standards',
      'Cohesive light and dark theme tokens with user preference persistence',
      'Component catalog documentation with explicit usage guidelines and code examples',
    ],
    audience:
      'Product and engineering organizations requiring a unified, distinctive, and accessible UI foundation.',
    stack: ['CSS Custom Properties', 'Vanilla CSS', 'React Primitives', 'ARIA'],
  },
]

export function ServicesPage() {
  return (
    <div className="services-page">
      {/* ==================== HEADER ==================== */}
      <section className="services-header">
        <div className="container services-header__container">
          <div className="services-header__meta">
            <span className="services-header__meta-tag floating-3d-badge">Capabilities &bull; Engineering &amp; Advisory</span>
          </div>
          <Text3D
            as="h1"
            className="services-header__title"
            text="Engineering services delivered with predictability, clarity, and craft."
            depth="deep"
            sheen={true}
            gradient={true}
          />
          <p className="services-header__lead">
            Every technical engagement follows a structured framework: explicit problem definition, quantifiable deliverables, transparent architecture, and verified code handoffs.
          </p>

          <div className="services-header__notice">
            <OwnerNotice
              decisionId="S-01"
              title="Commercial Services Scope"
              description="Services reflect Quiclogix Solutions core engineering competencies. Commercial contracts, service level agreements, and timelines are tailored per engagement."
              variant="inline"
            />
          </div>
        </div>
      </section>

      {/* ==================== SERVICES CATALOG ==================== */}
      <Section
        tag="Services Catalog"
        title="Consulting Engagements"
        subtitle="Detailed breakdown of problems addressed, technical deliverables, and architectural stack."
        theme="white"
        spacing="spacious"
      >
        <div className="services-catalog">
          {SERVICES.map((service, idx) => (
            <Card3D key={service.id} maxTilt={6} delay={idx * 0.1} innerClassName="service-entry">
              <div className="service-entry__sidebar">
                <div className="service-entry__id-row">
                  <Badge variant="accent" size="sm">{service.category}</Badge>
                </div>
                <h3 className="service-entry__title depth-pop-md">{service.title}</h3>
                <div className="service-entry__audience-block">
                  <span className="service-entry__label">Target Audience</span>
                  <p className="service-entry__audience-text">{service.audience}</p>
                </div>
                <div className="service-entry__stack-block depth-pop-sm">
                  <span className="service-entry__label">Technology Stack</span>
                  <div className="service-entry__stack-tags">
                    {service.stack.map((tech) => (
                      <span key={tech} className="service-entry__tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="service-entry__details">
                <div className="service-entry__problem-block">
                  <span className="service-entry__label">Problem Statement</span>
                  <p className="service-entry__problem-text">{service.problem}</p>
                </div>

                <div className="service-entry__deliverables-block">
                  <span className="service-entry__label">Primary Deliverables</span>
                  <ul className="service-entry__deliverables-list">
                    {service.deliverables.map((item, idx) => (
                      <li key={idx}>
                        <span className="service-entry__bullet">—</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="service-entry__action depth-pop-sm">
                  <a href="#contact">
                    <Button variant="primary" size="md">
                      Inquire About This Service &rarr;
                    </Button>
                  </a>
                </div>
              </div>
            </Card3D>
          ))}
        </div>
      </Section>

      {/* ==================== GOVERNANCE MODEL ==================== */}
      <Section
        tag="Governance"
        title="Commercial &amp; Technical Governance"
        subtitle="Transparent milestones, clear IP boundaries, and zero vendor lock-in."
        theme="dark"
        spacing="spacious"
      >
        <div className="services-gov__grid">
          {[
            {
              title: 'Discovery & Architectural Scoping',
              text: 'We model data schemas, state boundaries, and interface contracts upfront. Clear acceptance criteria are agreed upon before work begins.'
            },
            {
              title: 'Demonstrable Weekly Increments',
              text: 'Stakeholders review working software every week. Code is continually tested with automated type checks and lint suites in an accessible staging environment.'
            },
            {
              title: 'Complete IP & Codebase Ownership',
              text: 'All source code, configuration files, schema migrations, and documentation are 100% client property from day one, with zero proprietary licensing lock-in.'
            }
          ].map((gov, gIdx) => (
            <Card3D key={gov.title} maxTilt={6} delay={gIdx * 0.08} innerClassName="services-gov__card">
              <h4 className="services-gov__title depth-pop-md">{gov.title}</h4>
              <p className="services-gov__text">{gov.text}</p>
            </Card3D>
          ))}
        </div>

        <div className="services-gov__footer-cta">
          <Text3D as="h3" className="services-gov__cta-title" text="Need a Custom Technical Proposal?" depth="subtle" />
          <p className="services-gov__cta-desc">
            Describe your engineering requirements, timelines, and technical constraints. Our engineering lead will conduct an initial feasibility review.
          </p>
          <a href="#contact">
            <Button variant="primary" size="lg">
              Initiate Technical Discussion
            </Button>
          </a>
        </div>
      </Section>
    </div>
  )
}
