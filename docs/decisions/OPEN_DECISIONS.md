# Open Decisions — Quiclogix Solutions

Version: 1.0
Status: Requires owner input before implementation begins
Last updated: 2026-10-13

## How to use this document

Each decision is categorized by domain and assigned a priority:
- **P0 — Blocks all implementation**: cannot begin the relevant phase without this.
- **P1 — Blocks production launch**: can build with placeholders, but cannot go live.
- **P2 — Should be decided before launch**: low-risk to defer, but needed for completeness.

Mark decisions RESOLVED with the date, owner, and outcome when finalized.

---

## 1. Brand and Identity

| ID | Decision | Priority | Blocks | Status |
|----|----------|----------|--------|--------|
| B-01 | Official company domain (e.g. quiclogix.com) and proof of domain ownership/DNS control | P0 | Production deployment, email sending, SSL | OPEN (Unverified as of 2026-10-14) |
| B-02 | Legal company name, registration number, registered address, GST number (if applicable) | P0 | Footer, legal pages, invoices | PARTIALLY RESOLVED (Company name confirmed as "Quiclogix Solutions" on 2026-10-14; registration details/address/GST remain OPEN) |
| B-03 | Brand logo (vector/SVG format), favicon, and social-share image | P0 | Phase 1 design system | OPEN (Frontend placeholder permitted) |
| B-04 | Primary and secondary brand colors, approved color palette | P1 | Phase 1 design system | RESOLVED for frontend (Quiclogix Navy Slate & Electric Teal system token set adopted) |
| B-05 | Typography selection — Google Fonts or licensed fonts | P1 | Phase 1 design system | RESOLVED for frontend (Plus Jakarta Sans, Inter, JetBrains Mono adopted) |
| B-06 | Approved company tagline / positioning statement | P1 | Home page hero | OPEN (Placeholder permitted for frontend) |
| B-07 | Owner-approved "About" copy — company story, mission, values | P1 | About page | OPEN (Placeholder permitted for frontend) |
| B-08 | Team member details (names, roles, photos) — or decision to omit team section | P1 | About page | OPEN (Placeholder permitted for frontend) |

## 2. Services and Projects

| ID | Decision | Priority | Blocks | Status |
|----|----------|----------|--------|--------|
| S-01 | List of actual services the company offers, with descriptions | P1 | Services page | OPEN |
| S-02 | Real project case studies (context, contribution, stack, outcomes) | P1 | Projects page | OPEN |
| S-03 | Permission to label any projects as student/demo/concept work | P2 | Projects page honesty labels | OPEN |

## 3. Internship Program Configuration

| ID | Decision | Priority | Blocks | Status |
|----|----------|----------|--------|--------|
| I-01 | Available internship domains and descriptions | P0 | Domain seeding, application form | RESOLVED (2026-10-16: Owner approved authoritative list of 19 domains: App Development, Artificial Intelligence, Frontend Developer, Backend Developer, Full Stack Developer, Blockchain Developer, C Programming, Cybersecurity, Data Analytics, Data Science, DevOps, Digital Marketing, Graphic Designer, Internet of Things, Java Programmer, Machine Learning, Python Programming, Robotics and Information, UI/UX Design) |
| I-02 | Program fee amount, currency, applicable taxes (GST if applicable) | P0 | Payment flow, program page | OPEN |
| I-03 | What is included in the fee (mentorship, certificate, LOR, tools, etc.) | P0 | Program page, terms | OPEN |
| I-04 | First cohort start/end dates, application deadline | P0 | Cohort configuration | OPEN |
| I-05 | Cohort capacity (max participants per cohort per domain) | P1 | Capacity enforcement | OPEN |
| I-06 | Eligibility criteria (education level, skills, prerequisites) | P0 | Application form, program page | OPEN |
| I-07 | Selection process — is it first-come-first-served, merit-based, or guaranteed on payment? | P0 | Application workflow logic | OPEN |
| I-08 | Expected workload (hours/week) | P1 | Program page | OPEN |
| I-09 | Mentoring model — 1:1, group, async review, office hours? | P1 | Reviewer assignment logic, onboarding | OPEN |
| I-10 | Project assessment rubric dimensions and weights | P1 | Evaluation form, rubric display | OPEN |
| I-11 | Whether revision is allowed after first submission, and how many times | P1 | Submission workflow | OPEN |

## 4. Certificate and LOR Policy

| ID | Decision | Priority | Blocks | Status |
|----|----------|----------|--------|--------|
| D-01 | Certificate completion criteria — what exactly must a participant achieve? | P0 | Evaluation workflow, certificate issuance | OPEN |
| D-02 | Is the LOR guaranteed to every successful completer, or conditional? | P0 | LOR workflow, program page disclosure | OPEN |
| D-03 | If LOR is conditional, what are the exact criteria? | P0 (if conditional) | LOR workflow | OPEN |
| D-04 | Authorized certificate signatory (name, title) | P1 | Certificate template | OPEN |
| D-05 | Authorized LOR signatory (name, title) — may differ from certificate | P1 | LOR template | OPEN |
| D-06 | Certificate template design approval | P1 | Document generation | OPEN |
| D-07 | LOR template content/structure approval | P1 | Document generation | OPEN |
| D-08 | What minimal information should public verification reveal? (suggested: name, program, domain, completion date, status) | P1 | Verification endpoint | OPEN |

## 5. Payment and Refund

| ID | Decision | Priority | Blocks | Status |
|----|----------|----------|--------|--------|
| P-01 | Payment gateway provider (Razorpay, Cashfree, Stripe, other) | P0 | Payment integration | OPEN |
| P-02 | Refund policy — full/partial/no refund, conditions, timeline | P0 | Refund page, payment flow | OPEN |
| P-03 | Withdrawal policy — can applicants withdraw after acceptance? After payment? During program? | P0 | Application and internship state machines | OPEN |
| P-04 | Rescheduling policy — can a participant defer to a later cohort? | P1 | Internship workflow | OPEN |
| P-05 | Is GST applicable? If so, what is the HSN/SAC code and rate? | P1 | Invoice generation, fee display | OPEN |
| P-06 | Should the system generate invoices/receipts, or is that handled externally? | P1 | Payment workflow | OPEN |
| P-07 | Complaint/dispute resolution process | P1 | Terms page, support workflow | OPEN |

## 6. Infrastructure and Operations

| ID | Decision | Priority | Blocks | Status |
|----|----------|----------|--------|--------|
| O-01 | Supabase project (new project creation approval, region) | P0 | Phase 2 | OPEN |
| O-02 | Frontend hosting provider (Vercel, Netlify, Cloudflare Pages, other) | P1 | Deployment | OPEN |
| O-03 | Email provider and sender domain (Resend, Postmark, SendGrid, other) | P1 | Notifications | OPEN |
| O-04 | Error monitoring service (Sentry, LogRocket, other) | P2 | Phase 6 | OPEN |
| O-05 | Analytics — privacy-respecting analytics provider or none | P2 | Phase 6 | OPEN |
| O-06 | Data retention and deletion policy — how long are records kept? | P1 | Privacy policy, DB cleanup | OPEN |
| O-07 | Backup strategy — Supabase plan level and backup frequency | P1 | Phase 6 | OPEN |
| O-08 | Support channel — email, chat, or ticketing system? | P1 | Contact page, terms | OPEN |
| O-09 | Admin MFA requirement before production launch | P2 | Admin auth hardening | OPEN |

## 7. Legal and Compliance

| ID | Decision | Priority | Blocks | Status |
|----|----------|----------|--------|--------|
| L-01 | Privacy policy — reviewed by someone familiar with Indian IT Act / DPDP Act 2023 | P1 | Privacy page, launch gate | OPEN |
| L-02 | Terms of service — reviewed for the actual operating model | P1 | Terms page, launch gate | OPEN |
| L-03 | Is this program classified as education, training, or a service? Legal implications for GST, consumer protection, and advertising. | P1 | Terms, pricing, advertising | OPEN |
| L-04 | Age restriction / parental consent requirement | P2 | Application form | OPEN |
| L-05 | Cookie consent requirements | P2 | Cookie banner | OPEN |

---

## Resolution log

| Date | ID | Decision | Decided by |
|------|----|----------|------------|
| — | — | No decisions resolved yet | — |
