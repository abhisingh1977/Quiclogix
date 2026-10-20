# Quiclogix Solutions — Technical Architecture
Version: 1.0
Status: Proposed baseline — owner decisions still required

## 1. Product boundaries

Quiclogix Solutions consists of two connected products:
1. Public corporate website: company positioning, genuine services, projects/case studies, internship information, contact, legal pages.
2. Internship operations platform: applications, review, fee/payment tracking, onboarding, project assignments, submissions, evaluation, completion documents, notifications, and administration.

The public website must remain useful even if the portal is unavailable. Do not represent placeholder content, fake clients, metrics, testimonials, or project results as real.

## 2. Recommended technology

- Frontend: React + Vite + TypeScript
- Styling: Tailwind CSS, with reusable design tokens and components
- Animation: choose one primary animation system (GSAP + ScrollTrigger for complex scroll choreography OR Framer Motion for component/UI transitions). Add Three.js only if reference evidence justifies real-time 3D.
- Backend platform: Supabase
  - PostgreSQL
  - Auth
  - Storage
  - Edge Functions
  - Database migrations
- Validation: shared TypeScript schemas plus server-side validation for privileged operations
- Testing: unit/component tests, database/RLS tests, end-to-end browser tests
- Deployment: static frontend host plus Supabase project; production provider to be selected
- Payment gateway: undecided; Razorpay/Cashfree are candidates, not yet selected
- Email provider: undecided; select only after sender-domain setup and delivery testing

## 3. Logical architecture

Public Browser (100% Unauthenticated)
  ├── Public Corporate Pages (Home, About, Services, Projects, Contact, Legal)
  ├── 19 Internship Domain Directory (#internship)
  └── Dedicated Domain Application Flow (#apply?domain=...)
          ├── "Read Your Internship Guide Before Applying" (PDF download/preview or coming-soon)
          ├── Form Validation & PDF Resume Upload
          └── submit_public_application RPC Call
                  |
                  v
PostgreSQL + Row-Level Security (RLS)
  ├── public.internship_domains (canonical 19 domains)
  ├── public.internship_applications (strict RLS: anonymous SELECT denied)
  │     ├── Written only via SECURITY DEFINER stored procedure
  │     ├── Server-side validation, duplicate protection (24h cooldown), QLX reference ID
  │     └── Status lifecycle: submitted -> under_review -> selected / not_selected
  └── public.application_email_logs (audit log for selection & offer letters)

Private Supabase Storage
  └── resumes/ (anonymous upload permitted; public reads strictly denied)

Private Backend Management (Project Owner Only)
  └── Supabase Project Dashboard -> Table Editor
        ├── Filter, search, and inspect submitted student records
        └── Update application status to 'selected'

Supabase Edge Functions / Backend Automation
  └── handle-selection
        ├── Validates status = 'selected'
        ├── Generates personalized HTML offer letter
        ├── Idempotent dispatch via Resend / SMTP (checks selection_email_status != 'sent')
        └── Logs delivery result in application_email_logs

No privileged key may be included in browser bundles. Browser-side forms submit via the Supabase client using the public anon key to the SECURITY DEFINER RPC.

## 4. Application roles & access model

- Public Anonymous Visitor:
  - Can read public website pages and domain catalog.
  - Can download available domain internship guide PDFs.
  - Can submit a single application per domain per email per 24 hours.
  - Cannot read, query, or enumerate applications or applicant PII.
- Project Owner (Private Backend):
  - Authenticates securely via Supabase Dashboard (supabase.com / local studio).
  - Inspects records, manages cohort selection, and reviews uploaded resumes.
  - No client-facing admin panel or reviewer portal exists in the website codebase.
- Service Role (Server-side Edge Functions):
  - Generates offer letters and executes transactional email delivery.

## 5. Suggested repository structure

quiclogix/
  public/
  src/
    app/
    components/
      ui/
      layout/
      motion/
    features/
      applications/
      payments/
      internships/
      submissions/
      evaluations/
      documents/
      notifications/
    pages/
      public/
      applicant/
      student/
      reviewer/
      admin/
    lib/
      supabase/
      validation/
      formatting/
    hooks/
    styles/
    types/
  supabase/
    migrations/
    functions/
    seed.sql
    config.toml
  tests/
    unit/
    integration/
    e2e/
  docs/
    PRD.md
    ARCHITECTURE.md
    MEMORY.md
    decisions/
  .env.example
  README.md

Use feature-oriented modules; avoid one giant component and avoid duplicating business rules across pages.

## 6. Proposed relational schema

### Identity and access
- profiles: id (references auth.users), full_name, phone (optional), created_at, updated_at
- user_roles: user_id, role, created_at, granted_by; unique(user_id, role)
- reviewer_assignments: reviewer_id, internship_id or cohort_id, created_at

### Program configuration
- internship_domains: id, slug, name, description, eligibility, is_active, sort_order
- cohorts: id, name, start_date, end_date, application_deadline, capacity, fee_minor_units, currency, status, terms_version
- project_briefs: id, domain_id, title, description, requirements, rubric_json, version, is_active

### Applications and payments
- applications: id, applicant_id, cohort_id, domain_id, status, submitted_at, reviewed_by, reviewed_at, decision_note, created_at, updated_at
- application_details: application_id, education_or_experience, skills, portfolio_url, resume_path, consent_version, created_at, updated_at
- payments: id, application_id, provider, provider_order_id, provider_payment_id, amount_minor_units, currency, status, verified_at, refunded_at, created_at
- payment_events: id, provider, provider_event_id, payment_id, event_type, processed_at; unique(provider, provider_event_id)

### Internship and project work
- internships: id, application_id (unique), cohort_id, domain_id, mentor_id, start_date, end_date, status, created_at, updated_at
- project_assignments: id, internship_id, project_brief_id, assigned_by, assigned_at, due_at
- project_submissions: id, assignment_id, repository_url, demo_url, report_path, notes, status, submitted_at, created_at, updated_at
- evaluations: id, submission_id, reviewer_id, rubric_scores_json, overall_score (optional), feedback, decision, released_at, created_at
- submission_revisions: id, submission_id, requested_by, reason, due_at, resolved_at, created_at

### Documents and communications
- issued_documents: id, internship_id, document_type, verification_id, file_path, status, issued_by, approved_by, issued_at, revoked_at, revocation_reason, template_version; unique(verification_id)
- notifications: id, user_id, type, title, body, read_at, created_at
- audit_logs: id, actor_id, action, entity_type, entity_id, metadata_json, created_at

Schema notes:
- Use UUID primary keys and foreign keys.
- Use constraints/enums or controlled check constraints for statuses.
- Store money as integer minor units and currency code; never use floating-point money.
- Keep document files in private Storage and metadata in issued_documents.
- Store minimal personal data. Define retention/deletion policy before launch.
- Do not store card data.
- Add indexes for ownership, status, cohort, and common admin filters.
- Decide if phone, resume, or education fields are truly required before collecting them.

## 7. State machines

Application:
draft -> submitted -> under_review -> accepted | rejected
Allow withdrawn where policy supports it. Only trusted roles may perform decisions.

Payment:
pending -> paid | failed | cancelled
paid -> refunded (full or partial only if modeled explicitly)
Payment is confirmed by trusted provider verification/webhook, not a client redirect.

Internship:
scheduled -> active -> submitted -> under_evaluation -> completed
Additional states: withdrawn, incomplete, on_hold, if needed by published policy.

Submission:
draft -> submitted -> under_review -> revision_required | approved
After revision: revision_required -> submitted. Keep prior submission/review history.

Document:
pending -> approved -> issued -> revoked
Document issuance must be authorized, auditable, and idempotent. A successful payment alone must never trigger a certificate.

## 8. Security model

- Enable RLS on every table exposed through the Supabase Data API.
- Public reads are limited to published domains/cohorts and minimal verification results.
- Applicants can only read/update permitted fields on their own application; do not allow them to update status, reviewer fields, fee, payment state, completion, roles, or document status.
- Student data and Storage paths must be ownership-scoped.
- Reviewers see only assigned work.
- Admin actions must check role in a trusted context and write audit records.
- Do not rely on frontend route guards for authorization.
- Use private buckets for resumes, reports, and official documents.
- Use short-lived signed URLs after access authorization.
- Validate MIME type, file size, and allowed extensions; consider malware scanning for uploads.
- Edge Functions must authenticate callers, authorize the action, validate payloads, rate-limit sensitive public endpoints, and avoid leaking internal errors.
- Keep service-role/secret keys server-side and out of git.
- Never trust fee, payment success, evaluation result, or issuance state sent from the browser.
- Verify webhook signatures and make webhook handling idempotent.
- Public verification must return only minimal fields and must not expose file paths, email, phone, payment details, resumes, or reports.
- Add audit records for role changes, application decisions, payment reconciliation, evaluation decisions, document issuance/revocation, and relevant admin changes.

## 9. Payment workflow

1. Applicant submits application.
2. Server checks application/cohort eligibility and authoritative fee.
3. Trusted function creates provider order.
4. Client completes checkout through provider.
5. Signed webhook and/or trusted server verification confirms payment.
6. Persist provider IDs and event IDs; handle duplicate webhook events idempotently.
7. Mark payment paid only after verification.
8. Apply enrollment rule (accepted + verified payment + capacity/terms checks).
9. Issue receipt/status notification.
10. Refunds and disputes update through trusted reconciliation.

Do not enable live payment until provider account, refund terms, legal business details, and webhook endpoint are verified.

## 10. Document fulfillment workflow

Completion certificate:
1. Verify program completion criteria.
2. Reviewer/admin records approved completion.
3. Generate certificate from approved template and verified profile/program data.
4. Assign unique unguessable verification ID.
5. Store final PDF in private Storage.
6. Record issuance metadata and audit event.
7. Notify participant and provide authenticated download.
8. Public verification endpoint confirms status and returns minimal details.

LOR:
1. Apply the policy disclosed before payment.
2. Collect evaluation evidence and recommendation decision.
3. Generate from an approved template without invented claims.
4. Require authorized sign-off.
5. Store privately and log issuance.
6. Deliver securely.

If the public offer promises an LOR to all successful completers, the operational policy and capacity must support that promise. If conditional, disclose exact conditions before enrollment.

## 11. Non-functional requirements

- Mobile-first, accessible UI; semantic HTML, keyboard support, visible focus, adequate contrast, reduced-motion support.
- Performance: optimize images/fonts, lazy-load noncritical media, avoid unnecessary JS and 3D.
- Reliability: meaningful loading/empty/error/success states; retry-safe operations.
- Observability: structured function logs, audit records, payment reconciliation and error reporting without logging secrets or unnecessary PII.
- Maintainability: migrations, typed database types, linting, formatting, reusable components, documented environment setup.
- Privacy: collect minimum necessary data; define retention, deletion, consent and privacy notices.
- Backups and recovery: confirm Supabase plan capabilities and rehearse restore/recovery process.
- SEO: unique titles/descriptions, canonical URLs, sitemap, robots rules, social metadata, real page copy.
- Testing: unit tests, RLS tests for every role, payment webhook tests, document authorization tests, and end-to-end flows.

## 12. Unresolved decisions — do not invent

- Final domain and proof of domain ownership
- Legal company details and approved public company description
- Brand logo, color palette, font licensing and assets
- Actual service offerings and project case studies
- Program fee, currency/taxes, refund policy and payment gateway
- Cohort dates, capacity, eligibility and selection criteria
- Mentoring model and exact project expectations
- Certificate and LOR criteria and authorized signatory
- Email provider and sender domain
- Hosting and production environment
- Privacy/terms reviewed for the actual operating model

## 13. Release gates

No production launch until:
- RLS/Storage tests pass for anonymous, student, reviewer and admin users.
- Payment success/failure/duplicate-webhook/refund flows are tested in sandbox.
- No client can self-assign admin, approve their application, change fees, fake payment, mark completion, or issue documents.
- Certificate and LOR delivery has been tested end-to-end.
- Privacy, terms, fee, refund, and program policies are published and approved.
- Production secrets and DNS are configured with owner approval.
- Backup/recovery, error handling and operational ownership are documented.
