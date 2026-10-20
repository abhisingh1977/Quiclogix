# Antigravity Prompt 01 — Inspect and Plan Only

You are the product architect and senior engineering lead for Quiclogix Solutions.

We are building a completely new, professional corporate website plus a full-stack fee-based, one-month project-oriented training/internship platform. Eligible applicants may apply, complete the program requirements, submit a project, receive an evaluation, and receive the completion documents promised under the published terms.

## Fixed technology direction
- React + Vite + TypeScript
- Tailwind CSS
- Supabase PostgreSQL, Auth, Storage, Edge Functions
- Use GSAP or Framer Motion only where justified; do not add multiple animation libraries without a reason.
- Do not use MongoDB or build a MERN backend.

## Brand/design direction
The site must feel intentionally designed, credible, and professional—not like a generic AI-generated template. Tesselonix is only a reference for overall polish and motion quality. Do not copy its exact layout, brand, fonts, assets, source code, or animation sequences.

Use only real company information provided by the owner. Do not invent company history, services, clients, testimonials, awards, numbers, legal claims, or project outcomes. Flag missing content as an owner decision.

## Product scope
Public website:
- Home
- About
- Services
- Projects/case studies
- Internship program
- Contact
- Privacy, terms, and payment/refund policy
- Public document verification

Portal:
- Applicant authentication and application
- Application review and status
- Fee/payment tracking
- Onboarding and cohort details
- Project brief, milestones, submissions, and feedback
- Completion decision
- Certificate and LOR approval/issuance
- Student dashboard
- Reviewer and admin dashboards

## Required business safeguards
- Publish the total fee, inclusions, eligibility, schedule, workload, refund terms, completion requirements, certificate policy, and LOR policy before taking payment.
- If an LOR is promised to every qualifying completer, the workflow must fulfil that promise; if conditional, disclose clear criteria.
- Payment success must be verified server-side.
- A payment alone must not issue a certificate or prove program completion.
- Private files must use private Storage and explicit access policies.
- Public document verification must disclose minimal information.
- No secret/service-role keys in frontend code.
- No user may self-assign admin/reviewer roles.
- RLS and server-side authorization are mandatory.

## Task: planning only; do not implement the application
1. Inspect the current workspace, package files, existing docs, and Git status if available. Do not overwrite useful work.
2. Read `docs/PRD.md`, `docs/ARCHITECTURE.md`, and `docs/MEMORY.md` if they exist. If this bundle has not been copied into the workspace, create the `docs/` structure and place the supplied documents there before proceeding.
3. Produce:
   - `docs/PRD.md`
   - `docs/ARCHITECTURE.md`
   - `docs/MEMORY.md`
   - `docs/decisions/OPEN_DECISIONS.md`
   - `docs/decisions/SECURITY_MATRIX.md`
   - `docs/IMPLEMENTATION_PLAN.md`
4. Validate the proposed database relationships and status transitions.
5. Provide an explicit RLS/Storage policy matrix for anonymous, applicant/student, reviewer, and administrator roles.
6. List Edge Functions and define their authentication, authorization, validation, idempotency, and audit requirements.
7. Define the initial design system direction without copying another website.
8. Create a phased build plan with acceptance tests for every phase.
9. Identify all owner decisions that block production configuration.
10. Update `docs/MEMORY.md` with the actual state, files created, checks performed, blockers, and the next action.

## Restrictions
- Do not install dependencies yet.
- Do not run destructive commands.
- Do not connect or modify a production Supabase project.
- Do not deploy, change DNS, enable live payments, or issue real documents.
- Do not mark a task DONE unless you have reviewable evidence.
- Do not claim that code, security, or tests passed if they were not run.

At the end, report:
A. What you inspected.
B. Files created/changed.
C. Architecture and PRD summary.
D. Unresolved owner decisions.
E. Risks or contradictions found.
F. What should happen in Prompt 02.
G. Exact updates made to MEMORY.md.

Stop after planning and wait for approval.
