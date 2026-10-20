import { useState, type ChangeEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Section } from '@/components/ui/Section'
import './ComponentGallery.css'

/**
 * Component Gallery — visual review of all design system primitives.
 * This is a development-only page for inspecting and approving the design system.
 * It will not ship to production.
 */
export function ComponentGallery() {
  const [inputValue, setInputValue] = useState('')
  const [errorInput, setErrorInput] = useState('bad@')

  return (
    <div className="gallery">
      <div className="container">
        <div className="gallery__header">
          <h1 className="gallery__title">
            Quiclogix <span className="gradient-text">Design System</span>
          </h1>
          <p className="gallery__subtitle">
            Component gallery for visual review. All tokens, primitives, and interaction states.
          </p>
        </div>

        {/* ---- Colors ---- */}
        <Section title="Color Palette" subtitle="HSL-based color tokens for dark and light themes." spacing="compact">
          <div className="gallery__color-grid">
            <div className="gallery__swatch" style={{ background: 'var(--color-bg-primary)' }}>
              <span>bg-primary</span>
            </div>
            <div className="gallery__swatch" style={{ background: 'var(--color-bg-secondary)' }}>
              <span>bg-secondary</span>
            </div>
            <div className="gallery__swatch" style={{ background: 'var(--color-bg-tertiary)' }}>
              <span>bg-tertiary</span>
            </div>
            <div className="gallery__swatch" style={{ background: 'var(--color-bg-elevated)' }}>
              <span>bg-elevated</span>
            </div>
            <div className="gallery__swatch gallery__swatch--accent" style={{ background: 'var(--color-accent)' }}>
              <span>accent</span>
            </div>
            <div className="gallery__swatch gallery__swatch--accent" style={{ background: 'var(--color-accent-hover)' }}>
              <span>accent-hover</span>
            </div>
            <div className="gallery__swatch gallery__swatch--accent" style={{ background: 'var(--color-success)' }}>
              <span>success</span>
            </div>
            <div className="gallery__swatch gallery__swatch--accent" style={{ background: 'var(--color-warning)' }}>
              <span>warning</span>
            </div>
            <div className="gallery__swatch gallery__swatch--accent" style={{ background: 'var(--color-error)' }}>
              <span>error</span>
            </div>
            <div className="gallery__swatch gallery__swatch--accent" style={{ background: 'var(--color-info)' }}>
              <span>info</span>
            </div>
          </div>
        </Section>

        {/* ---- Typography ---- */}
        <Section title="Typography" subtitle="Plus Jakarta Sans for display, Inter for body, JetBrains Mono for code." spacing="compact">
          <div className="gallery__type-samples">
            <h1>Heading 1 — The quick brown fox</h1>
            <h2>Heading 2 — The quick brown fox</h2>
            <h3>Heading 3 — The quick brown fox</h3>
            <h4>Heading 4 — The quick brown fox</h4>
            <h5>Heading 5 — The quick brown fox</h5>
            <h6>Heading 6 — The quick brown fox</h6>
            <p>Body text — The quick brown fox jumps over the lazy dog. This paragraph demonstrates the body font at comfortable reading size with proper line height and character width limits.</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>
              <code>Monospace — const result = await verifyPayment(webhookData);</code>
            </p>
          </div>
        </Section>

        {/* ---- Buttons ---- */}
        <Section title="Buttons" subtitle="Primary, secondary, ghost, and danger variants with sizes and states." spacing="compact">
          <div className="gallery__row">
            <Button variant="primary" size="sm">Small Primary</Button>
            <Button variant="primary" size="md">Medium Primary</Button>
            <Button variant="primary" size="lg">Large Primary</Button>
          </div>
          <div className="gallery__row">
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
          <div className="gallery__row">
            <Button variant="primary" isLoading>Loading</Button>
            <Button variant="primary" disabled>Disabled</Button>
            <Button variant="primary" fullWidth>Full Width</Button>
          </div>
          <div className="gallery__row">
            <Button
              variant="primary"
              leftIcon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              }
            >
              With Icon
            </Button>
          </div>
        </Section>

        {/* ---- Cards ---- */}
        <Section title="Cards" subtitle="Container components with variant options and hover effects." spacing="compact">
          <div className="gallery__card-grid">
            <Card variant="default" hoverable>
              <CardHeader><h4>Default Card</h4></CardHeader>
              <CardBody><p>Subtle background with border.</p></CardBody>
              <CardFooter>
                <Button variant="ghost" size="sm">Action</Button>
              </CardFooter>
            </Card>
            <Card variant="elevated" hoverable>
              <CardHeader><h4>Elevated Card</h4></CardHeader>
              <CardBody><p>Shadow lift with hover transform.</p></CardBody>
              <CardFooter>
                <Button variant="ghost" size="sm">Action</Button>
              </CardFooter>
            </Card>
            <Card variant="outlined" hoverable>
              <CardHeader><h4>Outlined Card</h4></CardHeader>
              <CardBody><p>Transparent with visible border.</p></CardBody>
              <CardFooter>
                <Button variant="ghost" size="sm">Action</Button>
              </CardFooter>
            </Card>
            <Card variant="glass" hoverable>
              <CardHeader><h4>Glass Card</h4></CardHeader>
              <CardBody><p>Frosted glass with blur backdrop.</p></CardBody>
              <CardFooter>
                <Button variant="ghost" size="sm">Action</Button>
              </CardFooter>
            </Card>
          </div>
        </Section>

        {/* ---- Badges ---- */}
        <Section title="Badges" subtitle="Status indicators and category labels." spacing="compact">
          <div className="gallery__row">
            <Badge variant="default">Default</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="info">Info</Badge>
          </div>
          <div className="gallery__row">
            <Badge variant="accent" size="sm">Small</Badge>
            <Badge variant="accent" size="md">Medium</Badge>
          </div>
        </Section>

        {/* ---- Inputs ---- */}
        <Section title="Form Inputs" subtitle="Accessible inputs with labels, hints, errors, and icons." spacing="compact">
          <div className="gallery__form-grid">
            <Input
              label="Full Name"
              placeholder="Enter your name"
              value={inputValue}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
              hint="As it appears on official documents."
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              required
              value={errorInput}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setErrorInput(e.target.value)}
              error={errorInput.length > 0 && !errorInput.includes('.') ? 'Please enter a valid email address.' : undefined}
            />
            <Input
              label="Disabled Field"
              value="Cannot edit"
              disabled
            />
            <Input
              label="With Icon"
              placeholder="Search..."
              leftIcon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
              }
            />
          </div>
        </Section>

        {/* ---- Gradient Text ---- */}
        <Section title="Special Effects" subtitle="Gradient text, glass panels, and dot grid backgrounds." spacing="compact">
          <h2 className="gradient-text" style={{ marginBottom: 'var(--space-6)' }}>
            This is gradient text
          </h2>
          <Card variant="glass" padding="lg">
            <p>This card uses the glass variant with backdrop blur.</p>
          </Card>
        </Section>
      </div>
    </div>
  )
}
