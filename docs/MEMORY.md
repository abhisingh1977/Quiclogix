# MEMORY.md — Quiclogix Project State
Purpose: persistent handoff and completion tracker for Antigravity and human review.
Rule: update this file after every phase. Mark a task DONE only after evidence or a test exists. Do not mark work complete merely because code was generated.

## Project identity
- Brand: Quiclogix Solutions (Officially confirmed by owner on 2026-10-14)
- Product: corporate website + fee-based one-month project-oriented training/internship platform
- Eligibility: anyone meeting published program requirements (exact rubric criteria pending owner decision I-06)
- Frontend: React 19 + Vite 8 + TypeScript 6 + Tailwind CSS v4
- Backend: Supabase PostgreSQL, Auth, Storage, Edge Functions (Planned for Phase 2)
- Development environment: Google Antigravity
- Visual goal: original, professional, intentionally art-directed; use Tesselonix only as inspiration for quality/motion craft, not as a template or source of copied assets/code/layout.
- Key promise: fulfill the published completion certificate and LOR terms. If LOR is conditional, criteria must be disclosed before payment. If promised to every successful completer, operationally guarantee delivery to all qualifying participants.
- Brand/domain: Production domain unverified as of 2026-10-14 (Decision B-01). Earlier supplied URL was quiclogix.com; placeholders used.

## Source-of-truth files
- `docs/PRD.md` — product requirements and acceptance criteria
- `docs/ARCHITECTURE.md` — proposed stack, data model, security, workflows
- `docs/MEMORY.md` — phase status, decisions, blockers, next action
- `docs/decisions/OPEN_DECISIONS.md` — 42 owner decisions categorized and prioritized
- `docs/decisions/SECURITY_MATRIX.md` — RLS, Storage, and Edge Function security specifications
- `docs/IMPLEMENTATION_PLAN.md` — 7-phase build plan with 70+ acceptance tests
- `docs/prompts/PROMPT_01_PLANNING.md` — first Antigravity prompt

## Status legend
- NOT STARTED: no work performed
- IN PROGRESS: implementation underway
- BLOCKED: cannot proceed without decision/access
- DONE: implementation and acceptance tests verified
- NEEDS REVIEW: generated/implemented but not independently validated

## Completion tracker

### Phase 0 — Product planning
- [x] Inspect workspace and validate constraints (Done in Prompt 01)
- [x] Create OPEN_DECISIONS.md with P0/P1/P2 owner decisions (Done in Prompt 01)
- [x] Create SECURITY_MATRIX.md with complete RLS/Storage/Edge specs (Done in Prompt 01)
- [x] Create IMPLEMENTATION_PLAN.md with 7-phase acceptance tests (Done in Prompt 01)
- [ ] Confirm official brand/domain and domain ownership (Decision B-01 unverified)
- [x] Approve company name: Quiclogix Solutions (Confirmed 2026-10-14)
- [x] Approve frontend development proceeding with transparent placeholders (Confirmed 2026-10-14)
- [ ] Confirm company legal details and registered address (Pending Owner decision B-02)
- [ ] Confirm real services/projects/assets (Pending Owner decision S-01, S-02)
- [ ] Decide program fee, currency/tax handling, refund policy (Pending Owner decisions I-02, P-02)
- [ ] Choose payment provider (Pending Owner decision P-01)
- [ ] Confirm cohort dates, capacity, eligibility, and selection rules (Pending Owner decisions I-04, I-06, I-07)
- [ ] Confirm mentoring model and evaluation rubric (Pending Owner decision I-09)
- [ ] Confirm certificate policy (Pending Owner decision D-01)
- [ ] Confirm LOR policy and authorized signatory (Pending Owner decisions D-02, D-03, D-04)
- [ ] Confirm email provider and sender domain (Pending Owner decision E-01)
- [ ] Review applicable legal/privacy requirements

### Phase 1 — Design system and public website
- [x] Initialize Git repository
- [x] Scaffold React 19 + Vite 8 + TypeScript 6
- [x] Configure Tailwind CSS v4 (`@tailwindcss/vite` integration)
- [x] Define design system tokens (HSL color palette, typography scale, 4px grid spacing, radii, elevation shadows, motion timings)
- [x] Build reusable UI primitives (Button, Card, Badge, Input, Textarea, Section, OwnerNotice, Accordion)
- [x] Build accessible responsive layout (Navbar with mobile drawer & theme toggle, Footer with owner placeholders)
- [x] Create dev Component Gallery (`src/_dev/ComponentGallery.tsx`, accessible via `#gallery`)
- [x] Implement Home Page with hero, pillars, services preview, internship teaser, and CTA
- [x] Implement About Page with mission, philosophy, engineering approach, and company profile
- [x] Implement Services Page with detailed Problem/Deliverables/Audience cards and engagement models
- [x] Implement Projects / Case Studies Page with context, contribution, stack, outcomes, and honesty labels
- [x] Implement Internship Program Page with mandatory upfront fee/refund/LOR disclosures, domain tabs, 4-week sprint timeline, and FAQs
- [x] Implement Contact Page with validated inquiry form, category select, honeypot spam trap, and status states
- [x] Implement Public Certificate Verification Page with lookup, sample test ID (`QLX-2026-FSD-001`), and minimal privacy disclosure format
- [x] Implement Legal Pages (Privacy Policy, Terms of Service, Payment & Refund Policy) with tabbed switching
- [x] Implement zero-dependency client-side routing (`useNavigation`) with hash sync and scroll-to-top
- [x] Enforce zero fake claims, testimonials, metrics, or client logos (all marked with `OwnerNotice`)
- [x] TypeScript compilation passes (`tsc -b` with zero errors)
- [x] Lint passes (`oxlint` with zero errors and zero warnings across 45 files in 27ms)
- [x] Production build passes (`vite build` in 449ms with zero errors and zero warnings)
- [ ] Final owner review of public website at desktop/mobile sizes

### Phase 2 — Supabase foundation
- [ ] Supabase project confirmed (Decision O-01 pending remote project creation; 100% verified locally)
- [x] Environment variables documented; secrets not committed (`.env.example` created)
- [x] Migrations created and reproducible (`20261016000000_initial_schema_and_security.sql`)
- [x] Schema constraints and indexes reviewed (18 tables, foreign keys, cascading rules)
- [x] RLS enabled on all exposed tables (18/18 tables with granular role policies)
- [x] Storage policies tested (resumes, project-reports, certificates, lors with relational checks)
- [x] Roles cannot be self-assigned (defense-in-depth grants + trigger/RLS blocks)
- [x] RLS tests pass for anonymous/student/reviewer/admin (100 security assertions passing)
- [x] Development seed data clearly separated from production

### Phase 3 — Applications and payments (Applicant Portal Done; Payments Pending Decision O-02/O-03)
- [x] Auth and recovery flows implemented (`AuthPage.tsx`, `AuthContext.tsx`, local developer sandbox mode)
- [x] Application form and validation tested (`ApplyPage.tsx` with draft saving, track select, resume upload)
- [x] Applicant ownership policies pass (Draft saving, read-only locking on submission, state immutability in SQL)
- [x] Applicant portal dashboard implemented (`PortalPage.tsx` with 4-stage stepper and details)
- [ ] Admin application decisions tested (Phase 4 / Admin Review)
- [ ] Payment provider sandbox configured (Pending Owner Decisions O-02, O-03)
- [ ] Webhook signature validation tested (Pending payment provider)
- [ ] Duplicate webhook handling tested (Pending payment provider)
- [ ] Failed/cancelled/refunded paths tested (Pending payment provider)
- [x] Live payment remains disabled until approved (Zero payment code executed in Phase 3)

### Phase 4 — Internship and projects
- [ ] Cohorts and domains manageable by admin
- [ ] Onboarding information visible to correct users
- [ ] Project briefs and milestones implemented
- [ ] Submission and revision workflow tested
- [ ] Reviewer assignment access controls tested
- [ ] Evaluation and feedback release tested
- [ ] Completion decision is separate from payment status

### Phase 5 — Documents
- [ ] Certificate template approved
- [ ] LOR template and policy approved
- [ ] Authorized signatory confirmed
- [ ] Certificate generation is idempotent
- [ ] LOR approval is enforced
- [ ] Private download access tested
- [ ] Public verification exposes minimal information (Frontend mock passes Acceptance Test 1.10)
- [ ] Revocation and audit trail tested
- [ ] Document delivery and failure recovery tested

### Phase 6 — Release readiness
- [ ] End-to-end user journey tested
- [ ] Accessibility review completed
- [ ] Performance review completed
- [ ] SEO metadata and sitemap checked
- [ ] Error monitoring and logs configured
- [ ] Backup/recovery procedure tested
- [ ] Privacy, terms, refund and program policies approved
- [ ] Production environment and DNS approved
- [ ] Final owner sign-off

---

## Current status
- Status: PUBLIC INTERNSHIP APPLICATION SYSTEM & AUTOMATED EMAIL PIPELINE COMPLETED & VERIFIED
- Architecture: 100% auth-free public web experience. All website login, register, portal, and admin UI removed.
- Public features:
  - 19 canonical internship domains rendered as cards in `#internship`
  - All 19 domain task guide PDFs linked to live Supabase Storage URLs and activated (`isAvailable: true`)
  - Domain-specific PDF guide banner (`InternshipGuideSection`) with same-origin blob download and native new-tab preview
  - Resume upload element strictly contained with relative overflow to prevent click-interception
  - Dedicated domain application form with client/server validation, resume upload, and unique reference ID generation (`QLX-2026-APP-XXXXX`)
  - Server-side stored procedure `submit_public_application` with 24h duplicate prevention and RLS blocking public SELECT
  - Private backend candidate review via Supabase Dashboard Table Editor
  - Native PostgreSQL selection trigger `trg_on_applicant_selected` with automatic status normalization, `selected_at` timestamp, and direct Resend API delivery via `pg_net` (verified with live HTTP 200 delivery)
- Verification:
  - `npm test`: 256 passed (0 failures)
  - `npm run build`: built in 1.39s (0 errors)
- Next action: Owner testing of end-to-end applications and domain verification in Resend when ready for public external students.

---

## Prompt 03 / Phase 1B Session Log — 2026-10-14

### A. Owner Decisions Logged
1. Official company name confirmed: **Quiclogix Solutions** (Decision B-02 partial).
2. Production domain status: **Unverified** (Decision B-01 remains open).
3. Implementation mandate: Proceed with frontend development using clearly marked, transparent placeholders (`OwnerNotice`) for unresolved decisions.
4. Unresolved items: Fees, dates, eligibility, selection criteria, certificate/LOR policies, legal registration details, refund terms, and payment provider remain open.

### B. Completed Work (Phase 1B — Public Website)
1. **Routing Architecture**: Created `useNavigation` hook synchronizing `#` hash routes (`#home`, `#about`, `#services`, `#projects`, `#internship`, `#contact`, `#verify`, `#privacy`, `#terms`, `#refund`, `#gallery`) with window scroll reset and accessible active link styling.
2. **New UI Primitives**:
   - `Textarea`: Accessible multiline input with auto-generated ID, label, error state, and hint text.
   - `OwnerNotice`: Transparent UI callout component with `inline` and `block` variants, highlighting pending owner decisions (e.g. `B-02`, `I-02`, `D-02`).
   - `Accordion`: Accessible accordion with ARIA expanded controls and chevron animations for FAQs.
3. **Public Pages Built**:
   - **Home (`HomePage.tsx`)**: Hero section with radial gradients, value pillars, services teaser, internship preview with transparency notices, and contact CTA.
   - **About (`AboutPage.tsx`)**: Company mission, engineering principles, approach workflow, and clear placeholders for legal registration (B-02), founding story (B-07), and leadership (B-08).
   - **Services (`ServicesPage.tsx`)**: Structured cards detailing Problem Addressed, Deliverables, Intended Audience, and Technology Stack for 4 consulting offerings, plus client engagement models.
   - **Projects (`ProjectsPage.tsx`)**: Technical case studies with explicit honesty labels (`[Reference Prototype]`, `[Concept Architecture]`, `[Internal Benchmark]`), context, contribution, stack, and outcomes.
   - **Internship Program (`InternshipPage.tsx`)**: Compliant with PRD §6 and Acceptance Test 1.4: publishes fee/inclusions, LOR policy, refund/withdrawal rules, and cohort prerequisites upfront before CTAs. Includes interactive domain tabs, 4-week sprint timeline, and FAQ accordion.
   - **Contact (`ContactPage.tsx`)**: Validated inquiry form with client-side error states, inquiry category selector, honeypot spam protection trap, submission feedback, and corporate info placeholders.
   - **Public Certificate Verification (`VerifyPage.tsx`)**: Public lookup tool accepting credential IDs, providing a sample ID (`QLX-2026-FSD-001`), verified authenticity badge, minimal privacy disclosure layout, and a realistic "not found" state.
   - **Legal Pages (`LegalPage.tsx`)**: Tabbed document view for Privacy Policy (DPDP Act alignment), Terms of Service, and Payment & Refund Policy with owner review flags.
   - **Dev Component Gallery (`ComponentGallery.tsx`)**: Maintained and accessible via `#gallery` for reviewing raw tokens and primitives.

### C. Commands & Checks Run
| Command | Result | Notes |
|---------|--------|-------|
| `npm run lint` (`oxlint`) | **PASSED** (0 errors, 0 warnings) | Scanned 45 files with 116 rules in 27ms |
| `npm run build` (`tsc -b && vite build`) | **PASSED** (exit code 0) | Full TypeScript check + production bundle built in 449ms (dist: 310kB JS, 67kB CSS) |
| `git status` | **PASSED** | Working directory clean of untracked build artifacts |

### D. Files Created & Changed
- Created: `src/components/ui/Textarea/*` (Component, CSS, index)
- Created: `src/components/ui/OwnerNotice/*` (Component, CSS, index)
- Created: `src/components/ui/Accordion/*` (Component, CSS, index)
- Created: `src/hooks/useNavigation.ts`
- Created: `src/pages/Home/*` (Component, CSS, index)
- Created: `src/pages/About/*` (Component, CSS, index)
- Created: `src/pages/Services/*` (Component, CSS, index)
- Created: `src/pages/Projects/*` (Component, CSS, index)
- Created: `src/pages/Internship/*` (Component, CSS, index)
- Created: `src/pages/Contact/*` (Component, CSS, index)
- Created: `src/pages/Verify/*` (Component, CSS, index)
- Created: `src/pages/Legal/*` (Component, CSS, index)
- Created: `src/pages/index.ts` (Master barrel export)
- Updated: `src/components/ui/Section/Section.tsx` & `.css` (added `spacing="normal"` alias and `variant="secondary"`)
- Updated: `src/components/layout/Navbar/Navbar.tsx` & `.css` (added active route highlighting)
- Updated: `src/components/layout/Footer/Footer.tsx` (updated brand navigation target)
- Updated: `src/components/index.ts` & `src/hooks/index.ts` (updated exports)
- Updated: `src/App.tsx` (integrated router rendering all pages)
- Updated: `docs/decisions/OPEN_DECISIONS.md` (recorded owner decisions)
- Updated: `docs/MEMORY.md` (current tracking state)

### E. Next Recommended Phase
- **Owner Review of Public Website**: Review all 8 public pages in browser (`npm run dev`) across mobile and desktop.
- **Phase 2 — Supabase Foundation**: Upon owner approval and resolution of Supabase project decision (O-01), proceed with database schema migrations, RLS policies, and Storage bucket configuration.

---

## Complete Visual Redesign Session Log — 2026-10-14 ("Precision in Motion")

### A. Creative Direction & Brand System
1. **Design Concept**: Redesigned from the ground up under the concept **"Precision in Motion"** — uniting editorial visual clarity with the rigor and structure of engineering documentation.
2. **Eliminated Generic AI & SaaS Clichés**:
   - Removed all floating neon ambient orbs, generic radial blur halos, and colorful gradient text (`.gradient-text`).
   - Replaced repetitive three-card grids with asymmetric editorial compositions, two-column layouts, and structured data ribbons.
   - Replaced pill-shaped elements and uniform heavy rounded corners with clean, disciplined geometry (`2px` to `4px` corner radii).
   - Eliminated default glassmorphism, faux customer logos, and exaggerated marketing claims.
3. **Typography**:
   - Headings: `Manrope` (800 / 700 / 600 weight) with local/system fallbacks.
   - Body & Interface: `IBM Plex Sans` (400 / 500 / 600 weight).
   - Technical Metadata, Identifiers & Hashes: `IBM Plex Mono` (400 / 500 / 700 weight).
4. **Color Tokens & Section Rhythm**:
   - Palettes: Ink (`#171B24`), Deep Ink (`#10141C`), Warm Paper (`#F4F1EA`), Pure White (`#FFFFFF`), Muted Slate (`#666D78`), Deep Cobalt (`#233E9B`), Pale Border (`#DAD7CF`), Dark Border (`#303641`), Muted Brass (`#A58B62`).
   - Rhythm: Hero on Warm Paper (`#F4F1EA`), Foundation on Pure White (`#FFFFFF`), Capabilities & Governance on Deep Ink (`#10141C`), Projects & Cadence on Warm Paper, Disclosures & Inquiry on Pure White, Closing CTAs & Footer on Deep Ink.
5. **Original Brand Identity Mark**:
   - Engineered original geometric `BrandMark` component (`BrandMark.tsx`): an interconnected rectilinear monogram motif representing structured execution and movement through a system. Favicon and scalable vector mark.

### B. Pages & Layouts Refactored
1. **Shared Layout Primitives**:
   - `Navbar`: Redesigned with `BrandMark`, uppercase wordmark, active link indicator line, quick verification shortcut, and clean mobile drawer.
   - `Footer`: Deep Ink (`#10141C`), dark borders (`#303641`), structured link columns, dynamic year, and verified legal note.
   - `Button`: Clean geometric corners (`2px`), Cobalt primary, Warm Paper secondary, Ghost, Terracotta danger.
   - `Card`: Paper, White, Dark, and Outlined geometric surfaces with thin 1px borders.
   - `Badge`: Technical metadata tags in `IBM Plex Mono` with `outline` variant support.
   - `Section`: Added `theme="paper" | "white" | "dark"` and `tag` prop for editorial category headers.
2. **Public Pages**:
   - **Home (`HomePage.tsx` & `.css`)**: Warm Paper hero with system metadata strip, architectural system specs ribbon (01/02/03), BrandMark card, Pure White foundation section with pull quote, Deep Ink capabilities roster, project benchmarks, transparent internship layout, and Deep Ink closing CTA.
   - **About (`AboutPage.tsx` & `.css`)**: Warm paper header, three core engineering tenets, Deep Ink corporate status table with explicit `OwnerNotice` blocks (`B-02`, `B-07`, `B-08`), and 4-phase sequential engineering delivery lifecycle.
   - **Services (`ServicesPage.tsx` & `.css`)**: Technical catalog layout with spec codes (`SRV-01` to `SRV-04`), structured problem statements, bulleted deliverables, target audience, stack tags, and Deep Ink commercial governance section.
   - **Projects (`ProjectsPage.tsx` & `.css`)**: Architectural dossiers with explicit honesty classifications (`[BENCHMARK]`, `[CONCEPT-SPEC]`, `[REF-PROTOTYPE]`), problem context, system architecture, verified metrics, and Deep Ink integrity standards.
   - **Internship (`InternshipPage.tsx` & `.css`)**: Transparent disclosures upfront (fee/inclusions, credential criteria, schedule/prerequisites, refund/cancellation rights), Deep Ink specialization track selector, 4-week sprint cadence, and FAQ accordion.
   - **Contact (`ContactPage.tsx` & `.css`)**: Validated dispatch form with category selection, honeypot spam protection, corporate communications parameter card with `OwnerNotice` blocks, and Deep Ink 24-48h SLA commitment.
   - **Verify (`VerifyPage.tsx` & `.css`)**: Public lookup terminal with sample ID button (`QLX-2026-FSD-001`), verified authentic badge, structured verification table with SHA-256 record digest, and Deep Ink cryptographic architecture explanation.
   - **Legal (`LegalPage.tsx` & `.css`)**: Statutory tabs (`[01] Privacy Policy`, `[02] Terms of Service`, `[03] Payment & Refund Policy`) with editorial article typography and Deep Ink compliance escalation channel.

### C. Commands & Verification Results
| Command | Result | Notes |
|---------|--------|-------|
| `npm run lint` (`oxlint`) | **PASSED** (0 errors, 0 warnings) | Scanned 47 files with 116 rules in 21ms |
| `npm run build` (`tsc -b && vite build`) | **PASSED** (exit code 0) | Full TypeScript check + production bundle built in 1.24s (dist: 329kB JS, 87kB CSS) |
| Browser Subagent Verification | **PASSED** | Verified Home page, dark/light theme switching, navigation, and live credential verification lookup |

### D. Files Created & Modified
- Created: `src/components/ui/BrandMark/*` (BrandMark.tsx, index.ts)
- Modified: `index.html` (Added Manrope, IBM Plex Sans, IBM Plex Mono Google Fonts)
- Modified: `src/index.css` (Complete rewrite of design tokens, typography, and section themes)
- Modified: `src/components/ui/Badge/*` (Added `outline` variant)
- Modified: `src/components/ui/Card/*` (Added `outline` / `outlined` aliases)
- Modified: `src/components/ui/Button/Button.css` (Geometric styling, Cobalt primary)
- Modified: `src/components/ui/Section/*` (Added theme and tag props)
- Modified: `src/components/ui/OwnerNotice/OwnerNotice.css` (Muted brass styling)
- Modified: `src/components/ui/Accordion/Accordion.css` (Editorial border styling)
- Modified: `src/components/layout/Navbar/*` (BrandMark integration, line indicators)
- Modified: `src/components/layout/Footer/*` (Deep ink styling, BrandMark integration)
- Modified: `src/pages/Home/*` (HomePage.tsx, HomePage.css)
- Modified: `src/pages/About/*` (AboutPage.tsx, AboutPage.css)
- Modified: `src/pages/Services/*` (ServicesPage.tsx, ServicesPage.css)
- Modified: `src/pages/Projects/*` (ProjectsPage.tsx, ProjectsPage.css)
- Modified: `src/pages/Internship/*` (InternshipPage.tsx, InternshipPage.css)
- Modified: `src/pages/Contact/*` (ContactPage.tsx, ContactPage.css)
- Modified: `src/pages/Verify/*` (VerifyPage.tsx, VerifyPage.css)
- Modified: `src/pages/Legal/*` (LegalPage.tsx, LegalPage.css)
- Modified: `docs/MEMORY.md` (Updated project memory)

### E. Next Recommended Step
- **Halt and Await Owner Review**: Stop at the visual redesign phase. Present the redesigned website for owner evaluation across mobile, tablet, and desktop viewports before touching backend or production Supabase integrations.

---

## Brand Refinement and Interaction Update Session Log — 2026-10-14

### A. Official Logo Integration
1. **Asset Located & Integrated**: Located supplied official logo `quiclogix-logo.png` (761x195 aspect ratio) featuring the black geometric Q-inspired mark, bold wordmark, and signature golden-yellow dot.
2. **Component Architecture**: Built dedicated `Logo` component (`src/components/ui/Logo/Logo.tsx` & `Logo.css`) with sizes `sm`, `md`, `lg` and surfaces `light`, `dark`, `auto`.
3. **Pristine Preservation**: Proportions are 100% maintained (`aspect-ratio: 761 / 195`), zero distortion, zero stretching, zero recoloring.
4. **Surface Treatment**: Because the original PNG has an opaque light background (`#F9F8F7`), on dark surfaces (Charcoal footer `#151719` and dark mode) it is enclosed in an intentional, tailored light badge container with stone border so it never shows harsh cutouts.
5. **Navbar & Footer**: Integrated into both the sticky `Navbar` and the `Footer`, and displayed prominently in the Home hero card.

### B. Refined Premium Color System
1. **Exact Colors Applied**:
   - Warm Ivory: `#F5F3EE` (primary light background across all editorial sections).
   - Ink Black: `#171717` (primary high-contrast text and dark elements).
   - Charcoal: `#151719` (selected dark sections and footer).
   - Signature Gold: `#D8B437` (primary CTA buttons, active accents, matching logo dot).
   - Stone: `#E4DED2` (subtle structural borders).
   - Muted Text: `#625F58` (secondary readable text).
   - Dark-Surface Text: `#F5F3EE` (high-contrast text on Charcoal surfaces).
2. **WCAG AA Compliance**: All text/background combinations meet or exceed WCAG AA/AAA (Ink Black on Warm Ivory: 16.5:1; Ink Black on Signature Gold: 8.6:1; Dark-Surface Text on Charcoal: 16.5:1).

### C. Smooth Scrolling & Navigation
1. **Native Smooth Scrolling**: Configured `scroll-behavior: smooth` on `html`.
2. **Navbar Offset Protection**: Configured `scroll-padding-top: calc(var(--nav-height) + var(--space-4))` and section `scroll-margin-top` so in-page anchor navigation never clips headings behind the fixed navbar.
3. **Reduced Motion**: Disables smooth scroll automatically when `prefers-reduced-motion: reduce` is detected.

### D. Subtle Text-Aware Cursor Behavior
1. **Component**: Engineered `CursorAccent` (`src/components/ui/CursorAccent/CursorAccent.tsx` & `.css`).
2. **Behavior**: A subtle gold atmospheric ring tracks pointer movement. When hovering over paragraph or heading text, it transitions smoothly to `opacity: 0.12` and diffuses unobtrusively.
3. **Accessibility**:
   - Native cursor is 100% untouched (`I-beam` over text/inputs, `pointer` over links/buttons).
   - Text selection and copying remain completely unrestricted (no `user-select: none`).
   - Hard-disabled on touch devices (`@media (hover: none) or (pointer: coarse)`) and under reduced-motion preferences.

### E. Verification & Build Results
| Command | Result | Notes |
|---------|--------|-------|
| `npm run lint` (`oxlint`) | **PASSED** (0 errors, 0 warnings) | Scanned 51 files with 116 rules in 23ms |
| `npm run build` (`tsc -b && vite build`) | **PASSED** (exit code 0) | Full TypeScript check + production bundle built in 348ms (dist: 330kB JS, 89kB CSS) |
| Browser Subagent Verification | **PASSED** | Verified logo display, smooth scrolling, cursor dimming over text, and theme toggle in live browser |

### F. Next Recommended Step
- **Complete**: Brand refinement, official logo integration, refined color system, smooth scrolling, and subtle cursor updates were validated.

---

## UX Correction and Visual Refinement Session Log — 2026-10-14

### A. Removed PDF / Technical Report Clutter
1. **Removed Non-Customer-Facing Artifacts Across All Pages**:
   - Stripped `SYSTEM IDENTIFIER: QLX-SYS-2026`, version metadata brackets `[QLX // 0.1.0]`, GPS coordinates, and raw engineering jargon from `HomePage.tsx`.
   - Removed internal decision badges (e.g. `Decision B-06`) from hero and headers.
   - Removed redundant decorative logo showcase cards from the homepage.
   - Replaced rigid, numbered architectural system ribbons (`01/02/03`, Roman numerals) with clean, editorial value pillars and practice highlights.
   - Cleaned document-style codes across all pages: `[SYS-DOC]`, `[SYS-SPEC]`, `SRV-01..04`, `[SYS-DOSSIER]`, `BENCH-01`, `TRK-01`, `[SYS-COMM]`, `[DISPATCH-FORM]`, `[SYS-VERIFY]`, `[SYS-COMPLIANCE]`, `[01]` tab brackets, and `VERSION: 2026.1`.
2. **Standardized Customer-Facing Disclosures (`OwnerNotice`)**:
   - Refactored `OwnerNotice.tsx` and `.css` so internal Jira decision codes (`Decision B-02`, etc.) are hidden from public visitors.
   - Public view displays refined "Policy Disclosure" / "Notice" badges with accessible explanation text.
   - Retained `data-decision-id` attribute on the DOM elements for compliance traceability and test assertions.

### B. Natural & Premium Corporate Visual Experience
1. **Refined Homepage Layout & Whitespace**:
   - Replaced rigid three-column boxes with varied, purposeful editorial layouts.
   - Introduced a balanced "Core Focus" practice highlights card in the hero with warm ivory styling and clean typography.
   - Softened borders and dividers using semantic stone tokens (`--color-border`).
   - Humanized company messaging to be direct, approachable, and professional without unverified claims.
2. **Preserved Brand Elements**:
   - Official Quiclogix logo (`src/assets/quiclogix-logo.png`) preserved with exact proportions, black wordmark, and signature gold dot intact.
   - Warm Ivory, Charcoal, and Signature Gold color system maintained with WCAG AA/AAA contrast ratios.

### C. Fixed Translucent Cursor-Over-Text Behavior
1. **Root Cause Analysis**:
   - `CursorAccent.tsx` previously invoked React state updates (`setIsOverText`, `setIsInteractive`) on every single `mousemove` event, creating an asynchronous rendering bottleneck and frame dropping.
   - CSS transitioned layout properties (`top`, `left`) rather than hardware-accelerated transforms, and text element target detection failed on common inline/paragraph containers.
2. **Re-engineered Implementation (`CursorAccent.tsx` & `CursorAccent.css`)**:
   - Rewritten with zero React state updates on mouse move; uses direct DOM attribute manipulation (`data-mode="text" | "interactive" | "default"` and `data-visible="true" | "false"`).
   - High-performance `requestAnimationFrame` lerp loop (`pos += (target - pos) * 0.35`) for silky-smooth pointer tracking.
   - When hovering over text elements (`p`, `h1`-`h6`, `li`, `blockquote`, `span` without interactive parents), the cursor follower switches to `opacity: 0.10 !important`, scales down (`scale(0.7)`), and clears its background to avoid obscuring text.
3. **Accessibility & Native Controls**:
   - Native cursor is 100% untouched: native `I-beam` over selectable text and inputs; native `pointer` over buttons, links, and interactive elements.
   - Text selection and copying remain completely unrestricted (no `user-select: none`).
   - Hard-disabled on touch devices (`@media (hover: none) or (pointer: coarse)`) and under `prefers-reduced-motion: reduce`.

### D. Consolidated Certificate Verification
1. **Navigation Consolidation**:
   - Retained exactly one dedicated, primary "Verify Certificate" link in the top `Navbar` navigation menu.
   - Retained one relevant "Verify Certificate" link in the `Footer` under the Program column.
   - Removed redundant "Verify Credentials →" button from the Home hero section.
   - Removed redundant "Verify Credential" CTA from the Projects page benchmark card.
   - Removed redundant verification card from the Contact page.
2. **Functional Preservation**:
   - Fully preserved the `#verify` route and verification engine (`VerifyPage.tsx`), complete with sample credential ID (`QLX-2026-FSD-001`), verification checks, and zero student privacy exposure.

### E. Fixed Theme Switching Across the Entire Application
1. **Root Cause Analysis**:
   - The theme toggle updated the `[data-theme='dark']` attribute on `<html>`, but section classes (`.section-paper`, `.section-white`) and core color variables (`--color-paper`, `--color-pure-white`, `--color-border`) were hardcoded to light hex values without dark mode counterparts.
   - As a result, toggling dark mode updated the navbar while leaving all body sections and cards stranded on white backgrounds.
2. **Unified Semantic Design-Token Architecture (`src/index.css`)**:
   - Implemented full semantic design tokens across both light and dark themes:
     - `--color-bg-primary`, `--color-bg-surface`, `--color-bg-subtle`, `--color-bg-contrast`
     - `--color-text-primary`, `--color-text-secondary`, `--color-text-muted`
     - `--color-border`, `--color-border-subtle`, `--color-border-focus`
   - Re-mapped all legacy/alias variables (`--color-paper`, `--color-pure-white`, `--color-white`, `--color-border`) under `[data-theme='dark']` to deep charcoal (`#151719`), dark surface ink (`#1D2024`), and dark borders (`#2E333B`).
   - Updated component CSS files (`Card.css`, `Input.css`, `Textarea.css`, `Button.css`, `Accordion.css`) to use semantic tokens.
3. **Verification**:
   - All 8 public pages, modals, cards, forms, inputs, and footers now seamlessly transition between Warm Ivory (light) and Deep Charcoal (dark) with zero stranded white cards and zero contrast issues.

### F. Verification & Build Results
| Command / Check | Result | Notes |
|-----------------|--------|-------|
| `npm run lint` (`oxlint`) | **PASSED** (0 errors, 0 warnings) | Scanned 51 files with 116 rules in 22ms |
| `npm run build` (`tsc -b && vite build`) | **PASSED** (exit code 0) | Full TypeScript check + production bundle built in 384ms (dist: 330kB JS, 89kB CSS) |
| Browser Subagent Visual & Functional Verification | **PASSED** | Verified Hero in light mode, dark mode toggle across all sections without stranded cards, consolidated navbar verify link, and live credential lookup |

### G. Next Recommended Step
- **Complete**: The initial visual correction pass was approved for creative redesign.

---

## New Creative Direction Session Log — 2026-10-15 (Editorial Technology Practice)

### A. Creative Direction & Visual Philosophy
1. **Strategic Shift**: Completely broke from the AI-generated / SaaS landing-page / technical report patterns. Re-conceived Quiclogix Solutions as an **independent, design-conscious technology consultancy & applied mentorship practice**.
2. **Editorial Typography**:
   - **Display / Headings / Pull-quotes**: `Newsreader` (refined, literate editorial serif loaded via Google Fonts with italic styles, opsz optical sizing, and weights 400..700).
   - **Body & Interface**: `Plus Jakarta Sans` (restrained, modern, unpretentious grotesque sans-serif).
   - **Code & Identifiers**: `IBM Plex Mono` (proportional, legible monospaced font).
3. **Warm Stone & Deep Forest Palette**:
   - **Light Mode**: Warm Stone (`#F8F6F1`), Crisp Sheet (`#FFFFFF`), Black Ink typography (`#111613`), Deep Forest Green (`#0D1913`), delicate hairlines (`#E5DFD1`), and the official logo golden dot (`#D8B437`) as a restrained brand punctuation.
   - **Dark Mode**: Deep Forest Green (`#0D1913` background, `#14251D` surfaces, `#1F362A` borders), warm off-white text (`#F4F1EA`), sage secondary text (`#A5B3AB`), and golden accent dots.
4. **Completely Eliminated**:
   - Generic SaaS centered heroes and 3-column card grids.
   - System identifiers, bracketed codes, and GPS coordinates.
   - Repetitive slogan filler ("Precision in motion", "Empowering the future", etc.).
   - Large decorative logo cards and artificial box borders around every element.

### B. Purposeful Homepage Architecture & Visual Expression
1. **Masthead / Folio Top Bar**:
   - Date, location (`Bengaluru, India`), and practice category (`Independent Practice • Software Systems & Mentorship`) framed by subtle hairline rules.
2. **Asymmetric Editorial Hero**:
   - Expansive editorial serif title with italic accent: *"Software systems engineered with architectural restraint, and an applied internship practice."*
   - Direct, human positioning lead describing cloud architecture consulting, web engineering, and project mentorship.
   - Purposeful dual action buttons: "Explore Practice Areas" and "Internship Program".
   - Clear disclosure footnote confirming verified work only.
3. **Original Systems Architecture Canvas (`ArchitectureCanvas.tsx`)**:
   - Interactive, authentic systems diagram communicating Quiclogix's engineering model:
     - Layer 1: **Security & Schema Layer** (PostgreSQL Row-Level Security, declarative data isolation).
     - Layer 2: **Verification Engine** (Deterministic SHA-256 cryptographic digest calculation, anti-tampering).
     - Layer 3: **Client Type Contracts** (Strict compile-time TypeScript interfaces, accessible CSS tokens).
   - Interactive tabs allowing visitors to inspect real SQL policies and TypeScript interface contracts.
4. **Consulting Practices (Horizontal Editorial Ledger)**:
   - Replaced boxed cards with an expansive horizontal ledger:
     - Practice 01: Full-Stack Systems & Custom Web Platforms
     - Practice 02: Cloud Architecture & Database Security
     - Practice 03: Codebase Audits & Structural Modernization
5. **Engineering Principles (Editorial Spread)**:
   - Prominent italic pull quote: *"Software reliability is never an accidental byproduct of velocity. It is the deliberate consequence of clear boundaries, strict typing, and verified outcomes."*
   - Four concrete tenets: Typed at the Boundary, Security at the Engine, Evaluation by Verification, Mentorship in Real Repositories.
6. **Case Studies & Reference Implementations**:
   - Authentic implementations: Public Certificate Verification Gateway (`#verify`) and the Editorial Tokenized Design System.
   - `OwnerNotice` client case studies confidentiality disclosure.
7. **Internship Practice Spread**:
   - Four-week sprint lifecycle (Scaffolding $\to$ Schemas $\to$ Client Applications $\to$ Rubric Evaluation).
   - Side-by-side policy disclosure card with upfront tuition disclosure, earned credentials, and zero false job placement claims.
8. **Closing Inquiry Box**:
   - Confident Deep Forest Green closing panel with direct links to `#contact` and `#services`.

### C. Build & Verification Results
| Command / Check | Result | Notes |
|-----------------|--------|-------|
| `npm run lint` (`oxlint`) | **PASSED** (0 errors, 0 warnings) | Scanned 53 files with 116 rules in 73ms |
| `npm run build` (`tsc -b && vite build`) | **PASSED** (exit code 0) | Full TypeScript check + production bundle built in 406ms (dist: 329kB JS, 94kB CSS) |
| Browser Subagent Verification | **PASSED** | Verified light mode hero, ArchitectureCanvas tab switching, practices ledger, pull quote, Deep Forest Green dark mode toggle, live credential lookup (`QLX-2026-FSD-001`), and mobile layout (375x812) with menu drawer |

### D. Next Recommended Step
- **Complete**: The preliminary editorial pass was expanded into a complete Architectural Broadside redesign.

---

## Architectural Broadside Redesign Session Log — 2026-10-15

### A. Design Rationale & Strategic Repositioning
1. **The Problem with Conventional Layouts**:
   - The conventional 50/50 split hero (headline + buttons left, card/graphic right) and identical section cadences (tag $\to$ title $\to$ 3-card grid) still resembled standard SaaS startup landing pages.
   - Quiclogix required a visual language that felt like a **prestigious independent design engineering practice & architectural studio**.
2. **What Changed & Why**:
   - **Replaced 50/50 Split Hero with an Architectural Broadside**: A full-width folio masthead (date, location, firm designation), monumental headline spanning the top grid, and an integrated **Dual Practice Dispatch Ledger** immediately delineating Practice 01 (Systems Architecture & Cloud Security) from Practice 02 (The Applied Project Studio).
   - **Integrated Architectural Systems Workbench**: Elevated `ArchitectureCanvas` into a full-width blueprint section ("From Schema to Interface"), letting visitors inspect declarative PostgreSQL RLS security boundaries, cryptographic SHA-256 verification, and strict compile-time TypeScript contracts.
   - **Replaced Generic Feature Grids with a Consulting Register**: Detailed deliverable and technology standards tables (`React 19`, `PostgreSQL RLS`, `WCAG AA`) with zero marketing fluff.
   - **Four Foundations of Restraint**: Four structural columns divided by subtle vertical hairlines with a central editorial pull quote on software durability.
   - **Public Verification Provenance Spotlight**: Integrated terminal preview directly linking to `#verify` with live query verification for `QLX-2026-FSD-001`.
   - **Studio Syllabus Modules**: Structured like an architectural studio course (Weeks 01–04) with explicit sprint deliverables, paired with a statutory disclosures card.
   - **Editorial Typography Tuning**: Adjusted `font-weight: 800` down to `font-weight: 600` across all page headers in `AboutPage.css`, `ServicesPage.css`, `ProjectsPage.css`, `InternshipPage.css`, `ContactPage.css`, `VerifyPage.css`, and `LegalPage.css` to honor the refined proportions of the `Newsreader` serif.

### B. Files Created & Modified
- Modified: `src/pages/Home/HomePage.tsx` (Complete Architectural Broadside composition)
- Modified: `src/pages/Home/HomePage.css` (Full architectural studio styling, dispatch cards, workbench section, register tables)
- Modified: `src/index.css` (Refined tokens, semantic palette, architectural layout utilities)
- Modified: `src/pages/About/AboutPage.css` (Typography weight tuned to 600)
- Modified: `src/pages/Services/ServicesPage.css` (Typography weight tuned to 600)
- Modified: `src/pages/Projects/ProjectsPage.css` (Typography weight tuned to 600)
- Modified: `src/pages/Internship/InternshipPage.css` (Typography weight tuned to 600)
- Modified: `src/pages/Contact/ContactPage.css` (Typography weight tuned to 600)
- Modified: `src/pages/Verify/VerifyPage.css` (Typography weight tuned to 600)
- Modified: `src/pages/Legal/LegalPage.css` (Typography weight tuned to 600)
- Updated: `docs/MEMORY.md` (Project tracking state)

### C. Build & Verification Results
| Command / Check | Result | Notes |
|-----------------|--------|-------|
| `npm run lint` (`oxlint`) | **PASSED** (0 errors, 0 warnings) | Scanned 53 files with 116 rules in 68ms |
| `npm run build` (`tsc -b && vite build`) | **PASSED** (exit code 0) | Full TypeScript check + production bundle built in 510ms (dist: 334kB JS, 98kB CSS) |
| Browser Subagent Verification | **PASSED** | Verified Architectural Folio, broadside headline, dual dispatch cards, workbench section, consulting register, ethos columns, and responsive overview page |

### D. Next Recommended Step
- **Halt and Await Owner Review**: The Architectural Broadside redesign is fully implemented and operational across all pages and viewports. Await owner feedback before proceeding.

---

## Critical Fix Session Log — Light/Dark Theme Text Visibility (2026-10-15)

### A. Root Cause Analysis
1. **Undefined CSS Variables in Component Styles**:
   - `Navbar.css` referenced undefined `var(--color-warm-ivory)` (lines 15, 237) and `var(--color-charcoal-light)` (lines 169, 195), resulting in transparent backgrounds that caused sticky navbar links and buttons to collide with underlying page text during scrolling.
2. **Missing Dark Mode Token Overrides**:
   - `var(--color-muted-text)` was defined in `:root` as `#4E5952` but was not overridden in `[data-theme='dark']`. When applied to navbar links, it yielded a 2.2:1 contrast against dark background `#0D1913` (invisible text).
   - `var(--color-warm-paper-dark)` was `#EDE8DC` (light beige) in `:root` and was omitted from `[data-theme='dark']`. Because `Badge.css` set `.badge--default { background: var(--color-warm-paper-dark); color: var(--color-ink); }`, in dark mode it rendered white text (`#F4F1EA`) on a light beige background, causing badge text to be completely unreadable.
3. **Gold Accent Text Contrast Failure on Light Surfaces**:
   - Signature gold `#D8B437` was applied as a text color across `.badge--accent`, `.editorial-tag`, `.home-dispatch-card__num`, `.verify-sample-btn`, `.internship-spec-cell__label`, and page header accents. While `#D8B437` passes with > 9:1 contrast on dark surfaces, on light backgrounds (`#FFFFFF` and `#F8F6F1`) its contrast is only 1.98:1, rendering accent headings, tags, and sample links nearly invisible in light mode.
4. **Accordion White-Wash Background in Dark Mode**:
   - `.accordion__item--open` had `background-color: rgba(255, 255, 255, 0.4);` which painted a white wash over dark mode backgrounds, washing out body text.
5. **Hardcoded Sub-AA Colors**:
   - `Input.css` and `Textarea.css` contained hardcoded placeholder `#9EA5B0` (2.2:1 against `#FFFFFF`), hardcoded hover border `#B5B0A4`, and legacy cobalt focus ring `#5C7DEC`.
   - `Footer.css` had small legal and metadata text hardcoded to `#7E7A73`, yielding only 4.16:1 against `#0E1012` (failing the 4.5:1 requirement for small text).

### B. Systematic Semantic Fixes
1. **Unified Design Token System (`src/index.css`)**:
   - Defined explicit standard semantic aliases (`--background`, `--foreground`, `--surface`, `--surface-foreground`, `--muted`, `--muted-foreground`, `--border`, `--primary`, `--primary-foreground`, `--input`, `--focus-ring`) in both `:root` and `[data-theme='dark']`.
   - Added `--color-accent-text`:
     - Light Mode: `#7A5B00` (deep golden bronze, contrast **5.85:1** on `#F8F6F1`, **6.32:1** on `#FFFFFF`, **5.35:1** on `#F0ECE1`).
     - Dark Mode: `#E4C558` (glowing warm gold, contrast **9.47:1** on `#14251D`, **10.66:1** on `#0D1913`).
   - Verified body text `--color-text-primary` (**16.94:1** in light, **14.19:1** in dark) and secondary text `--color-text-secondary` (**8.16:1** in light, **10.09:1** in dark).
2. **Component Level Refactoring**:
   - `src/components/layout/Navbar/Navbar.css`: Replaced undefined variables with semantic tokens (`--color-bg-primary`, `--color-border`, `--color-bg-surface`, `--color-text-primary`, `--color-text-secondary`). Sticky and mobile navigation backgrounds are solid in both themes.
   - `src/components/ui/Badge/Badge.css`: `.badge--default` uses semantic `--color-bg-subtle` and `--color-text-primary`. `.badge--accent` consumes `--color-accent-text` in light mode and `--color-accent` in dark mode. `.badge--info`, `.badge--success`, `.badge--warning`, and `.badge--error` use WCAG-compliant status tokens.
   - `src/components/ui/Input/Input.css` & `Textarea.css`: Replaced hardcoded values with semantic tokens. Placeholder text uses `--color-text-muted` (**5.95:1** in light, **6.48:1** in dark). Focus ring uses `--color-accent`.
   - `src/components/ui/Accordion/Accordion.css`: Replaced white-wash with `--color-bg-subtle`. Body text uses `--color-text-secondary`.
   - `src/components/ui/OwnerNotice/OwnerNotice.css`: Tags and block descriptions use `--color-accent-text` and `--color-text-secondary`.
   - `src/components/layout/Footer/Footer.css`: Footer metadata and legal text set to `#9BA8A0` (**7.72:1**) and `#C5D0C9` (**12.02:1**), guaranteeing full WCAG 2.2 AA compliance.
   - `src/pages/Home/HomePage.css`, `AboutPage.css`, `ServicesPage.css`, `ProjectsPage.css`, `InternshipPage.css`, `VerifyPage.css`, `ContactPage.css`, `LegalPage.css`: Updated all accent headings, labels, indices, bullets, and terminal preview elements to consume `--color-accent-text`. Added `<select option>` styling in `ContactPage.css`.
3. **Automated Validation**:
   - Created `scripts/verify-theme-contrast.js` and registered `npm run test:contrast`.

### C. Build & Verification Results
| Check | Command | Result | Details |
|-------|---------|--------|---------|
| Contrast Automation | `npm run test:contrast` | **PASSED** (29/29 checks) | All text/surface pairs strictly $\ge 4.5:1$ (normal) and $\ge 3:1$ (large/controls) |
| Linter | `npm run lint` (`oxlint`) | **PASSED** | 0 warnings, 0 errors across 53 files in 98ms |
| TypeScript & Build | `npm run build` (`tsc -b && vite build`) | **PASSED** | 0 errors, compiled production bundle cleanly |
| Visual Inspection | `browser_subagent` | **PASSED** | Visual inspection of light mode, dark mode, toggle transitions, mobile drawer (390x844), FAQ accordion, verify certificate card, and contact form |

### D. Remaining Issues
- None. Theme text visibility and contrast meet WCAG 2.2 AA requirements across all public pages in both light and dark modes.

---

## Overview Page Redesign Session Log (2026-10-16)

### A. Route & Context Inspection
- **Route**: `#` / `#home` (rendered as `Overview` in main navigation).
- **Component**: `src/pages/Home/HomePage.tsx` with styles in `src/pages/Home/HomePage.css`.
- **Purpose**: Public company overview page. Establishes commercial and technical credibility for prospective clients and internship applicants. Explains genuine services and applied project cohorts without fabricated vanity metrics or AI-generated filler.

### B. Identified Design Defects (PDF / Technical Report Aesthetics)
1. **Printed Broadside / Journal Masthead**:
   - The top hero contained a faux newspaper folio bar (`Vol. 2026`, `Quiclogix Solutions • Architectural Practice | Bengaluru, India • Systems Engineering & Project Mentorship`), making the browser window look like a printed PDF publication.
2. **Artificial Numbered Clauses & Registers**:
   - Sections were structured with Roman numerals (`I., II., III., IV.`), numbered registers (`01`, `02`, `03`), and rigid table grids of `Core Deliverables` vs. `Technology Standards` with repeated bullets, resembling an RFP appendix rather than an inviting web page.
3. **Boxed-In Typography**:
   - Every paragraph was trapped inside repetitive borders and card containers.
4. **Redundant Terminal & Verification Duplication**:
   - A fake terminal widget on the home page duplicated the live certificate lookup already available on `#verify`.
5. **Dense Documentation Style**:
   - Explanations read like academic whitepapers rather than clear, engaging technology consultancy communication.

### C. Web-First Redesign Implementation
1. **Hero Section (`.home-hero`)**:
   - Removed the paper masthead, `Vol. 2026`, and faux journal borders.
   - Implemented a clear human headline: *"Thoughtful software engineering for modern businesses."*
   - Added concise, readable introduction with dual primary actions: `Explore Services` (`#services`) and `Internship Program` (`#internship`), plus a subtle link to `#verify`.
2. **Two Core Pillars (`.home-pillars-grid`)**:
   - Replaced rigid "01 / Practice" and "02 / Studio" dispatch cards with an open, spacious 2-column editorial feature directly comparing Systems Architecture & Web Engineering with the One-Month Project Internship.
3. **Interactive Architectural Model (`.home-workbench-section`)**:
   - Retained the interactive `ArchitectureCanvas` component, framed with an approachable, natural web section header explaining the three-tier model (Security, Verification, Interface).
4. **Consulting Capabilities (`.home-capabilities-grid`)**:
   - Replaced the repetitive RFP database tables with 3 clean, distinct capability blocks (Custom Web Platforms, Database & Cloud Security, Audits & Modernization) highlighting key standards without redundant bullet repetition.
5. **Engineering Approach (`.home-principles-grid`)**:
   - Replaced the Roman numeral lecture block with 4 clean, human principles (Type-Safe Boundaries, Security at the Engine, Objective Rubric Evaluation, Mentorship in Real Repositories).
6. **One-Month Studio Sprint (`.home-sprint-overview`)**:
   - Replaced heavy module boxes with a 4-step progressive timeline (Weeks 1 to 4) and statutory disclosures with transparent fee terms.
7. **Closing Inquiry CTA (`.home-cta-section`)**:
   - Implemented a focused, high-contrast invitation for client inquiries and cohort admissions.

### D. Files Modified
- `src/pages/Home/HomePage.tsx`: Rewritten with web-first composition, human hierarchy, and semantic UI.
- `src/pages/Home/HomePage.css`: Modern, responsive CSS using existing semantic tokens, generous whitespace, and responsive breakpoints.
- `docs/MEMORY.md`: Updated tracking state.

### E. Verification & Build Results
| Check | Command | Result | Details |
|---|---|---|---|
| Linter | `npm run lint` (`oxlint`) | **PASSED** | 0 warnings, 0 errors across 54 files in 36ms |
| TypeScript & Build | `npm run build` (`tsc -b && vite build`) | **PASSED** | 0 errors, compiled production bundle cleanly in 1.05s |
| WCAG Contrast | `node scripts/verify-theme-contrast.js` | **PASSED** | 29/29 checks strictly $\ge 4.5:1$ (normal) and $\ge 3:1$ (large/controls) |
| Browser Subagent Visual Audit | `browser_subagent` | **PASSED** | Verified Light Mode, Dark Mode, theme toggling, interactive `ArchitectureCanvas` tabs (Security, Verification, Client), responsive stacking at mobile width (390x844), and desktop layout (1536x826) |

### F. Status
- Completed and verified. Awaiting human owner review.

---

## Fee & Refund Content Removal Session Log (2026-10-16)

### A. Objective & Scope
- Removed all public-facing fee amounts, pricing sections, fee badges, payment-related promotional copy, refund-policy links, refund explanations, and refund-related FAQs from the public website, with particular focus on the Internship page.
- Preserved existing routes, backend data models, authentication, and payment infrastructure. Retained statutory policy tabs in `LegalPage.tsx` flagged for owner review.

### B. Summary of Changes
1. **Internship Page (`src/pages/Internship/InternshipPage.tsx`)**:
   - Replaced lead copy reference: changed *"A structured, fee-based internship program..."* to *"A structured, project-oriented internship program..."*.
   - Replaced Policy Cards:
     - Old: *Fee & Inclusions* and *Refund & Withdrawal Rights*.
     - New: *Eligibility & Preparation* (Git prerequisites, track knowledge, weekly capacity) and *Project Deliverables & Tooling* (project briefs, repository setup, automated testing).
     - Retained and refined: *Objective Rubric Evaluation* and *Credentials Integrity* (clarified that completion credentials reflect technical achievement).
   - Replaced FAQ 4:
     - Old: *"Can I get a refund if I need to withdraw?"*
     - New: *"What is the expected weekly time commitment?"* (details the 15–20 hours/week sprint expectation).
   - Zero fee, pricing, or refund references remain on the public Internship page.
2. **Homepage (`src/pages/Home/HomePage.tsx`)**:
   - Removed *"fee-based"* from the Applied Internship Studio section subtitle.
   - Updated `OwnerNotice` in the sprint footer from *"Cohort Schedule & Fee Policy"* to *"Cohort Schedule & Enrollment Guidelines"* (focusing on upcoming dates and onboarding criteria).
3. **About Page (`src/pages/About/AboutPage.tsx`)**:
   - Updated transparency statement: changed *"scope, timelines, fees, and deliverables are fully disclosed upfront"* to *"project scope, timelines, standards, and deliverables are fully disclosed upfront"*.
4. **Footer Navigation (`src/components/layout/Footer/Footer.tsx`)**:
   - Removed the public promotional link to `#refund` (*Payment & Refund Policy*) from the Governance column, keeping *Privacy Policy*, *Terms of Service*, and *Contact Support*.
5. **Legal Page (`src/pages/Legal/LegalPage.tsx`)**:
   - Removed *"and program fees"* from the header lead paragraph.
   - Retained the `Payment & Refund Policy` tab for legal compliance, flagged for owner review with `OwnerNotice` (decision `P-01 / P-02`).
   - Retained the `#refund` route in `App.tsx` and `useNavigation.ts` so future checkout flows and direct compliance links continue to function seamlessly.

### C. Verification & Build Results
| Check | Command | Result | Details |
|---|---|---|---|
| Linter | `npm run lint` (`oxlint`) | **PASSED** | 0 warnings, 0 errors across 54 files in 106ms |
| TypeScript & Build | `npm run build` (`tsc -b && vite build`) | **PASSED** | 0 errors, compiled production bundle in 611ms |
| WCAG Contrast | `node scripts/verify-theme-contrast.js` | **PASSED** | 29/29 checks strictly $\ge 4.5:1$ (normal) and $\ge 3:1$ (large/controls) |
| Browser Subagent Verification | `browser_subagent` | **PASSED** | Verified Internship page, policy cards, replacement FAQ, footer links, and homepage teaser in Light & Dark modes with zero public fee/refund references |

### D. Remaining Required Disclosures & Next Steps
- When Phase 3 (Applications and Payments) is implemented, legally required payment terms, pricing amounts, currency/tax disclosures, and refund windows must be displayed within the authenticated checkout flow prior to payment commitment.
- Awaiting owner review for formal cohort dates, screening criteria, and authorized payment gateway integration.

---

## Supabase Foundation & Security Session Log — 2026-10-16 (Phase 2)

### A. Objective & Scope
- Implemented Phase 2: **Supabase Foundation and Security** following `docs/PRD.md`, `docs/ARCHITECTURE.md`, and `docs/decisions/SECURITY_MATRIX.md`.
- Designed and authored the complete PostgreSQL relational schema, migration scripts, and Row Level Security (RLS) policies locally without creating or modifying remote production resources (honoring Open Decision O-01).
- Prepared Supabase Auth integration, automatic profile creation, and safe role management preventing client self-escalation.
- Created private Storage bucket policies, server-side credential verification RPC, `.env.example` templates, TypeScript types, and an automated verification test suite.

### B. Summary of Implemented Backend Components

1. **PostgreSQL Relational Schema (`supabase/migrations/20261016000000_initial_schema_and_security.sql`)**:
   - 18 core tables organized across 5 architectural layers:
     - **Identity & Access**: `profiles`, `user_roles`, `reviewer_assignments`.
     - **Program Configuration**: `internship_domains`, `cohorts`, `project_briefs`.
     - **Applications & Payments**: `applications`, `application_details`, `payments`, `payment_events`.
     - **Internship & Evaluation**: `internships`, `project_assignments`, `project_submissions`, `evaluations`, `submission_revisions`.
     - **Documents & Observability**: `issued_documents`, `notifications`, `audit_logs`.
   - UUID primary keys, check constraints on dates/capacities/currencies, foreign keys with appropriate cascade rules, and integer minor units for all monetary values.
   - 20 performance and security indexes on ownership, assignment, cohort, and status fields.

2. **Supabase Auth & Role-Based Access Control**:
   - Four distinct user roles: `applicant`, `student`, `reviewer`, `admin`.
   - Security Definer helper functions: `has_role(user_id, role)`, `is_admin()`, `is_assigned_to_application()`, `is_assigned_to_internship()`, `is_assigned_to_submission()`.
   - `handle_new_user()` trigger on `auth.users`: automatically seeds public `profiles` and assigns default `applicant` role upon registration.
   - **Privilege Escalation Prevention**: `user_roles` denies client `INSERT`/`UPDATE`. Role grants and administrative operations are restricted to `is_admin()` or server-side Edge Functions.

3. **Row Level Security (RLS)**:
   - RLS enabled on all 18 tables.
   - Data isolation: Applicants and students access only their own records (`auth.uid() = applicant_id` / `student_id`).
   - Reviewer isolation: Reviewers access only assigned applications and submissions.
   - Financial protection: `payments` can be read by their owner or admin; client writes are strictly denied (must originate from trusted server-side Edge Functions/webhooks).
   - Audit trail: `audit_logs` is strictly append-only (no client `UPDATE` or `DELETE`).

4. **Private Storage Policies**:
   - Configured 4 private buckets (`public = false`): `resumes` (5MB, PDF), `project-reports` (20MB, PDF/ZIP), `certificates` (10MB, PDF), `lors` (10MB, PDF).
   - Storage RLS ensures applicants and students can only upload to their own user-scoped directory (`auth.uid() = foldername[1]`).
   - Document certificates and LORs can only be written by server-side workers; students can only download their own issued files.

5. **Public Credential Verification RPC (`verify_credential`)**:
   - `SECURITY DEFINER` function with `search_path = public`, executable by unauthenticated callers (`anon`, `authenticated`).
   - Returns strictly non-sensitive fields: `valid`, `verification_id`, `document_type`, `student_name`, `domain_name`, `completion_date`, `status`, `issued_at`.
   - Enforces zero PII exposure: does NOT return student email, phone, private file path, internal database IDs, or evaluation marks. Restricts lookups to issued certificates (never LORs).

6. **Local Seed Data (`supabase/seed.sql`)**:
   - Seeds the 4 approved engineering domains (AI Systems, Full-Stack Web, Cloud/DevOps, Data Engineering).
   - Seeds sample project briefs with evaluation rubrics.
   - Seeds a draft preview cohort template with 0 minor-unit placeholder fee (no invented commercial commitments).

7. **Client Integration & Typing**:
   - Installed `@supabase/supabase-js`.
   - Generated complete TypeScript database definitions: `src/types/database.types.ts`.
   - Authored safe browser client wrapper: `src/lib/supabase/client.ts` with graceful fallback when credentials are unconfigured.
   - Strict client isolation: zero references to `SUPABASE_SERVICE_ROLE_KEY` or secret keys in client-side code.

8. **Configuration & Documentation**:
   - Created `.env.example` with clear distinction between public `VITE_` client variables and server-side secret variables.
   - Created `supabase/config.toml` for local Supabase CLI development.
   - Authored comprehensive architecture and migration guide: `docs/SUPABASE_SETUP.md`.

### C. Build & Verification Results
| Check | Command | Result | Details |
|---|---|---|---|
| Linter | `npm run lint` (`oxlint`) | **PASSED** | 0 warnings, 0 errors across 57 files in 81ms |
| TypeScript & Build | `npm run build` (`tsc -b && vite build`) | **PASSED** | Compiled production bundle in 861ms (dist: 324kB JS, 96kB CSS) |
| Theme Contrast | `npm run test:contrast` | **PASSED** | 29/29 WCAG 2.2 AA checks passing ($\ge 4.5:1$) |
| Supabase Security Test | `npm run test:supabase` | **PASSED** | 82/82 automated checks passing: table creation, RLS enablement, helper functions, privilege escalation defense, storage privacy, RPC safety, typing, client isolation |
| Complete Test Suite | `npm test` | **PASSED** | 111/111 passing checks across all contrast and database security test suites |

### D. Remaining Blockers & Next Phase
- **Blocker (Decision O-01)**: Live production/staging Supabase project has not yet been approved by the owner. All code remains 100% local and tested.
- **Blocker (Decision O-02)**: Final program fee and refund policy must be approved by the owner before payment gateway orders are implemented.
- **Blocker (Decision O-03)**: Payment gateway provider (Razorpay vs Cashfree) selection required.
- **Next Phase**: Await owner review and sign-off on Phase 2 foundation before implementing Phase 3 (Applicant Portal, Authentication UX, and Payment Edge Functions).

---

## Phase 2 Security Review & Penetration Audit — 2026-10-16

### A. Review Scope & Methodology
Conducted an adversarial line-by-line inspection of the completed Supabase backend foundation:
- Schema migration `supabase/migrations/20261016000000_initial_schema_and_security.sql`
- Security-definer helper functions, execution grants, and search paths
- Database table grants (defense-in-depth privileges)
- Row Level Security (RLS) policies for anonymous, applicant, reviewer, and admin contexts
- Storage bucket configurations and relational file policies
- Credential verification stored procedure input sanitation and redaction
- Client bundle secret isolation and environment configuration templates

### B. Findings Grouped by Severity

#### 1. High Severity (Remediated)
- **H-01: Application State Reversion / Tampering via Client UPDATE**
  - *Vulnerability*: The original `applications_update_applicant` policy had `USING (applicant_id = auth.uid() OR public.is_admin())` without checking current status. A student whose application was rejected or accepted could issue an `UPDATE` reverting their status to `draft` or `submitted`, or alter records while under review. Additionally, client payloads could tamper with `reviewed_by`, `reviewed_at`, and `decision_note`.
  - *Fix*: Hardened `USING` clause to `applicant_id = auth.uid() AND status = 'draft'`. In `WITH CHECK`, strictly enforced `(status = 'draft' OR status = 'submitted') AND reviewed_by IS NULL AND reviewed_at IS NULL AND decision_note IS NULL`. Non-draft applications can no longer be updated by applicants, and reviewer metadata tampering is rejected.
- **H-02: Project Submission Client Self-Approval**
  - *Vulnerability*: `project_submissions_update_student` and `insert_student` did not enforce status checks in `WITH CHECK`. A student could submit an update setting `status = 'approved'`.
  - *Fix*: Restricted `WITH CHECK` for non-admins to `status IN ('draft', 'submitted')`. Students can only save drafts or submit; transitions to `approved`, `under_review`, or `revision_required` can only be performed by reviewers/admins or server-side functions.
- **H-03: Security Definer Helper Caller-ID Probing**
  - *Vulnerability*: `has_role(check_user_id, check_role)` and `is_assigned_to_*` took caller-supplied `check_user_id` without verifying whether the caller was `check_user_id` or an admin. An authenticated applicant could enumerate other users' IDs to probe whether they held the `admin` or `reviewer` role.
  - *Fix*: Enforced `(check_user_id = auth.uid() OR public.is_admin())` within all security definer helper functions. Any probe against another user returns `FALSE` unless called by an authorized administrator.

#### 2. Medium Severity (Remediated)
- **M-01: Blanket Profile Visibility for Reviewers**
  - *Vulnerability*: `profiles_select_own` permitted any user with the `reviewer` role to view all participant profiles across the platform.
  - *Fix*: Scoped reviewer profile SELECT strictly to participants assigned to the reviewer via `reviewer_assignments` (either cohort-level or internship-level). Unassigned participants cannot be queried.
- **M-02: Storage Bucket Upload/Download Relied on Filepath Structure Alone**
  - *Vulnerability*: Storage policies checked `(storage.foldername(name))[1] = auth.uid()::text` but did not verify whether the referenced application or internship existed in the database and was in an editable state.
  - *Fix*: Storage policies now verify database relationships:
    - `resumes`: Upload verifies `applications` table for ownership and `status = 'draft'`. Reviewer download checks `is_assigned_to_application()`.
    - `project-reports`: Upload verifies `internships` table for ownership and `status IN ('active', 'submitted')`. Reviewer download checks `is_assigned_to_internship()`.
- **M-03: Missing Table-Level Database Grants (Defense-in-Depth)**
  - *Vulnerability*: Relying exclusively on RLS without restricting table grants meant that if RLS were misconfigured, default grants could permit access.
  - *Fix*: Executed explicit `REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC`. Granted `anon` SELECT access only to public catalog (`internship_domains`, `cohorts`). Denied `authenticated` users `INSERT`, `UPDATE`, or `DELETE` on `user_roles`, `payments`, `payment_events`, `issued_documents`, and `audit_logs` at the database privilege layer.

#### 3. Low Severity / Informational (Remediated)
- **L-01: Public Credential Verification RPC Input Sanitization**
  - *Hardening*: Added input guards in `verify_credential`: rejects null, empty, trimmed `< 3`, or oversized `> 64` character identifiers.
- **L-02: Evaluation Release Direct Publishing Guard**
  - *Hardening*: `evaluations_insert_reviewer` and `evaluations_update_reviewer` strictly enforce `released_at IS NULL` for non-admins, preventing reviewers from prematurely exposing grades to students before administrative sign-off.

### C. Build & Verification Results
| Check | Command | Result | Details |
|---|---|---|---|
| Linter | `npm run lint` (`oxlint`) | **PASSED** | 0 warnings, 0 errors across 57 files in 28ms |
| TypeScript & Build | `npm run build` (`tsc -b && vite build`) | **PASSED** | Compiled production bundle in 342ms |
| Theme Contrast | `npm run test:contrast` | **PASSED** | 29/29 WCAG 2.2 AA checks passing ($\ge 4.5:1$) |
| Supabase Security Test | `npm run test:supabase` | **PASSED** | 100/100 automated security checks passing (RLS, probing guards, state machine locks, storage relations, grant restrictions) |
| Complete Test Suite | `npm test` | **PASSED** | 129/129 total assertions passing with 0 failures |

### D. Security Verification Confirmations Prior to Phase 3
1. **Submitted Application Immutability**: Confirmed that `applications_update_applicant` policy enforces `USING (applicant_id = auth.uid() AND status = 'draft')`. Once an application transitions to `submitted`, `under_review`, `accepted`, or `rejected`, applicants have zero database UPDATE access via direct API calls or alternative update paths.
2. **Security-Definer Helper Isolation**: Verified that `has_role`, `is_admin`, and all `is_assigned_to_*` helpers enforce `SET search_path = public` and strictly mandate `check_user_id = auth.uid() OR public.is_admin()`, completely preventing caller-supplied ID probing and privilege escalation.
3. **Explicit Table Grants**: Verified that `REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC` is executed, anonymous users are restricted to public catalogs (`internship_domains`, `cohorts`), and authenticated users are denied direct write access on `user_roles`, `payments`, `payment_events`, `issued_documents`, and `audit_logs`.
4. **Migration & Test Alignment**: Confirmed that `supabase/migrations/20261016000000_initial_schema_and_security.sql` and `scripts/verify-supabase-schema.js` exactly match the 18-table schema and 100 security assertions.

---

## Phase 3 — Local Applicant Portal & Supabase Auth UX Implementation (2026-10-16)

### A. Architectural Scope & Principles
Phase 3 establishes the end-to-end local applicant experience while strictly observing all project security invariants:
- **Zero Remote Mod**: 100% local development (Decision O-01 preserved; no production or staging remote Supabase project modified).
- **Client Secret Isolation**: Zero leakage of `SUPABASE_SERVICE_ROLE_KEY` or JWT secrets in client bundles. Only browser-safe `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are consumed.
- **Server-Side Enforcement**: Authorization and state transitions are enforced at the database layer via PostgreSQL RLS policies; frontend route guards are purely UX conveniences.
- **State Machine Integrity**: Submitted applications are strictly immutable to the applicant.
- **No Unapproved Content/Fees**: No payment processing code implemented, no fake fees invented, no unapproved cohort dates or certificates/LORs promised (Decisions O-02, O-03 preserved).
- **Visual & Accessibility Excellence**: Full reuse of approved Quiclogix design system tokens, consistent Warm Stone (`#F7F5F0`) light mode and Deep Forest (`#0D1913`) dark mode, passing all WCAG 2.2 AA contrast rules ($\ge 4.5:1$).

### B. Implemented Components & Workflows

1. **Supabase Authentication Layer & Sandbox Mode**:
   - `src/contexts/authContextDef.ts`: Dedicated context definition ensuring Fast Refresh compliance.
   - `src/contexts/AuthContext.tsx`: Comprehensive auth provider handling Supabase `onAuthStateChange`, profile retrieval, authoritative `user_roles` fetching, and a local **Developer Sandbox Preview** mode (`enableDemoUser`) allowing complete offline evaluation without requiring a live remote auth server.
   - `src/hooks/useAuth.ts`: Clean custom hook exposing auth state, user profile, roles, sign-in, registration, sign-out, and demo switching.

2. **Routing & Responsive Navigation Integration**:
   - `src/hooks/useNavigation.ts`: Added `'portal'`, `'apply'`, and `'auth'` routes (with aliases `'dashboard'`, `'application'`, `'login'`, `'signup'`).
   - `src/App.tsx`: Wrapped in `AuthProvider`; renders `PortalPage`, `ApplyPage`, and `AuthPage` based on active route.
   - `src/components/layout/Navbar/Navbar.tsx`: Integrated dynamic portal entry button (`.navbar__portal-btn`) showing user's name or "Applicant Portal" badge, responsive across desktop and mobile menus.

3. **Authentication UX (`src/pages/Auth/AuthPage.tsx` & `AuthPage.css`)**:
   - Dual-mode sign in and applicant registration forms with field validation.
   - Magic link authentication support.
   - Prominent **Developer Sandbox Preview** panel with one-click "Continue as Demo Applicant" button for instant local verification.

4. **Applicant Portal Dashboard (`src/pages/Portal/PortalPage.tsx` & `PortalPage.css`)**:
   - Dynamic 4-stage visual stepper: `Draft` $\to$ `Submitted` $\to$ `Under Review` $\to$ `Decision`.
   - Active track card displaying domain, cohort, submission timestamp, and current state badge.
   - Read-only review drawer displaying submitted portfolio URL, skills, and academic background.
   - Profile management drawer allowing applicants to view and update contact information.
   - Strict intake governance notices informing candidates about program criteria and selection timeline.

5. **Application Form & Lifecycle (`src/pages/Apply/ApplyPage.tsx` & `ApplyPage.css`)**:
   - 4 approved tracks selectable: Full-Stack Web Engineering, Mobile Application Development, AI & Applied Machine Learning, Cloud Architecture & DevOps.
   - Academic background & experience textarea with validation.
   - Technical skills input and portfolio/GitHub URL fields.
   - PDF Resume upload area with client-side file size ($\le 5$MB) and MIME type (`application/pdf`) validation, uploading to private `resumes` bucket at `{user_id}/{application_id}/resume.pdf`.
   - Mandatory statutory declarations and program consent checkboxes.
   - **Save Draft**: Persists data to database while keeping status as `draft`, displaying clear confirmation.
   - **Submit Final Application**: Confirmation modal warning that submission is final, followed by transition to `submitted` status and instant read-only locking.

6. **Database Types & Client Alignment (`src/types/database.types.ts`)**:
   - Updated `Database` interface with complete `Tables`, `Views`, `Functions`, `Enums`, `CompositeTypes`, and explicit `Relationships` on all 18 tables to satisfy `@supabase/supabase-js` v2.118.0 `GenericSchema`.

### C. Build & Verification Results
| Check | Command | Result | Details |
|---|---|---|---|
| Linter | `npm run lint` (`oxlint`) | **PASSED** | 0 warnings, 0 errors across 66 files in 61ms |
| TypeScript & Production Build | `npm run build` (`tsc -b && vite build`) | **PASSED** | 141 modules transformed; compiled cleanly in 494ms |
| Theme Contrast Test | `npm run test:contrast` | **PASSED** | 29/29 WCAG 2.2 AA checks passing ($\ge 4.5:1$) in both light and dark modes |
| Supabase Security Test | `npm run test:supabase` | **PASSED** | 100/100 automated checks passing (RLS, security-definers, table grants, storage policies, typing) |
| Total Automated Assertions | `npm test` | **PASSED** | 129/129 total assertions passing with 0 failures |

### D. Unresolved Decisions & Blockers
- **Decision O-01 (Remote Supabase Project)**: Pending human owner creation/provisioning of remote Supabase project. Development remains 100% locally operable.
- **Decision O-02 (Fee Structure & Refund Policy)**: Official program fee and refund terms remain pending owner decision. Payments are intentionally excluded from Phase 3.
### E. Pause of Reviewer/Admin Dashboard (Phase 4)
*Owner Notice (2026-10-16)*: The planned Phase 4 reviewer/admin evaluation dashboard has been paused per owner instruction. Focus shifted immediately to implementing the revised 19-domain discovery catalog and student application journey.

---

## Phase 3 Update — 19-Domain Discovery Catalog & Student Application Flow (2026-10-16)

### A. Summary of Requirements & Scope
Per owner directive on 2026-10-16:
1. **Public Internship Tab — 19 Technical Specialization Domains**:
   - Single authoritative discovery directory and application entry point on `#internship`.
   - All 19 owner-approved domains rendered with title, technical tag, concise description, skills chips, sample capstone brief, and an "Apply Now" button:
     1. App Development
     2. Artificial Intelligence
     3. Frontend Developer
     4. Backend Developer
     5. Full Stack Developer
     6. Blockchain Developer
     7. C Programming
     8. Cybersecurity
     9. Data Analytics
     10. Data Science
     11. DevOps
     12. Digital Marketing
     13. Graphic Designer
     14. Internet of Things
     15. Java Programmer
     16. Machine Learning
     17. Python Programming
     18. Robotics and Information
     19. UI/UX Design
   - Explicitly preserves Artificial Intelligence and Machine Learning as distinct, separate tracks.
   - Interactive search and category filters (`All Tracks (19)`, `Software Engineering (6)`, `Data & AI (4)`, `Systems & Security (5)`, `Design & Strategy (4)`).
   - Zero public fee or refund policy leakage.

2. **Stateful Application Flow & Domain Preservation**:
   - Visitors can explore all pages without authentication.
   - Clicking "Apply Now" on any domain:
     - If unauthenticated: routes to `#auth?redirect=apply&domain=<slug>`.
     - Upon successful login, registration, or demo login: seamlessly returns the student to `#apply?domain=<slug>` with their selected domain preselected.
     - If authenticated: routes directly to `#apply?domain=<slug>`.

3. **Academic Application Form**:
   - Full Name (prefilled from profile, updates profile).
   - Email (read-only from authenticated account).
   - Phone Number (prefilled from profile).
   - Course or Degree (select/input).
   - Branch / Specialization: strictly mandatory for engineering degrees (e.g. B.Tech, B.E., M.Tech); conditionally optional for non-engineering courses.
   - College / Institution Name (required).
   - Current Study Year / Graduation Status (select).
   - Selected Internship Domain (dropdown of all 19 tracks).
   - Skills & Competencies (input chips).
   - Portfolio / GitHub URL (optional).
   - Private Resume Upload (PDF only, $\le 5$MB, uploaded to `resumes` bucket `{user_id}/{application_id}/resume.pdf`).
   - Statutory declarations and policy consent checkbox.

4. **Duplicate Active Application Prevention**:
   - Database partial unique index: `idx_applications_active_student_domain ON public.applications (applicant_id, domain_id) WHERE status IN ('draft', 'submitted', 'under_review', 'accepted')`.
   - Client guard: checking domain changes to load existing draft if present, or lock to read-only with a warning banner if an application is already active/submitted for that domain.

5. **Private Admin/Reviewer Isolation**:
   - Phase 4 reviewer/admin dashboard paused.
   - No Admin Panel or Reviewer Portal navigation links exposed on public Navbar or Footer.

### B. Database Migration & Data Layer
- **`src/data/internshipDomains.ts`**: Single authoritative catalog exporting all 19 domains with stable UUIDs, slugs, categories, descriptions, and lookup helpers (`getDomainBySlug`, `getDomainById`).
- **`supabase/migrations/20261016000001_seed_19_internship_domains.sql`**:
  - Safe, non-destructive migration upserting all 19 domains into `public.internship_domains`.
  - Extends `public.application_details` with `course_or_degree`, `branch_specialization`, `institution_name`, `study_or_graduation_year`, and `phone`.
  - Creates partial unique index `idx_applications_active_student_domain`.
- **`supabase/seed.sql`**: Updated with all 19 domains.
- **`src/types/database.types.ts`**: Updated `application_details` Row, Insert, and Update interfaces.

### C. Build & Verification Results
| Check | Command | Result | Details |
|---|---|---|---|
| Linter | `npm run lint` (`oxlint`) | **PASSED** | 0 warnings, 0 errors across 68 files in 65ms |
| TypeScript & Production Build | `npm run build` (`tsc -b && vite build`) | **PASSED** | 143 modules transformed; clean production bundle in 494ms |
| Theme Contrast Test | `npm run test:contrast` | **PASSED** | 29/29 WCAG 2.2 AA checks passing ($\ge 4.5:1$) |
| Supabase Security Test | `npm run test:supabase` | **PASSED** | 100/100 automated security checks passing |
| Internship Flow Test | `npm run test:internship` | **PASSED** | 81/81 domain catalog, branch validation, routing, and isolation checks passing |
| Complete Test Suite | `npm test` | **PASSED** | 210/210 total assertions passing across all suites |

### D. UX, Authentication & Animation Refinement (2026-10-16)

#### 1. Simplified Login & Registration Experience
- **Login Page (`AuthPage.tsx`)**:
  - Clean, dedicated login form with email and password inputs.
  - Password visibility toggle (`Show password` / `Hide password`) with accessible SVGs.
  - Clear label hierarchy, validation error feedback, and loading indicators.
  - Prominent prompt beneath form: **`New here? Register now`** (direct link toggling mode to `signup`).
  - Top tab switcher completely removed for a clean, distraction-free card.
- **Registration Page (`AuthPage.tsx`)**:
  - Clean, dedicated registration form consistent with login visual hierarchy.
  - Required fields: Full Name, Email, Password, Confirm Password.
  - Password visibility toggle on both password fields.
  - Client password length ($\ge 6$) and confirm password matching validation.
  - Prominent prompt beneath form: **`Already have an account? Login`** (direct link toggling mode to `signin`).
- **Magic Link Removed**:
  - Magic Link options, tabs, and alternative actions removed per owner instruction for a straightforward email + password flow.
- **Live Supabase Connected**:
  - Remote project credentials configured in `.env.local` (`https://xobdcbcocurmwhuelfji.supabase.co`).
  - Unified setup script `supabase/FULL_SETUP.sql` provided for one-click SQL Editor deployment.
- **URL Hash Synchronization**: Supports `#login`, `#signin`, `#signup`, `#register`, `#auth?mode=signup`, and `#auth?mode=signin` seamlessly.
- **Preserved Infrastructure**: Supabase Auth client, local demo sandbox mode, session persistence, and applicant redirect targets (`#apply`, `#portal`) remain 100% intact.

#### 2. Delayed Login/Register Engagement Popup (`AuthPopup.tsx`)
- **6-Second Delayed Trigger**: Displays after approximately 6000ms (`DELAY_MS = 6000`) of browsing on public pages for unauthenticated visitors.
- **Exclusion Filters**: Never triggers for authenticated users, on `#auth`, `#apply`, or `#portal` routes.
- **Session-Level Dismissal**: Persisted via `sessionStorage.setItem('qlx_auth_popup_dismissed', 'true')` — never re-triggers on subsequent navigation within the same browser session.
- **Exact Inviting Copy**:
  - Headline: **`Your next opportunity starts here.`**
  - Body: `Explore opportunities with Quiclogix Solutions. Sign in to continue or create an account to get started.`
  - Primary Action: **`Login`**
  - Secondary Action: **`Register Now`**
  - Subtle dismiss link: `Continue exploring as visitor`
- **Mandatory Accessible Close (✕) Button**:
  - Upper-right corner, 44×44px comfortable touch target.
  - Accessible label: `aria-label="Close login popup"`.
  - Visible focus ring (`outline: 2px solid var(--color-accent)`).
- **Accessibility & Focus Controls**:
  - Backdrop click closes popup.
  - Escape key closes popup.
  - Traps and restores focus to previous active element upon close.
  - Background scrolling locked while popup is active (`document.body.style.overflow = 'hidden'`) and restored upon dismissal.
  - Smooth entrance/exit transitions powered by Motion (`motion/react`), respecting `prefers-reduced-motion`.

#### 3. Public Navigation Sanitization
- **Portal Tab Removed**:
  - `{ id: 'portal', label: 'Portal', href: '#portal' }` removed from `NAV_LINKS` in `Navbar.tsx`.
  - Public desktop and mobile drawer navigations display only public tabs (`Overview`, `About`, `Services`, `Projects`, `Internship`, `Verify Certificate`, `Contact`).
  - Unauthenticated `Applicant Portal` CTA button hidden from public navbar.
  - When an applicant is authenticated, the badge smoothly displays their personal account/dashboard.
  - Public `Footer.tsx` verified to contain zero administrative or portal links.
  - Underlying database tables, RLS, and applicant application state remain fully preserved.

#### 4. Form Fields, Placeholders & Responsive Layouts
- **Inputs & Textareas**:
  - Reusable `Input` enhanced with `rightIcon` support and alias `helperText`.
  - Comfortable 44px input heights and consistent padding across `Input.css` and `ApplyPage.css`.
  - Responsive grids stack vertically on smaller mobile screens (`grid-template-columns: 1fr` mobile, `1fr 1fr` tablet/desktop).
- **Standardized Placeholders**:
  - Full name: `Enter your full name` (AuthPage, ApplyPage, ContactPage)
  - Email: `you@example.com` (AuthPage, ContactPage)
  - Phone: `Enter your mobile number` (ApplyPage)
  - College: `Enter your college or university` (ApplyPage)
  - Course: `B.Tech, BCA, MCA` in options list (ApplyPage)
  - Branch: `e.g. Computer Science and Engineering` (ApplyPage)
  - Password: `Enter your password` (AuthPage Login)
  - New password: `Create a strong password` (AuthPage Registration)

#### 5. Premium Animations (Motion & GSAP)
- **Hero Entrance**: Coordinated staggered reveals for hero badge (0.05s), headline (0.1s), lead (0.2s), actions (0.3s), and quick lookup (0.4s).
- **Scroll-Triggered Reveals**: Motion `whileInView` with `viewport={{ once: true }}` on Pillar cards, Capabilities cards, Principles items, Sprint steps, and Internship domain cards.
- **Card & Button Micro-Interactions**: Subtle elevation hover (`translateY(-2px)`), active press feedback (`translateY(1px)`), and smooth transition tokens.
- **Subtle Route Transitions**: `AnimatePresence` with `motion.div` in `App.tsx` for seamless, non-flickering page switches.
- **Reduced-Motion Compliance**: CSS and motion components respect `prefers-reduced-motion: reduce`.

### E. Build & Verification Results (2026-10-16)
| Check | Command | Result | Details |
|---|---|---|---|
| Linter | `npm run lint` (`oxlint`) | **PASSED** | 0 errors across 70 files |
| TypeScript & Production Build | `npm run build` (`tsc -b && vite build`) | **PASSED** | 556 modules transformed; 0 errors; clean production bundle |
| Theme Contrast Test | `npm run test:contrast` | **PASSED** | 29/29 WCAG 2.2 AA contrast tests passing |
| Supabase Security Test | `npm run test:supabase` | **PASSED** | 100/100 automated security assertions passing |
| Internship & UX Flow Test | `npm run test:internship` | **PASSED** | 107/107 domain catalog, popup specs, auth links, and placeholder checks passing |
| Complete Test Suite | `npm test` | **PASSED** | 236/236 total automated assertions passing |

### F. Scope Control & Next Action
- **Phase 4 Status**: Reviewer/admin dashboard remains **PAUSED** per instructions.
- **Scope Compliance**: No database schema, RLS policies, or backend capabilities were deleted.
- **Next Step**: Await user review of the refined UX, authentication popup, and animations.











