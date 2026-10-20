import { useState, useMemo } from 'react'
import { motion } from 'motion/react'
import { Badge } from '@/components/ui/Badge'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { Accordion, type AccordionItem } from '@/components/ui/Accordion'
import { OwnerNotice } from '@/components/ui/OwnerNotice'
import { INTERNSHIP_DOMAINS, type InternshipDomain } from '@/data/internshipDomains'
import { Card3D } from '@/components/ui/Scroll3D'
import './InternshipPage.css'

const CATEGORIES = [
  'All Tracks',
  'Software Engineering',
  'Data & AI',
  'Systems & Security',
  'Design & Strategy',
] as const

type CategoryFilter = (typeof CATEGORIES)[number]

const FAQ_ITEMS: AccordionItem[] = [
  {
    id: 'faq-1',
    title: 'How does the Quiclogix Internship differ from tutorial courses?',
    content: (
      <p>
        The Quiclogix Internship operates as a milestone-driven engineering simulation. You are treated as an engineer assigned to an industry-grade technical brief. Rather than passively watching videos, you write production code, submit pull requests, adhere to strict coding guidelines, and receive code evaluations based on industrial rubrics.
      </p>
    ),
  },
  {
    id: 'faq-2',
    title: 'Is the Letter of Recommendation (LOR) guaranteed to every participant?',
    content: (
      <div>
        <p>
          <strong>No.</strong> While a Verifiable Completion Certificate is awarded upon satisfying project rubric criteria, Letters of Recommendation are conditional.
        </p>
        <p style={{ marginTop: 'var(--space-2)' }}>
          To maintain the institutional credibility of Quiclogix recommendations with employers and universities, LORs are reserved strictly for participants demonstrating exemplary engineering rigor, timely delivery, and proactive code quality.
        </p>
        <div style={{ marginTop: 'var(--space-3)' }}>
          <OwnerNotice
            decisionId="D-02 / D-03"
            title="LOR Qualification Criteria"
            description="The rubric score threshold (e.g. 85%+ overall evaluation) will be formally ratified prior to open enrollment."
            variant="inline"
          />
        </div>
      </div>
    ),
  },
  {
    id: 'faq-3',
    title: 'What happens if a submission requires revisions?',
    content: (
      <p>
        Engineering is an iterative discipline. If an initial submission fails specific test criteria or security policies, your reviewer will provide concrete feedback. The program supports structured revision windows so you can address feedback and resubmit before final grading.
      </p>
    ),
  },
  {
    id: 'faq-4',
    title: 'What is the expected weekly time commitment?',
    content: (
      <p>
        Participants should expect to dedicate approximately 15 to 20 hours per week across the 4-week cohort. This includes reviewing technical specifications, writing and testing code, participating in milestone feedback reviews, and submitting revision requests.
      </p>
    ),
  },
  {
    id: 'faq-5',
    title: 'How are completion documents verified by third parties?',
    content: (
      <p>
        Every certificate carries a unique cryptographic verification identifier. Employers, academic institutions, and recruiters can visit the public <a href="#verify" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>Verify Certificate</a> page to confirm document authenticity without requiring any login.
      </p>
    ),
  },
]

export function InternshipPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All Tracks')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredDomains = useMemo(() => {
    return INTERNSHIP_DOMAINS.filter((domain) => {
      const matchesCategory =
        selectedCategory === 'All Tracks' || domain.category === selectedCategory
      const query = searchQuery.trim().toLowerCase()
      const matchesQuery =
        !query ||
        domain.name.toLowerCase().includes(query) ||
        domain.tag.toLowerCase().includes(query) ||
        domain.description.toLowerCase().includes(query) ||
        domain.skills.some((s) => s.toLowerCase().includes(query))
      return matchesCategory && matchesQuery
    })
  }, [selectedCategory, searchQuery])

  const handleApply = (domain: InternshipDomain) => {
    window.location.hash = `#apply?domain=${encodeURIComponent(domain.slug)}`
  }

  return (
    <div className="internship-page">
      {/* ==================== PAGE INTRODUCTORY HERO ==================== */}
      <section className="internship-hero">
        <div className="internship-hero__backdrop" aria-hidden="true">
          <div className="internship-hero__grid-pattern" />
          <div className="internship-hero__glow" />
        </div>

        <div className="container internship-hero__container">
          <div className="internship-hero__intro">
            <motion.div
              className="internship-hero__meta"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="internship-hero__meta-tag">
                <span className="internship-hero__pulse-dot" aria-hidden="true" />
                <span>Applied Learning &bull; Engineering Cohorts</span>
              </div>
            </motion.div>

            <motion.h1
              className="internship-hero__title"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
            >
              One month of production engineering,{' '}
              <span className="internship-hero__accent">verified outcomes.</span>
            </motion.h1>

            <motion.p
              className="internship-hero__lead"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
            >
              A structured, project-oriented engineering internship platform. Choose from 19 specialization domains, build production code against industrial briefs, and receive objective rubric evaluations.
            </motion.p>

            <motion.div
              className="internship-hero__actions"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.22 }}
            >
              <a href="#domains">
                <Button variant="primary" size="md">
                  Explore 19 Domains
                </Button>
              </a>
              <a href="#faq">
                <Button variant="secondary" size="md">
                  Cohort FAQs
                </Button>
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <Card3D maxTilt={4} innerClassName="internship-hero__spec-strip">
              <div className="internship-spec-cell">
                <span className="internship-spec-cell__label">Domains</span>
                <strong className="internship-spec-cell__val depth-pop-sm">19 Specializations</strong>
              </div>
              <div className="internship-spec-cell">
                <span className="internship-spec-cell__label">Duration</span>
                <strong className="internship-spec-cell__val depth-pop-sm">4 Weeks (1 Month)</strong>
              </div>
              <div className="internship-spec-cell">
                <span className="internship-spec-cell__label">Structure</span>
                <strong className="internship-spec-cell__val depth-pop-sm">Milestone Briefs &amp; Reviews</strong>
              </div>
              <div className="internship-spec-cell">
                <span className="internship-spec-cell__label">Credentials</span>
                <strong className="internship-spec-cell__val depth-pop-sm">Certificate + Merited LOR</strong>
              </div>
            </Card3D>
          </motion.div>
        </div>
      </section>

      {/* ==================== 19 DOMAIN DIRECTORY & APPLICATION ENTRY ==================== */}
      <Section
        id="domains"
        tag="Domain Directory"
        title="19 Available Internship Domains"
        subtitle="Explore all available engineering specializations. Each track features tailored capstone briefs and direct application entry."
        theme="paper"
        spacing="spacious"
      >
        {/* Controls: Search & Category Filter */}
        <div className="internship-catalog-controls">
          <div className="internship-search-wrap">
            <input
              type="text"
              className="internship-search-input"
              placeholder="Search domains by title, tag, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search internship domains"
            />
            {searchQuery && (
              <button
                type="button"
                className="internship-search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                &times;
              </button>
            )}
          </div>

          <div className="internship-category-tabs" role="tablist">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`internship-category-tab ${selectedCategory === cat ? 'internship-category-tab--active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
                role="tab"
                aria-selected={selectedCategory === cat}
              >
                {cat}
                <span className="internship-category-count">
                  {cat === 'All Tracks'
                    ? INTERNSHIP_DOMAINS.length
                    : INTERNSHIP_DOMAINS.filter((d) => d.category === cat).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Domain Cards Grid */}
        <div className="internship-domains-grid">
          {filteredDomains.map((domain, idx) => (
            <Card3D
              key={domain.id}
              maxTilt={9}
              delay={(idx % 6) * 0.05}
              innerClassName="internship-domain-card"
            >
              <div className="internship-domain-card__header depth-pop-sm">
                <Badge variant="outline" size="sm">{domain.category}</Badge>
                <span className="internship-domain-card__tag">{domain.tag}</span>
              </div>

              <h3 className="internship-domain-card__title depth-pop-md">{domain.name}</h3>
              <p className="internship-domain-card__desc">{domain.description}</p>

              <div className="internship-domain-card__skills">
                <span className="internship-domain-card__skills-label">Core Focus:</span>
                <div className="internship-domain-card__chips depth-pop-sm">
                  {domain.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="internship-domain-chip">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="internship-domain-card__brief">
                <span className="internship-domain-card__brief-label">Sample Brief:</span>
                <p className="internship-domain-card__brief-text">{domain.sampleBrief}</p>
              </div>

              <div className="internship-domain-card__footer depth-pop-sm">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleApply(domain)}
                  className="internship-domain-card__btn"
                >
                  Apply Now &rarr;
                </Button>
              </div>
            </Card3D>
          ))}
        </div>

        {filteredDomains.length === 0 && (
          <div className="internship-domains-empty">
            <p>No internship domains match your search query: &ldquo;{searchQuery}&rdquo;.</p>
            <Button variant="secondary" size="sm" onClick={() => { setSearchQuery(''); setSelectedCategory('All Tracks') }}>
              Reset Filters
            </Button>
          </div>
        )}
      </Section>

      {/* ==================== 4-WEEK SPRINT CADENCE ==================== */}
      <Section
        tag="Cadence"
        title="The 4-Week Milestone Sprint"
        subtitle="How your month is organized: structured milestones, weekly deliverables, and direct feedback."
        theme="white"
        spacing="spacious"
      >
        <div className="internship-sprint-grid">
          {[
            {
              week: 'Week 01',
              title: 'Scaffolding & Schema Modeling',
              desc: 'Analyze the project brief, design relational schemas, write TypeScript interfaces, and set up database migrations.'
            },
            {
              week: 'Week 02',
              title: 'Core Logic & API Security',
              desc: 'Implement database queries, serverless Edge Functions, authentication states, and Row-Level Security policies.'
            },
            {
              week: 'Week 03',
              title: 'Accessible UI Integration',
              desc: 'Connect interfaces to backend services, implement form validation, ensure keyboard accessibility, and manage client state.'
            },
            {
              week: 'Week 04',
              title: 'Audit, Testing & Rubric Review',
              desc: 'Run automated test suites, conduct WCAG AA audits, write technical documentation, and submit for evaluation.'
            }
          ].map((item, idx) => (
            <Card3D key={item.week} maxTilt={7} delay={idx * 0.08} innerClassName="internship-sprint-card">
              <span className="internship-sprint-card__week depth-pop-sm">{item.week}</span>
              <h4 className="internship-sprint-card__title depth-pop-md">{item.title}</h4>
              <p className="internship-sprint-card__desc">{item.desc}</p>
            </Card3D>
          ))}
        </div>
      </Section>

      {/* ==================== FREQUENTLY ASKED QUESTIONS ==================== */}
      <Section
        tag="FAQ"
        title="Frequently Asked Questions"
        subtitle="Common questions regarding eligibility, evaluations, policies, and credentials."
        theme="paper"
        spacing="spacious"
      >
        <div className="internship-faq-wrap">
          <Accordion items={FAQ_ITEMS} />
        </div>
      </Section>
    </div>
  )
}
