import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Section } from '@/components/ui/Section'
import { OwnerNotice } from '@/components/ui/OwnerNotice'
import './LegalPage.css'

export type LegalTab = 'privacy' | 'terms' | 'refund'

export interface LegalPageProps {
  initialTab?: LegalTab
}

export function LegalPage({ initialTab = 'privacy' }: LegalPageProps) {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab)

  return (
    <div className="legal-page">
      {/* ==================== HEADER ==================== */}
      <section className="legal-header">
        <div className="container legal-header__container">
          <div className="legal-header__meta">
            <span className="legal-header__meta-tag">Governance &bull; Terms &amp; Policies</span>
          </div>
          <h1 className="legal-header__title">
            Legal Terms &amp; <span className="legal-header__accent">Policies</span>.
          </h1>
          <p className="legal-header__lead">
            Official operational frameworks governing Quiclogix Solutions corporate engineering advisory, intellectual property boundaries, and participant privacy.
          </p>

          <div className="legal-header__notice">
            <OwnerNotice
              decisionId="B-02 / P-02"
              title="Official Legal Draft Status"
              description="These policies establish our foundational compliance architecture. Final binding legal language will be ratified by corporate legal counsel upon registration."
              variant="inline"
            />
          </div>
        </div>
      </section>

      {/* ==================== LEGAL DOCUMENTATION TERMINAL ==================== */}
      <Section
        tag="Statutory Policies"
        theme="white"
        spacing="spacious"
      >
        <div className="legal-container">
          <div className="legal-tabs" role="tablist" aria-label="Legal document selection">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'privacy'}
              className={`legal-tab ${activeTab === 'privacy' ? 'legal-tab--active' : ''}`}
              onClick={() => setActiveTab('privacy')}
            >
              <span>Privacy Policy</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'terms'}
              className={`legal-tab ${activeTab === 'terms' ? 'legal-tab--active' : ''}`}
              onClick={() => setActiveTab('terms')}
            >
              <span>Terms of Service</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'refund'}
              className={`legal-tab ${activeTab === 'refund' ? 'legal-tab--active' : ''}`}
              onClick={() => setActiveTab('refund')}
            >
              <span>Payment &amp; Refund Policy</span>
            </button>
          </div>

          <article className="legal-article">
            {/* PRIVACY POLICY */}
            {activeTab === 'privacy' && (
              <div className="legal-doc" role="tabpanel" aria-labelledby="privacy-tab">
                <header className="legal-doc__header">
                  <div className="legal-doc__meta">
                    <Badge variant="accent" size="sm">Privacy Policy</Badge>
                    <span className="legal-doc__date">Effective: October 2026</span>
                  </div>
                  <h2 className="legal-doc__heading">Participant &amp; Client Data Protection Policy</h2>
                </header>

                <div className="legal-doc__body">
                  <OwnerNotice
                    decisionId="B-02"
                    title="Data Fiduciary Corporate Registration"
                    description="Official corporate registration details and appointed Data Protection Officer (DPO) contact will be inserted upon legal incorporation."
                  />

                  <h3>1. Scope and Principles</h3>
                  <p>
                    Quiclogix Solutions operates in compliance with applicable data protection legislation, including the Digital Personal Data Protection Act (DPDPA) and the General Data Protection Regulation (GDPR) for international participants. We adhere strictly to data minimization, lawful processing, and purpose limitation.
                  </p>

                  <h3>2. Information We Collect</h3>
                  <p>
                    We collect only the personal information strictly necessary to provide engineering services, triage contact inquiries, assess internship applicants, and manage cohort evaluations:
                  </p>
                  <ul>
                    <li>Identity &amp; Contact: Full name, verified email address, portfolio/GitHub link.</li>
                    <li>Technical Submissions: Code repositories, architectural diagrams, sprint deliverables.</li>
                    <li>Verification Data: Unique certificate identifiers, issuance dates, track completion records.</li>
                  </ul>

                  <h3>3. Data Security and Confidentiality</h3>
                  <p>
                    All personal data is encrypted in transit using TLS 1.3 and at rest using AES-256. Database records are partitioned with granular PostgreSQL Row-Level Security policies. We never sell, rent, or monetize client or participant data.
                  </p>
                </div>
              </div>
            )}

            {/* TERMS OF SERVICE */}
            {activeTab === 'terms' && (
              <div className="legal-doc" role="tabpanel" aria-labelledby="terms-tab">
                <header className="legal-doc__header">
                  <div className="legal-doc__meta">
                    <Badge variant="accent" size="sm">Terms of Service</Badge>
                    <span className="legal-doc__date">Effective: October 2026</span>
                  </div>
                  <h2 className="legal-doc__heading">Corporate &amp; Program Terms of Service</h2>
                </header>

                <div className="legal-doc__body">
                  <OwnerNotice
                    decisionId="B-02 / T-01"
                    title="Governing Jurisdiction &amp; Legal Entity"
                    description="Governing jurisdiction, dispute resolution venue, and arbitration clauses will be finalized upon formal corporate registration."
                  />

                  <h3>1. Commercial Consulting Engagements</h3>
                  <p>
                    All bespoke technology consulting, architecture design, and system modernization services are governed by written Statement of Work (SOW) agreements specifying deliverables, milestones, payment schedules, and intellectual property transfer terms.
                  </p>

                  <h3>2. Internship Program Terms</h3>
                  <p>
                    Participation in the Quiclogix Internship Program is subject to the following non-negotiable standards:
                  </p>
                  <ul>
                    <li>The program is a fee-based training and evaluation sprint, not employment.</li>
                    <li>Completion credentials require satisfying published rubric benchmarks.</li>
                    <li>Code submitted must represent the original work of the enrolled participant.</li>
                  </ul>

                  <h3>3. Intellectual Property Rights</h3>
                  <p>
                    In client consulting engagements, all client deliverables become the exclusive property of the client upon settlement. In internship programs, participants retain full ownership of their individual capstone codebases.
                  </p>
                </div>
              </div>
            )}

            {/* PAYMENT & REFUND POLICY */}
            {activeTab === 'refund' && (
              <div className="legal-doc" role="tabpanel" aria-labelledby="refund-tab">
                <header className="legal-doc__header">
                  <div className="legal-doc__meta">
                    <Badge variant="accent" size="sm">Payment &amp; Refund Policy</Badge>
                    <span className="legal-doc__date">Effective: October 2026</span>
                  </div>
                  <h2 className="legal-doc__heading">Payment Processing &amp; Refund Policy</h2>
                </header>

                <div className="legal-doc__body">
                  <OwnerNotice
                    decisionId="P-01 / P-02"
                    title="Authorized Payment Gateway &amp; Refund Windows"
                    description="Formal payment processor integration (Razorpay / Stripe) and exact refund day-count windows will be specified prior to payment collection."
                  />

                  <h3>1. Fee Transparency</h3>
                  <p>
                    All program fees, taxes, and service charges are published upfront. Quiclogix Solutions maintains zero hidden fees, unexpected upgrade costs, or mandatory add-on purchases.
                  </p>

                  <h3>2. Withdrawal and Refund Procedures</h3>
                  <p>
                    We acknowledge that unanticipated circumstances may require withdrawal. Our transparent policy ensures fair consumer treatment:
                  </p>
                  <ul>
                    <li>Withdrawal before cohort orientation: Eligible for a full refund minus nominal processing costs.</li>
                    <li>Withdrawal during Week 01: Eligible for a 50% pro-rata refund.</li>
                    <li>Withdrawal after Week 01: Fees become non-refundable due to allocated mentor resources.</li>
                  </ul>

                  <h3>3. Deferral Policy</h3>
                  <p>
                    Participants facing medical or emergency constraints may request a one-time enrollment deferral to a subsequent monthly cohort with no administrative penalty.
                  </p>
                </div>
              </div>
            )}
          </article>
        </div>
      </Section>

      {/* ==================== COMPLIANCE ESCALATION ==================== */}
      <Section
        tag="Compliance"
        title="Compliance &amp; Legal Inquiries"
        subtitle="For regulatory inquiries, statutory verification requests, or data privacy notices."
        theme="dark"
        spacing="spacious"
      >
        <div className="legal-escalation">
          <p>
            Please direct all formal compliance inquiries, credential authenticity audits, or data rights requests to our compliance desk.
          </p>
          <div className="legal-escalation__action">
            <a href="#contact" className="legal-escalation__btn">
              Submit a Compliance Inquiry &rarr;
            </a>
          </div>
        </div>
      </Section>
    </div>
  )
}
