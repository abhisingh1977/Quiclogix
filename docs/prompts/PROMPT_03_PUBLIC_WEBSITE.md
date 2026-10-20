# Antigravity Prompt 03 — Public Website (Phase 1B)

You are the product architect and lead frontend engineer for Quiclogix Solutions.

Prompt 01 (planning) and Prompt 02 (foundation and design tokens) are approved and complete. Read `docs/MEMORY.md`, `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/IMPLEMENTATION_PLAN.md`, `docs/decisions/OPEN_DECISIONS.md`, and `docs/decisions/SECURITY_MATRIX.md` before writing code.

---

## 1. Context and Current State

- **Scaffold**: React 19 + Vite 8 + TypeScript 6 + Tailwind CSS v4 is initialized and operational.
- **Design system**: Core tokens (colors, typography, spacing, radii, shadows, motion) and foundational UI primitives (`Button`, `Card`, `Badge`, `Input`, `Section`) are established in `src/index.css` and `src/components/ui/`.
- **Layout & Theme**: Responsive `Navbar`, `Footer`, and `useTheme` dark/light mode toggle are built.
- **Confirmed owner decisions**:
  - Official company name: **Quiclogix Solutions**.
  - Frontend development proceeds using clearly marked placeholders for unresolved owner decisions.
- **Unresolved owner decisions (MUST NOT be fabricated or assumed)**:
  - Official production domain and DNS ownership (`B-01` — unverified).
  - Registered corporate details, CIN, GST, postal address (`B-02`).
  - Brand vector logo SVG (`B-03`).
  - Company narrative and leadership team profiles (`B-07`, `B-08`).
  - Internship fees, taxes, and inclusions (`I-02`, `I-03`).
  - First cohort schedule and deadlines (`I-04`).
  - Selection methodology and eligibility prerequisites (`I-06`, `I-07`).
  - Certificate passing rubric and LOR policy/signatory (`D-01`, `D-02`, `D-04`).
  - Refund, withdrawal, and deferral timeline (`P-02`, `P-03`).
  - Payment provider (`P-01`) and Supabase project approval (`O-01`).

---

## 2. Scope: Phase 1B Public Pages

Implement the complete suite of public-facing pages according to PRD §6:

1. **Home**:
   - Clear company positioning and primary calls-to-action (*Explore Services*, *Internship Program*).
   - Core value pillars highlighting engineering rigor, security focus, and evaluation-based training.
   - Consulting services overview with direct links to details.
   - Internship teaser with milestone highlights and transparency notices.
   - Contact CTA banner.

2. **About**:
   - Corporate mission, engineering philosophy (*Craftsmanship Over Hype*, *Absolute Transparency*, *Measurable Competence*).
   - 4-step engineering approach (*Data Modeling*, *Security Enforcement*, *Iterative Slices*, *Verification*).
   - Company profile section with explicit placeholders for legal registration (`B-02`), founding story (`B-07`), and leadership staff (`B-08`).

3. **Services**:
   - Detailed consulting service cards structured strictly by:
     - **Problem Addressed**
     - **Deliverables Produced**
     - **Intended Audience**
     - **Technology Stack**
   - Core capabilities: Custom Web Engineering, PostgreSQL & Cloud Backend Architecture, System Modernization & Technical Audit, Design Systems & UI Engineering.
   - Client engagement model overview (*Discovery*, *Weekly Demos*, *100% IP Ownership*).

4. **Projects / Case Studies**:
   - Technical case studies detailing context, engineering contribution, stack, and outcomes.
   - Explicit honesty labels on every item (*Reference Prototype*, *Concept Architecture*, *Internal Benchmark*).
   - Direct statement of integrity standards (no vanity metrics, no fake client logos).

5. **Internship Program** (PRD §6 & Acceptance Test 1.4 compliant):
   - **Mandatory disclosures published in full before any CTA**:
     - Fee & inclusions (`I-02`, `I-03`)
     - Certificate passing rubric criteria (`D-01`)
     - Conditional LOR policy and criteria (`D-02`, `D-03`)
     - Refund, withdrawal, and deferral policy (`P-02`, `P-03`)
     - Cohort prerequisites and workload expectations (`I-06`, `I-08`)
   - Interactive track tabs for specialized domains (*Full-Stack Web Engineering*, *Cloud & Backend Systems*, *Design Systems*).
   - 4-week sprint timeline reflecting an agile engineering workflow.
   - Comprehensive FAQ accordion addressing curriculum, evaluations, revisions, and credential validity.

6. **Contact**:
   - Client-side validated inquiry form (Full Name, Email Address, Subject, Inquiry Category, Message).
   - Honeypot anti-spam trap field.
   - Simulated success and error notification states.
   - Corporate contact details column with placeholders for official email (`B-01`/`E-01`) and registered office (`B-02`).

7. **Public Certificate Verification** (PRD §6 & Acceptance Test 1.10 compliant):
   - Credential ID lookup input with test trigger for sample ID `QLX-2026-FSD-001`.
   - Verified authenticity result exposing minimal privacy metadata (recipient initials/name, program, domain, cohort date, validity status).
   - Realistic "Credential Not Found" error state for invalid queries.
   - No authentication required.

8. **Legal Pages**:
   - Tabbed or dedicated views for **Privacy Policy** (aligned with DPDP Act 2023 principles), **Terms of Service** (academic integrity, intellectual property, limitation of liability), and **Payment & Refund Policy** (withdrawal windows and post-commencement terms).

---

## 3. Engineering & Design Requirements

- **Reuse Existing Architecture**: Inspect existing files before editing. Reuse existing UI primitives (`Button`, `Card`, `Badge`, `Input`, `Section`), layout components (`Navbar`, `Footer`), and hooks (`useTheme`). Do not overwrite or discard working code unnecessarily.
- **Client Routing**: Ensure zero-dependency client-side routing (e.g. hash-based routing with `useNavigation`) synchronizes with browser history, updates the active navbar link, and scrolls smoothly to top on page transition.
- **Aesthetic Direction**:
  - Original, professional, intentionally art-directed Quiclogix design language.
  - Deep navy slate surfaces with electric teal accents, subtle radial ambient glows, and tokenized glassmorphism.
  - Typography: Plus Jakarta Sans (headings), Inter (body), JetBrains Mono (monospace).
  - Maintain smooth micro-interactions that strictly respect `@media (prefers-reduced-motion: reduce)`.
- **Honesty & Placeholder Rule**:
  - Never invent client logos, awards, uptime claims, testimonial quotes, legal registration numbers, or unapproved program prices.
  - Wrap all unresolved owner decisions in clear, dedicated placeholder components (such as `OwnerNotice` or `[OWNER: ...]` tags).
- **Out of Scope**:
  - Do NOT connect real payment gateways (Razorpay/Stripe) or enable live billing.
  - Do NOT connect Supabase backend or run database migrations in this phase.
  - Do NOT build authenticated student/reviewer/admin portal views in this prompt.

---

## 4. Verification & Testing Requirements

1. **Linting**: Run `npm run lint` (`oxlint`). Must pass with 0 errors and 0 warnings.
2. **TypeScript & Build**: Run `npm run build` (`tsc -b && vite build`). Must pass with 0 errors and 0 warnings.
3. **Responsive Verification**: Verify that navigation, forms, tabs, and grids adapt cleanly across mobile, tablet, and desktop viewports.
4. **Documentation**: Update `docs/MEMORY.md` with:
   - Specific pages and components built or updated.
   - Actual test/build command outputs.
   - Checklist items completed in Phase 1.
   - Current status, blockers, and recommended next step.

---

## 5. Completion Deliverable

Stop at the conclusion of Phase 1B. Report:
- A. Summary of pages and components created/updated.
- B. Actual lint, typecheck, and build results (report real outputs).
- C. Confirmation of zero fabricated claims or metrics.
- D. Status of open owner decisions.
- E. Recommended next phase (Phase 2 — Supabase Foundation).
