# Implementation Plan — Quiclogix Solutions

Version: 1.0
Status: Proposed — awaiting owner approval of open decisions before execution
Last updated: 2026-10-13

---

## Build Philosophy

1. **Vertical slices**: each phase delivers a testable, demonstrable capability.
2. **Security-first**: RLS, Storage policies, and server-side validation are implemented and tested before the feature is considered complete.
3. **Real content only**: placeholder text is structurally marked `[OWNER: ...]` and must never ship to production.
4. **No premature deployment**: production launch is gated by Phase 6 acceptance.

---

## Phase 0 — Project Setup and Planning ✅ IN PROGRESS

**Goal**: Establish workspace, documentation, and toolchain. No application code yet.

### Deliverables
- [x] Workspace inspected
- [x] `docs/PRD.md` — baseline product requirements
- [x] `docs/ARCHITECTURE.md` — proposed stack, schema, security model
- [x] `docs/MEMORY.md` — project state tracker
- [x] `docs/decisions/OPEN_DECISIONS.md` — all owner-blocking decisions catalogued
- [x] `docs/decisions/SECURITY_MATRIX.md` — RLS/Storage/Edge Function policy matrix
- [x] `docs/IMPLEMENTATION_PLAN.md` — this phased build plan
- [ ] Git repository initialized with `.gitignore`
- [ ] Owner review and approval of PRD, architecture, and open decisions

### Acceptance Tests
| # | Test | Evidence |
|---|------|----------|
| 0.1 | All six docs exist and are internally consistent | File listing, manual review |
| 0.2 | Open decisions are catalogued with priorities | `OPEN_DECISIONS.md` reviewed |
| 0.3 | Security matrix covers every table and storage bucket | `SECURITY_MATRIX.md` reviewed |
| 0.4 | No code, dependencies, or Supabase connections created | Workspace inspection |
| 0.5 | MEMORY.md reflects actual state | MEMORY.md content |

---

## Phase 1 — Design System and Public Website

**Goal**: Ship a fully responsive, production-quality public website with the design system, real content (or clearly marked owner-required placeholders), and no portal features.

**Blocked by**: B-03 (logo), B-04 (colors), B-05 (typography), B-06 (tagline), B-07 (about copy), S-01 (services), S-02 (projects), I-01 through I-03 and I-06 (program info). Can start design system and layout with placeholder marks; cannot launch.

### Sub-phases

#### 1A — Toolchain and Design System
- Initialize Vite + React + TypeScript project (no `npm install` until approved)
- Configure Tailwind CSS with custom design tokens
- Define color palette, typography scale, spacing, breakpoints, shadows, border radii
- Build foundational UI components: Button, Card, Badge, Input, Textarea, Select, Container, Section, Grid
- Build layout components: Navbar, Footer, MobileMenu, PageLayout
- Build motion primitives: FadeIn, SlideUp, StaggerChildren (Framer Motion for component transitions)
- Implement dark/light mode toggle with system preference detection
- Implement reduced-motion media query support
- Create `_dev/component-gallery.tsx` for visual review

#### 1B — Public Pages
- Home: hero with CTA, services overview, featured projects, internship teaser, contact CTA
- About: company story, approach, team (all owner-supplied)
- Services: service cards with problem/deliverable/audience structure
- Projects: case study cards with context/contribution/stack/outcome; honesty labels
- Internship Program: domains, eligibility, fee, duration, inclusions, certificate/LOR policy, refund terms, FAQs
- Contact: validated form with honeypot/rate limiting, success/error states
- Privacy Policy, Terms of Service, Payment/Refund Policy: legal page templates
- Public Certificate Verification: input field, lookup result display
- 404 page

#### 1C — SEO, Accessibility, and Performance
- Page titles, meta descriptions, Open Graph tags, canonical URLs
- Sitemap generation
- Semantic HTML audit: heading hierarchy, landmarks, alt text
- Keyboard navigation and focus management
- Color contrast check (WCAG AA minimum)
- Responsive testing at 320px, 768px, 1024px, 1440px
- Lighthouse audit (target: Performance ≥90, Accessibility ≥95, SEO ≥95)

### Acceptance Tests
| # | Test | Evidence |
|---|------|----------|
| 1.1 | All public pages render on desktop and mobile | Screenshots at 4 breakpoints |
| 1.2 | Navigation works on desktop and mobile (hamburger menu) | Manual test recording |
| 1.3 | No fake testimonials, clients, metrics, or awards | Content audit |
| 1.4 | Internship page publishes fee, eligibility, cert/LOR policy before any CTA | Page screenshot |
| 1.5 | Contact form validates client-side and shows success/error states | Form interaction test |
| 1.6 | Dark/light mode toggle works and respects system preference | Toggle test |
| 1.7 | Reduced-motion preference disables animations | `prefers-reduced-motion` test |
| 1.8 | Lighthouse scores meet targets | Lighthouse report |
| 1.9 | All pages have unique titles and meta descriptions | SEO audit |
| 1.10 | Certificate verification UI renders with "not found" state | UI test |
| 1.11 | Legal pages have correct content structure | Content review |
| 1.12 | No Supabase connection or auth required for public pages | Network tab inspection |

---

## Phase 2 — Supabase Foundation

**Goal**: Set up the database schema, RLS policies, Storage buckets, and auth configuration. Prove security with automated tests before building features.

**Blocked by**: O-01 (Supabase project approval).

### Deliverables
- Supabase project created (development environment only)
- `supabase/config.toml` configured
- `.env.example` with required variables (no secrets committed)
- Database migrations for all tables from Architecture §6
- Enum types or check constraints for all status fields
- Indexes on ownership, status, cohort, and common query columns
- RLS policies matching `SECURITY_MATRIX.md` for every table
- Storage buckets created: `resumes`, `project-reports`, `certificates`, `lors`
- Storage policies matching `SECURITY_MATRIX.md`
- Auth configuration: email/password, email verification, password recovery
- Development seed data (`supabase/seed.sql`) with test users for each role
- Generated TypeScript types from schema

### Acceptance Tests
| # | Test | Evidence |
|---|------|----------|
| 2.1 | All migrations apply cleanly from scratch (`supabase db reset`) | Migration output |
| 2.2 | Anonymous cannot read `applications`, `payments`, `profiles`, `evaluations` | RLS test query |
| 2.3 | Applicant can SELECT own application, cannot SELECT others | RLS test |
| 2.4 | Applicant cannot UPDATE `applications.status`, `payments.*`, `evaluations.*`, `issued_documents.*` | RLS test |
| 2.5 | Applicant cannot INSERT into `user_roles` | RLS test |
| 2.6 | Reviewer can SELECT only assigned submissions and evaluations | RLS test |
| 2.7 | Reviewer cannot INSERT into `payments`, `issued_documents`, `user_roles` | RLS test |
| 2.8 | Admin can SELECT all tables | RLS test |
| 2.9 | No user can UPDATE or DELETE `audit_logs` | RLS test |
| 2.10 | `payment_events` unique constraint prevents duplicate webhook events | Constraint test |
| 2.11 | `issued_documents` unique constraint prevents duplicate verification IDs | Constraint test |
| 2.12 | Storage: applicant can upload to own resume path, cannot read others | Storage policy test |
| 2.13 | Storage: student can upload project report, cannot access other students' files | Storage policy test |
| 2.14 | Storage: certificate bucket allows no client uploads | Storage policy test |
| 2.15 | Generated TypeScript types compile without errors | `tsc --noEmit` |
| 2.16 | `.env.example` lists all required variables with descriptions | File review |
---

## Phase 2B — Public Internship Application System (Auth-Free Architecture) ✅ COMPLETED

**Goal**: Transform website into a 100% public experience with 19 domain cards, domain-specific PDF guide previews, unauthenticated application flow, and private backend review via Supabase Table Editor.

### Deliverables
- [x] Website authentication completely eliminated (removed AuthProvider, AuthPopup, AuthPage, PortalPage, and Navbar auth badge)
- [x] Canonical 19 domain catalog integrated into `#internship` with individual cards
- [x] `InternshipGuideSection` added to the top of `#apply?domain=...` with PDF preview/download and honest "Internship guide coming soon" state
- [x] Public `ApplyPage` with real-time validation, branch conditional logic, PDF resume upload, and copyable reference ID confirmation
- [x] Safe database migration `supabase/migrations/20261020000000_public_application_system.sql` + `FULL_SETUP.sql`:
  - `public.internship_applications` table
  - `public.application_email_logs` table
  - Strict RLS denying anonymous `SELECT`
  - `public.submit_public_application(...)` SECURITY DEFINER RPC with 24h duplicate prevention and `QLX-2026-APP-XXXXX` reference generation
- [x] Edge Function `supabase/functions/handle-selection/index.ts` with idempotent selection workflow, HTML offer letter template, and email log recording
- [x] Automated test suites verified (`npm test` 256 passed, `npm run build` succeeds cleanly)

### Acceptance Tests
| # | Test | Evidence |
|---|------|----------|
| 2B.1 | Public navigation works without login prompts or auth popups | In-browser test |
| 2B.2 | No Portal or Admin links in navigation | DOM verification |
| 2B.3 | All 19 domains appear exactly once with direct Apply links | Domain directory verification |
| 2B.4 | Guide banner appears at top of application form with domain title | UI rendering test |
| 2B.5 | Missing PDFs display honest "Internship guide coming soon" | UI verification |
| 2B.6 | Client & server validation enforce required fields | RPC and client validation tests |
| 2B.7 | Reference ID format `QLX-2026-APP-XXXXX` returned on submission | Stored procedure test |
| 2B.8 | Anonymous SELECT on `internship_applications` blocked by RLS | Database RLS policy |
| 2B.9 | Selection is non-automatic and managed via private backend | Schema & Edge Function |
| 2B.10| Build succeeds with 0 TypeScript errors | `npm run build` output |


---

## Phase 3 — Authentication, Applications, and Payments

**Goal**: Complete the applicant journey from sign-up through accepted application and verified payment.

**Blocked by**: P-01 (payment provider), I-01–I-07 (program configuration), P-02 (refund policy).

### Deliverables

#### 3A — Auth Flows
- Sign up with email/password
- Email verification flow
- Sign in / sign out
- Password recovery
- Auth state management (React context/hook)
- Protected route wrapper
- Role-based navigation

#### 3B — Updated Internship Discovery & Student Application Flow (2026-10-16)
- **Public Domain Catalog**: Central display of all 19 owner-approved domains on Internship tab with titles, descriptions, and direct "Apply Now" actions.
- **Stateful Domain Preservation**: Selecting "Apply Now" on any domain directs unauthenticated visitors to `#auth?redirect=apply&domain=<slug>` and seamlessly returns them to `#apply?domain=<slug>` upon login.
- **Comprehensive Application Form**:
  - Full Name (prefilled from profile)
  - Account Email (authenticated, read-only)
  - Phone Number (optional/contact)
  - Course or Degree
  - Branch / Specialization (mandatory for engineering students; conditionally optional for others)
  - College / Institution Name
  - Current Study Year or Graduation Year
  - Selected Internship Domain (authoritative 19-domain list)
  - Skills, Portfolio, or GitHub URL
  - Private Resume Upload ($\le 5$MB PDF to `resumes` bucket)
  - Statutory declarations & policy consent
- **Draft Saving & Resumption**: Preserves draft in database without losing inputs.
- **Submission & Immutability**: Transitions to `submitted`, locks form to read-only, enforces database state transition locks.
- **Duplicate Application Prevention**: Enforces database partial unique index and client guard preventing multiple active applications per student and domain.
- **Applicant Dashboard**: Real-time 4-stage stepper and application status visibility.

#### 3C — Admin Application Review (PAUSED PER OWNER DIRECTION)
*Notice: Paused by owner on 2026-10-16. Do not implement reviewer/admin evaluation dashboard until student-facing flow is reviewed and approved.*

#### 3D — Payment Flow (POSTPONED)
*Notice: Postponed pending owner decisions O-02 (fee schedule) and O-03 (payment gateway).*

### Acceptance Tests (Updated for 19-Domain Journey)
| # | Test | Evidence |
|---|------|----------|
| 3.1 | Public Internship tab renders all 19 approved domains with Apply Now CTAs | UI audit |
| 3.2 | Clicking Apply Now while logged out preserves domain across auth redirect | E2E flow |
| 3.3 | Authenticated student lands on application form with domain preselected | UI test |
| 3.4 | Branch/specialization is required for engineering courses, optional for others | Validation test |
| 3.5 | Student can save application draft and resume later | Storage / DB test |
| 3.6 | Submitted application is locked to read-only mode and immutable to client updates | RLS & UI test |
| 3.7 | Duplicate active application for same student and domain is prevented | Database constraint & UI test |
| 3.8 | Applicant dashboard displays accurate application status | Dashboard test |
| 3.9 | No administrative links or panels are exposed to public visitors | Navigation audit |
| 3.10 | Zero payment processing or fee claims are rendered | Content audit |

---

## Phase 4 — Internship, Projects, and Evaluation (PAUSED)

**Status**: **PAUSED BY OWNER**. Do not begin Phase 4 until owner approves the updated Phase 3 student flow.

**Goal**: Complete the participant journey from onboarding through project submission and evaluation.

### Deliverables

#### 4A — Student Dashboard
- Dashboard overview: internship status, project assignment, deadlines, recent notifications
- Onboarding details: dates, domain, mentor, support contact
- Project brief display

#### 4B — Project Submission
- Submission form: repository URL, demo URL, report upload, notes
- File upload to private Storage with validation
- Submission versioning (preserve history)
- Revision request display and resubmission

#### 4C — Reviewer Dashboard
- Assigned participants list
- Submission detail view
- Evaluation form with rubric dimensions
- Feedback text and decision
- Revision request action with reason and deadline
- Feedback release action

#### 4D — Admin Internship Management
- Cohort and domain management (CRUD)
- Mentor assignment
- Project brief management
- Participant tracking dashboard
- Completion decision (distinct from evaluation)

### Acceptance Tests
| # | Test | Evidence |
|---|------|----------|
| 4.1 | Student sees onboarding info after enrollment | UI test |
| 4.2 | Student can submit project with files | Submission test |
| 4.3 | Submission is versioned; old versions preserved | DB query |
| 4.4 | Student cannot access another student's submission | RLS test |
| 4.5 | Reviewer sees only assigned submissions | RLS test |
| 4.6 | Reviewer can submit evaluation with rubric scores | Evaluation test |
| 4.7 | Student sees feedback only after release | RLS test (released_at check) |
| 4.8 | Reviewer can request revision with reason | Revision test |
| 4.9 | Student can resubmit after revision request | Resubmission test |
| 4.10 | Admin can mark internship as completed | Status transition test |
| 4.11 | Completion requires evaluation, not just payment | Negative test |
| 4.12 | All evaluations and status changes have audit entries | Audit query |

---

## Phase 5 — Document Issuance and Verification

**Goal**: Certificate and LOR generation, issuance, private download, public verification, and revocation.

**Blocked by**: D-01 through D-08 (certificate/LOR policies, signatories, templates).

### Deliverables

#### 5A — Certificate Workflow
- Admin approval of completion → `document.approved`
- Edge Function: generate PDF from template + verified data
- Unique unguessable `verification_id` assignment
- PDF storage in private `certificates` bucket
- Issuance metadata in `issued_documents`
- Student download via signed URL
- Notification on issuance

#### 5B — LOR Workflow
- Policy-based eligibility check (guaranteed vs. conditional)
- Admin/signatory approval
- Edge Function: generate LOR PDF from template
- Private storage and authenticated download
- No public LOR verification (private by default)

#### 5C — Public Verification
- Edge Function: `verify-certificate`
- Rate limiting (10 req/min per IP)
- Minimal response: name, program, domain, completion date, status
- Not-found response reveals nothing
- Verification page UI

#### 5D — Revocation
- Admin revocation action with mandatory reason
- Status update and audit log
- Revoked certificates show "revoked" on public verification

### Acceptance Tests
| # | Test | Evidence |
|---|------|----------|
| 5.1 | Certificate cannot be issued without completion decision | Negative test |
| 5.2 | Certificate PDF generates with correct data | Generated PDF review |
| 5.3 | Duplicate issuance request does not create duplicate document | Idempotency test |
| 5.4 | Student can download own certificate via signed URL | Download test |
| 5.5 | Student cannot download another student's certificate | RLS/Storage test |
| 5.6 | Public verification returns minimal data for valid ID | API test |
| 5.7 | Public verification returns generic "not found" for invalid ID | API test |
| 5.8 | Verification does not reveal email, phone, payment, or file paths | Response inspection |
| 5.9 | LOR follows published policy (guaranteed or conditional) | Workflow test |
| 5.10 | LOR requires authorized signatory approval | Authorization test |
| 5.11 | Revoked certificate shows "revoked" on verification | Revocation test |
| 5.12 | All issuance/revocation events have audit entries | Audit query |
| 5.13 | Rate limiting prevents verification endpoint abuse | Rate limit test |

---

## Phase 6 — Release Readiness

**Goal**: Full end-to-end testing, performance optimization, accessibility audit, and production configuration.

**Blocked by**: All P1 decisions in OPEN_DECISIONS.md.

### Deliverables

#### 6A — End-to-End Testing
- Complete user journey: visitor → applicant → student → completion → certificate
- Admin journey: configure cohort → review application → assign mentor → evaluate → issue document
- Reviewer journey: view assignments → evaluate → provide feedback
- Error state testing: network failure, invalid input, expired session, edge cases

#### 6B — Accessibility Audit
- Semantic HTML validation
- Keyboard navigation for all interactive elements
- Screen reader testing (NVDA or VoiceOver)
- Color contrast verification (WCAG AA)
- Focus management for modals and page transitions
- Reduced-motion support verified

#### 6C — Performance Optimization
- Bundle size analysis and code splitting
- Image optimization (WebP, responsive srcset)
- Font loading strategy (preload, font-display: swap)
- Lazy loading for non-critical content
- Lighthouse audit: Performance ≥90, Accessibility ≥95, SEO ≥95, Best Practices ≥90

#### 6D — Production Configuration
- Production Supabase project (separate from dev)
- Production environment variables configured
- DNS and SSL certificate setup
- Payment provider production mode activation
- Email sender domain verification
- Error monitoring setup (Sentry or equivalent)
- Backup/recovery procedure tested
- Security headers configured (CSP, HSTS, X-Frame-Options)

#### 6E — Pre-Launch Checklist
- [ ] All public content is owner-approved (no `[OWNER: ...]` markers remain)
- [ ] Privacy, terms, and refund policies are published and approved
- [ ] Payment provider is in production mode with verified business details
- [ ] All RLS tests pass in production environment
- [ ] Certificate and LOR templates are approved
- [ ] Support/complaint channel is operational
- [ ] Backup has been tested (restore to a separate environment)
- [ ] Owner has signed off on domain, branding, and content

### Acceptance Tests
| # | Test | Evidence |
|---|------|----------|
| 6.1 | Full applicant journey works end-to-end | E2E test recording |
| 6.2 | Full admin journey works end-to-end | E2E test recording |
| 6.3 | All WCAG AA accessibility checks pass | Accessibility report |
| 6.4 | Lighthouse scores meet targets | Lighthouse report |
| 6.5 | No `[OWNER: ...]` placeholders in production build | Content grep |
| 6.6 | RLS tests pass against production schema | Test output |
| 6.7 | Payment sandbox → production transition is verified | Payment test |
| 6.8 | Backup restore succeeds | Restore log |
| 6.9 | No secrets in client bundle | Bundle analysis |
| 6.10 | Security headers are present and correct | Header inspection |
| 6.11 | Error monitoring captures test error | Sentry/monitoring dashboard |
| 6.12 | Owner sign-off recorded | Written approval |

---

## Design System Direction

### Philosophy
- **Intentional and credible**: every visual choice should feel deliberate, not default
- **Professional restraint**: sophisticated palette, generous whitespace, confident typography
- **Purposeful motion**: animations serve comprehension and delight, not decoration
- **Original identity**: inspired by quality craft (not by any specific site's brand)

### Color Strategy
- Dark-mode-first design with polished light mode
- Primary palette: deep navy/slate base with a confident accent (owner to choose: electric blue, amber, emerald, or custom)
- Neutral scale: carefully tuned grays with subtle warm or cool undertone
- Semantic colors: success (green), warning (amber), error (red), info (blue) — all tuned to match palette
- No saturated primaries (no `#ff0000`, `#0000ff`); all colors curated via HSL

### Typography
- Display/headings: a geometric or humanist sans-serif (candidates: Inter, Outfit, Plus Jakarta Sans, Satoshi)
- Body: highly legible sans-serif at comfortable sizes (16px base, 1.6 line-height)
- Monospace for code/verification IDs: JetBrains Mono or Fira Code
- Type scale: modular scale (1.25 ratio) for consistent hierarchy
- All fonts from Google Fonts (free, no licensing issues)

### Spacing and Layout
- 4px base unit; spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128
- Max content width: 1280px with generous padding
- Section rhythm: consistent vertical spacing between page sections
- Grid: 12-column with responsive breakpoints

### Motion
- **Primary library: Framer Motion** — for component mount/unmount, layout transitions, hover/tap effects, page transitions
- **GSAP + ScrollTrigger** — only if scroll-driven sequences are approved (e.g., hero reveal, parallax sections); do not add unless justified
- All motion respects `prefers-reduced-motion`
- Transition durations: micro (150ms), standard (300ms), emphasis (500ms)
- Easing: custom cubic-bezier curves, not linear

### Component Design
- Cards with subtle borders, rounded corners (8–12px), and soft shadows
- Buttons: filled primary, outlined secondary, ghost tertiary; all with hover/focus/active states
- Form inputs: clean borders, clear focus rings, inline validation states
- Glassmorphism used sparingly (e.g., navbar on scroll) — not as a dominant style
- No gradients on every element; use them as hero accents only

### Iconography
- Lucide React or Phosphor Icons (consistent, MIT-licensed)
- 24px default size, stroke-based, matching brand weight

---

## Dependency Plan (for Phase 1 `npm install`)

These are the anticipated dependencies. **Do not install until Phase 1 begins.**

### Production
```
react, react-dom
react-router-dom
framer-motion
@supabase/supabase-js
zod (validation)
lucide-react (icons)
clsx (class composition)
tailwind-merge (Tailwind class merging)
```

### Development
```
vite
@vitejs/plugin-react
typescript
tailwindcss, postcss, autoprefixer
@types/react, @types/react-dom
eslint, eslint-plugin-react-hooks, @typescript-eslint/*
prettier, prettier-plugin-tailwindcss
vitest, @testing-library/react, @testing-library/jest-dom
playwright (E2E)
supabase (CLI, dev only)
```

### Not included (intentionally)
- `three.js` / `@react-three/fiber` — no 3D requirement identified
- `gsap` — defer unless scroll-driven animation is designed and approved
- `mongodb`, `mongoose`, `express` — explicitly excluded by technology direction
- `next` — Vite SPA is the chosen architecture

---

## Timeline Estimate

| Phase | Estimated Duration | Dependencies |
|-------|-------------------|--------------|
| Phase 0 | 1 day | None — in progress |
| Phase 1 | 5–7 days | Owner content (B-03 through S-02) |
| Phase 2 | 3–4 days | Supabase project (O-01) |
| Phase 3 | 5–7 days | Payment provider (P-01), program config (I-01–I-07) |
| Phase 4 | 4–5 days | Rubric (I-10), mentoring model (I-09) |
| Phase 5 | 3–4 days | Certificate/LOR policies (D-01–D-08) |
| Phase 6 | 3–4 days | All P1 decisions resolved |
| **Total** | **~24–32 working days** | Assumes owner decisions are provided promptly |

> ⚠️ Timeline assumes decisions are not blocked for extended periods. Each day of decision delay adds directly to the timeline.
