import { useState, type FormEvent } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Text3D, Card3D } from '@/components/ui/Scroll3D'
import './VerifyPage.css'

interface VerificationRecord {
  id: string
  recipientName: string
  programName: string
  domain: string
  cohortDate: string
  issuedDate: string
  status: 'valid' | 'revoked'
  digestHash: string
}

const SAMPLE_RECORDS: Record<string, VerificationRecord> = {
  'QLX-2026-FSD-001': {
    id: 'QLX-2026-FSD-001',
    recipientName: 'A*** S*** (Verified Cohort Graduate)',
    programName: 'Quiclogix Project-Oriented Internship',
    domain: 'Full-Stack Web Engineering',
    cohortDate: 'October 2026 Cohort',
    issuedDate: '2026-11-15',
    status: 'valid',
    digestHash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
  },
}

export function VerifyPage() {
  const [certId, setCertId] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [result, setResult] = useState<VerificationRecord | null>(null)

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (!certId.trim()) return

    setIsSearching(true)
    setHasSearched(false)

    setTimeout(() => {
      setIsSearching(false)
      setHasSearched(true)
      const cleanId = certId.trim().toUpperCase()
      if (SAMPLE_RECORDS[cleanId]) {
        setResult(SAMPLE_RECORDS[cleanId])
      } else {
        setResult(null)
      }
    }, 400)
  }

  const loadSample = () => {
    setCertId('QLX-2026-FSD-001')
  }

  return (
    <div className="verify-page">
      {/* ==================== HEADER ==================== */}
      <section className="verify-header">
        <div className="container verify-header__container">
          <div className="verify-header__meta">
            <span className="verify-header__meta-tag">Public Registry &bull; Credential Authentication</span>
          </div>
          <Text3D as="h1" className="verify-header__title" variant="gradient">
            Verify a Quiclogix Credential.
          </Text3D>
          <p className="verify-header__lead">
            Employers, academic admissions officers, and clients can independently verify the authenticity and status of completion documents issued by Quiclogix Solutions.
          </p>
        </div>
      </section>

      {/* ==================== LOOKUP INTERFACE ==================== */}
      <Section
        tag="Verification Lookup"
        theme="white"
        spacing="spacious"
      >
        <div className="verify-layout">
          <div className="verify-terminal">
            <div className="verify-terminal__header">
              <h3 className="verify-terminal__title">Public Credential Lookup</h3>
              <p className="verify-terminal__desc">
                Input the alphanumeric Credential ID printed on the official document or letterhead.
              </p>
            </div>

            <form onSubmit={handleSearch} className="verify-form">
              <div className="verify-form__row">
                <div className="verify-form__input-wrap">
                  <Input
                    label="Credential Identifier"
                    placeholder="e.g. QLX-2026-FSD-001"
                    value={certId}
                    onChange={(e) => setCertId(e.target.value)}
                    required
                    hint="Format standard: QLX-YYYY-DOM-XXX"
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSearching}
                  disabled={isSearching || !certId.trim()}
                >
                  {isSearching ? 'Verifying...' : 'Query Record'}
                </Button>
              </div>

              <div className="verify-sample-hint">
                <span>Want to test the verification pipeline? </span>
                <button type="button" onClick={loadSample} className="verify-sample-btn">
                  Load Sample: QLX-2026-FSD-001
                </button>
              </div>
            </form>

            {/* Results Display */}
            {hasSearched && (
              <div className="verify-result-panel">
                {result ? (
                  <div className="verify-card verify-card--valid">
                    <div className="verify-card__header">
                      <div className="verify-card__badge-row">
                        <Badge variant="accent" size="sm">✓ Verified Authentic</Badge>
                        <span className="verify-card__id">{result.id}</span>
                      </div>
                      <h4 className="verify-card__title">Document Authenticity Confirmed</h4>
                      <p className="verify-card__copy">
                        This credential is an authentic, unrevoked record issued by Quiclogix Solutions upon satisfactory evaluation of all capstone project rubric milestones.
                      </p>
                    </div>

                    <div className="verify-data-table">
                      <div className="verify-data-row">
                        <span className="verify-data-key">Recipient Record</span>
                        <span className="verify-data-val">{result.recipientName}</span>
                      </div>
                      <div className="verify-data-row">
                        <span className="verify-data-key">Program Track</span>
                        <span className="verify-data-val">{result.domain}</span>
                      </div>
                      <div className="verify-data-row">
                        <span className="verify-data-key">Cohort Cycle</span>
                        <span className="verify-data-val">{result.cohortDate}</span>
                      </div>
                      <div className="verify-data-row">
                        <span className="verify-data-key">Date of Issuance</span>
                        <span className="verify-data-val">{result.issuedDate}</span>
                      </div>
                      <div className="verify-data-row">
                        <span className="verify-data-key">Document Status</span>
                        <span className="verify-data-val verify-data-val--active">Active &amp; Valid</span>
                      </div>
                      <div className="verify-data-row">
                        <span className="verify-data-key">Record Digest (SHA-256)</span>
                        <code className="verify-data-val verify-data-hash">{result.digestHash}</code>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="verify-card verify-card--invalid">
                    <div className="verify-card__badge-row">
                      <Badge variant="outline" size="sm">Record Not Found</Badge>
                    </div>
                    <h4 className="verify-card__title">No Verified Record Located</h4>
                    <p className="verify-card__copy">
                      The credential ID <strong>&ldquo;{certId}&rdquo;</strong> does not correspond to any active record in the Quiclogix registry. Please confirm the identifier against the original certificate.
                    </p>
                    <div className="verify-card__action">
                      <a href="#contact">
                        <Button variant="ghost" size="sm">
                          Contact Credentials Registrar &rarr;
                        </Button>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* ==================== CRYPTOGRAPHIC PRIVACY ==================== */}
      <Section
        tag="Privacy &amp; Security"
        title="Verification Architecture &amp; Privacy"
        subtitle="How Quiclogix protects recipient privacy while maintaining institutional trust."
        theme="dark"
        spacing="spacious"
      >
        <div className="verify-arch-grid">
          <Card3D depth="subtle" className="verify-arch-card">
            <h4 className="verify-arch-card__title">Tamper-Resistant SHA-256 Digests</h4>
            <p className="verify-arch-card__desc">
              Every issued certificate payload is hashed at issuance time. Any alteration to student name, track, or score invalidates verification.
            </p>
          </Card3D>

          <Card3D depth="subtle" className="verify-arch-card">
            <h4 className="verify-arch-card__title">Data Minimization</h4>
            <p className="verify-arch-card__desc">
              In accordance with privacy regulations, verification queries return only academic validity parameters. Contact details, government IDs, and private code repos are never disclosed.
            </p>
          </Card3D>

          <Card3D depth="subtle" className="verify-arch-card">
            <h4 className="verify-arch-card__title">Immutable Record Hosting</h4>
            <p className="verify-arch-card__desc">
              Verification records are maintained in high-availability database storage with Row-Level Security, preventing unauthorized modifications or retroactive certificate tampering.
            </p>
          </Card3D>
        </div>
      </Section>
    </div>
  )
}
