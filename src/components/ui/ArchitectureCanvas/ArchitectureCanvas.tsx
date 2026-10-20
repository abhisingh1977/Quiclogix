import { useState } from 'react'
import './ArchitectureCanvas.css'

interface LayerDetail {
  id: string
  title: string
  category: string
  description: string
  spec: string
  codeSnippet: string
}

const LAYERS: LayerDetail[] = [
  {
    id: 'security',
    title: 'Security & Schema Layer',
    category: 'PostgreSQL + RLS',
    description: 'Declarative access controls and database constraints enforced at the database engine, ensuring untrusted clients cannot bypass business rules.',
    spec: 'Database-level row filtering & role validation',
    codeSnippet: `CREATE POLICY "enforce_student_isolation"
  ON project_submissions
  FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());`,
  },
  {
    id: 'verification',
    title: 'Verification Engine',
    category: 'Cryptographic Integrity',
    description: 'Deterministic SHA-256 digest calculation on issued credentials, providing instant public verification without exposing sensitive student records.',
    spec: 'Immutable hash verification & anti-tampering',
    codeSnippet: `const digest = await crypto.subtle.digest(
  'SHA-256',
  new TextEncoder().encode(credentialPayload)
);
return toHex(digest); // Immutable verification`,
  },
  {
    id: 'contracts',
    title: 'Client Type Contracts',
    category: 'TypeScript & Tokens',
    description: 'End-to-end type safety from database schemas through UI components, paired with a semantic design token system for sub-millisecond rendering.',
    spec: 'Strict typing, zero layout shift, WCAG AA',
    codeSnippet: `export interface CredentialRecord {
  readonly id: string;
  readonly studentName: string;
  readonly track: 'Full-Stack' | 'Cloud';
  readonly verifiedAt: string;
  readonly hash: string;
}`,
  },
]

export function ArchitectureCanvas() {
  const [activeLayer, setActiveLayer] = useState<string>('verification')

  const current = LAYERS.find((l) => l.id === activeLayer) || LAYERS[0]

  return (
    <div className="arch-canvas" role="region" aria-label="Interactive Systems Architecture Diagram">
      <div className="arch-canvas__header">
        <div className="arch-canvas__folio">
          <span className="arch-canvas__dot" aria-hidden="true" />
          <span className="arch-canvas__folio-text">Architecture Specimen &bull; System Pipeline</span>
        </div>
        <div className="arch-canvas__tabs" role="tablist" aria-label="System layers">
          {LAYERS.map((layer) => {
            const isSelected = layer.id === activeLayer
            return (
              <button
                key={layer.id}
                role="tab"
                aria-selected={isSelected}
                aria-controls={`arch-panel-${layer.id}`}
                id={`arch-tab-${layer.id}`}
                className={`arch-canvas__tab ${isSelected ? 'arch-canvas__tab--active' : ''}`}
                onClick={() => setActiveLayer(layer.id)}
              >
                {layer.title.split(' ')[0]}
              </button>
            )
          })}
        </div>
      </div>

      <div
        id={`arch-panel-${current.id}`}
        role="tabpanel"
        aria-labelledby={`arch-tab-${current.id}`}
        className="arch-canvas__body"
      >
        <div className="arch-canvas__schematic">
          <svg className="arch-canvas__svg" viewBox="0 0 460 220" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            {/* Background grid hairlines */}
            <path d="M 30 110 H 430" stroke="currentColor" strokeOpacity="0.12" strokeDasharray="4 4" />
            <path d="M 120 40 V 180" stroke="currentColor" strokeOpacity="0.1" />
            <path d="M 230 30 V 190" stroke="currentColor" strokeOpacity="0.15" />
            <path d="M 340 40 V 180" stroke="currentColor" strokeOpacity="0.1" />

            {/* Connection Flow Wire */}
            <path
              d="M 60 110 H 400"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeOpacity="0.3"
            />

            {/* Node 1: Security */}
            <g className={`arch-node ${activeLayer === 'security' ? 'arch-node--active' : ''}`}>
              <rect x="50" y="75" width="80" height="70" rx="4" className="arch-node__box" />
              <circle cx="90" cy="110" r="14" className="arch-node__circle" />
              <circle cx="90" cy="110" r="4" fill="var(--color-accent)" />
              <text x="90" y="165" textAnchor="middle" className="arch-node__label">Schema &amp; RLS</text>
            </g>

            {/* Node 2: Verification Engine */}
            <g className={`arch-node ${activeLayer === 'verification' ? 'arch-node--active' : ''}`}>
              <rect x="180" y="65" width="100" height="90" rx="4" className="arch-node__box" />
              <circle cx="230" cy="110" r="18" className="arch-node__circle" />
              <circle cx="230" cy="110" r="6" fill="var(--color-accent)" />
              <text x="230" y="175" textAnchor="middle" className="arch-node__label">SHA-256 Engine</text>
            </g>

            {/* Node 3: Client Contracts */}
            <g className={`arch-node ${activeLayer === 'contracts' ? 'arch-node--active' : ''}`}>
              <rect x="330" y="75" width="80" height="70" rx="4" className="arch-node__box" />
              <circle cx="370" cy="110" r="14" className="arch-node__circle" />
              <circle cx="370" cy="110" r="4" fill="var(--color-accent)" />
              <text x="370" y="165" textAnchor="middle" className="arch-node__label">Type Contract</text>
            </g>
          </svg>
        </div>

        <div className="arch-canvas__details">
          <div className="arch-canvas__meta">
            <span className="arch-canvas__category">{current.category}</span>
            <h4 className="arch-canvas__title">{current.title}</h4>
            <p className="arch-canvas__desc">{current.description}</p>
          </div>

          <div className="arch-canvas__code-block">
            <div className="arch-canvas__code-header">
              <span className="arch-canvas__code-tag">Implementation Spec</span>
              <span className="arch-canvas__code-lang">TypeScript / SQL</span>
            </div>
            <pre className="arch-canvas__pre">
              <code>{current.codeSnippet}</code>
            </pre>
          </div>
        </div>
      </div>

      <div className="arch-canvas__footer">
        <span className="arch-canvas__footer-rule" />
        <span className="arch-canvas__spec-text">Standard: Strict Typing &bull; Cryptographic Record &bull; Row Security</span>
      </div>
    </div>
  )
}
