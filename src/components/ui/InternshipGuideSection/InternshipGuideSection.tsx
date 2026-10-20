import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { type InternshipGuide } from '@/data/internshipGuides'
import './InternshipGuideSection.css'

export interface InternshipGuideSectionProps {
  guide?: InternshipGuide
  domainName: string
}

export function InternshipGuideSection({ guide, domainName }: InternshipGuideSectionProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const title = guide?.guideTitle || `${domainName} Internship Guide & Technical Brief`
  const isAvailable = Boolean(guide?.isAvailable && guide?.pdfUrl)
  const targetFileName = guide?.fileName || `${domainName.replace(/\s+/g, '_')}_Internship_Guide.pdf`

  // Robust download handler that works across cross-origin Supabase URLs
  const handleDownload = async () => {
    if (!isAvailable || !guide?.pdfUrl) return

    setIsDownloading(true)
    try {
      // 1. Fetch as blob to create a same-origin URL (forces browser to honor HTML5 download attribute)
      const res = await fetch(guide.pdfUrl)
      if (!res.ok) throw new Error('Blob fetch failed')
      const blob = await res.blob()
      const blobUrl = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = blobUrl
      a.download = targetFileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000)
    } catch {
      // 2. Direct fallback using Supabase Storage ?download= parameter
      // Supabase natively returns Content-Disposition: attachment when ?download is appended
      const sep = guide.pdfUrl.includes('?') ? '&' : '?'
      const downloadUrl = `${guide.pdfUrl}${sep}download=${encodeURIComponent(targetFileName)}`
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = targetFileName
      a.target = '_blank'
      a.rel = 'noopener noreferrer'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <section className="internship-guide-section" aria-labelledby="guide-section-heading">
      <div className="internship-guide-card">
        {/* Header Tag & Title */}
        <div className="internship-guide-card__header">
          <div className="internship-guide-card__meta">
            <Badge variant="accent" size="sm">Required Reading</Badge>
            <span className="internship-guide-card__track">{domainName}</span>
          </div>

          <h2 id="guide-section-heading" className="internship-guide-card__title">
            Read Your Internship Guide Before Applying
          </h2>
          <p className="internship-guide-card__subtitle">
            Every Quiclogix domain follows a structured milestone brief. Please examine the syllabus, project requirements, and evaluation rubrics before submitting your candidacy.
          </p>
        </div>

        {/* Domain PDF Information */}
        <div className="internship-guide-card__content">
          <div className="internship-guide-doc">
            <div className="internship-guide-doc__icon" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>

            <div className="internship-guide-doc__details">
              <div className="internship-guide-doc__title-row">
                <h3 className="internship-guide-doc__title">{title}</h3>
                <span className="internship-guide-doc__pill">Official Curriculum PDF</span>
              </div>
              <p className="internship-guide-doc__desc">
                {guide?.description || `Official milestone instructions, deliverables, and assessment criteria for the ${domainName} specialization.`}
              </p>
            </div>
          </div>

          {/* Availability State & Actions */}
          <div className="internship-guide-card__actions">
            {isAvailable && guide?.pdfUrl ? (
              <div className="internship-guide-btn-group">
                {/* 1. Download Internship Guide */}
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  isLoading={isDownloading}
                  onClick={handleDownload}
                  className="internship-guide-btn internship-guide-btn--primary"
                  title={`Download ${targetFileName}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginRight: '8px' }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  {isDownloading ? 'Downloading...' : 'Download Internship Guide'}
                </Button>

                {/* 2. View PDF (Opens directly in high-res browser PDF viewer) */}
                <a
                  href={guide.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--secondary btn--md internship-guide-btn internship-guide-link-btn"
                  title="Open official PDF guide in a new tab"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginRight: '8px' }}>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  View PDF
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginLeft: '6px', opacity: 0.8 }}>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>

                {/* 3. Optional Inline Preview */}
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => setIsPreviewOpen(true)}
                  className="internship-guide-btn internship-guide-preview-toggle"
                  title="Preview guide in modal overlay"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginRight: '8px' }}>
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                  Preview in Page
                </Button>
              </div>
            ) : (
              <div className="internship-guide-coming-soon" role="status">
                <div className="internship-guide-coming-soon__badge">
                  <span className="internship-guide-coming-soon__dot" aria-hidden="true" />
                  <span>Internship guide coming soon</span>
                </div>
                <p className="internship-guide-coming-soon__text">
                  The official curriculum and project guidelines PDF for <strong>{domainName}</strong> will be released shortly. You may complete and submit your application below now to secure your review priority.
                </p>
                <div className="internship-guide-coming-soon__action">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled
                    title="The PDF for this domain will be available shortly"
                  >
                    Download Guide (Available Soon)
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Safe PDF Preview Modal */}
      {isPreviewOpen && isAvailable && guide?.pdfUrl && (
        <div className="guide-modal-overlay" onClick={() => setIsPreviewOpen(false)} role="dialog" aria-modal="true" aria-label={title}>
          <div className="guide-modal" onClick={(e) => e.stopPropagation()}>
            <div className="guide-modal__header">
              <div className="guide-modal__header-info">
                <h3 className="guide-modal__title">{title}</h3>
                <span className="guide-modal__subtitle">{domainName} &bull; Official Internship Tasks</span>
              </div>
              <div className="guide-modal__header-actions">
                <a
                  href={guide.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--secondary btn--sm internship-guide-link-btn"
                  style={{ marginRight: '8px' }}
                >
                  Open in New Tab &nearr;
                </a>
                <button
                  type="button"
                  className="guide-modal__close"
                  onClick={() => setIsPreviewOpen(false)}
                  aria-label="Close PDF preview"
                >
                  &times;
                </button>
              </div>
            </div>
            <div className="guide-modal__body">
              <object
                data={guide.pdfUrl}
                type="application/pdf"
                className="guide-modal__iframe"
              >
                <div className="guide-modal__fallback">
                  <p>Your browser is unable to display the PDF inline.</p>
                  <a
                    href={guide.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--primary btn--md internship-guide-link-btn"
                  >
                    Open PDF in New Tab &rarr;
                  </a>
                </div>
              </object>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

