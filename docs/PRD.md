# Quiclogix Solutions — Product Requirements Document (PRD)
Version: 1.0
Status: Baseline draft for owner review

## 1. Product summary

Quiclogix Solutions features a professional corporate website and a streamlined public internship application system. The public website establishes company credibility, presents genuine services, and enables visitors to explore 19 internship domains, read and download domain-specific internship guide PDFs, complete an application form without creating an account or logging in, and receive a notification if subsequently selected.

**All website login, registration, logout, and user-authentication requirements have been eliminated. There is no student account system, reviewer portal, admin panel, or website-facing administrative dashboard.**

Application records and candidate statuses are managed privately by the project owner through the authenticated Supabase project dashboard (Table Editor / SQL / backend tools), completely decoupled from the public website.

## 2. Goals

1. Present a credible, coherent technology-company brand with modern aesthetics and responsive design.
2. Display a comprehensive, data-driven directory of 19 canonical internship domains inside the Internship tab.
3. Provide domain-specific internship guide PDFs prominently before the application inputs, with an honest "coming soon" state when guides are not yet provided.
4. Enable friction-free, account-free application submission with client and server-side validation, rate limiting, duplicate protection, and unique reference ID generation (`QLX-2026-APP-XXXXX`).
5. Ensure robust database security: RLS strictly blocks public reading of applicant records; submissions are handled securely via stored procedures.
6. Support a private backend candidate review workflow in the Supabase Table Editor.
7. Support an idempotent, server-side selection workflow (Supabase Edge Function) that generates personalized offer letters and sends notifications upon manual selection by the owner.

## 3. Non-goals

- No website-facing login, registration, password reset, or authentication popups.
- No public student accounts, applicant portals, or reviewer dashboards.
- No public admin panel on the website.
- No automatic selection upon application submission.
- No fee collection or payment processing on the public website.
- No fabricated internship terms, fake stipends, fake placement guarantees, or placeholder PDFs.

## 4. Target users

### Public visitor
Wants to understand company services, work, credibility, and contact options.

### Applicant
Wants to understand eligibility, fee, duration, deliverables, refund terms, and application status.

### Participant/student
Wants onboarding details, project requirements, submission status, feedback, and access to issued documents.

### Reviewer/mentor
Needs access to assigned participants and submissions, a rubric, feedback tools, and a way to record decisions.

### Administrator
Manages domains, cohorts, applications, fees, capacity, participants, mentors, submissions, evaluations, payments, documents, and support issues.

## 5. Information architecture

Public:
- Home
- About
- Services
- Projects/Case Studies
- Internship Program
- Contact
- FAQs
- Privacy Policy
- Terms
- Payment/Refund Policy
- Public Certificate Verification

Authenticated:
- Sign up / sign in / password recovery
- Applicant profile and application
- Payment status and receipt
- Student dashboard
- Onboarding and internship details
- Project brief and submission
- Evaluation and feedback
- Certificate/LOR access

Admin/reviewer:
- Overview
- Application queue
- Application detail and decision
- Domains and cohorts
- Payments and reconciliation
- Participants and assignments
- Project briefs and submissions
- Evaluations
- Document approval/issuance/revocation
- Notifications
- Audit history
- Program configuration

## 6. Public website requirements

### Home
- Clear company positioning and primary call to action.
- Actual service overview.
- Real projects/case studies only.
- Clear path to internship program and business contact.
- Responsive layout and purposeful motion.
- No fake metrics, testimonials, awards, client logos, or invented history.

### About
- Publish only company facts supplied/approved by owner.
- Describe working approach and team only where accurate.

### Services
- Each service states problem, deliverables, and intended audience.
- Do not list services the company cannot provide.

### Projects
- Each case study identifies project context, contribution, stack, and outcomes.
- Label demos, student projects, and concept projects honestly.

### Internship Program (Updated 2026-10-16)
The Internship tab is the central discovery directory and application entry point. It must publish all 19 owner-approved domains:
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

Key Requirements:
- Each domain displays a clear title, concise technical description, and an "Apply Now" action.
- No separate public internship-registration page or duplicate domain directory.
- No public fee or refund policy content (per owner direction).
- No invented promises, guarantees, cohort schedules, or program outcomes.

## 7. Internship requirements & Application Flow

### Application User Journey:
1. **Public Discovery**: Visitors explore all public website pages and browse the 19 domains on the Internship tab without logging in.
2. **Domain Selection & Apply**: Visitor selects a domain and clicks "Apply Now".
3. **Authentication Redirection**: If unauthenticated, visitor is redirected to authentication (`#auth?redirect=apply&domain=<slug>`) while preserving their chosen domain.
4. **Seamless Resume**: Upon successful sign-in, registration, or demo login, the student is returned immediately to the application form (`#apply?domain=<slug>`) with their chosen domain preselected.
5. **Form Completion**: Authenticated students complete the form:
   - Full name (prefilled from profile).
   - Email (read-only from authenticated account).
   - Phone number (prefilled from profile, optional/contact).
   - Course or degree (e.g. B.Tech, B.E., B.Sc, BCA, etc.).
   - Branch / specialization (strictly required for engineering students; conditionally optional for other courses).
   - College or institution name (required).
   - Selected internship domain (authoritative dropdown of 19 domains).
   - Current study year or graduation year.
   - Skills, portfolio, or GitHub URL.
   - Resume upload (PDF $\le 5$MB, uploaded to private `resumes` bucket).
   - Statutory declarations and policy consent.
6. **Draft Saving & Resumption**: Students can save a draft at any stage without losing data, and resume later.
7. **Final Submission & Immutability**: Submission triggers a permanent confirmation, changes status to `submitted`, locks the form into read-only mode, and prevents client-side tampering.
8. **Duplicate Application Prevention**: The database and client strictly prevent duplicate active applications for the same student and domain. If an active application already exists, the student is notified and shown their status.
9. **Dashboard Tracking**: Students can log in anytime to review application status (`draft`, `submitted`, `under_review`, `accepted`, `rejected`) and any released decisions.

### Review (Phase 4 — Paused)
- Admin and reviewer evaluation dashboards are temporarily paused pending owner review of the student-facing discovery and application journey.
- Database authorization ensures students can only read and update their own drafts.

### Fee/payment (Postponed per Owner Decision O-02 / O-03)
- No payment processing or fees are displayed or executed in this phase.
- Amount comes from authoritative cohort configuration, not client input.
- Payment is verified server-side through signed webhooks and/or trusted provider verification.
- Duplicate webhook events are idempotent.
- Failed/cancelled/refunded statuses are represented accurately.
- Never claim enrollment or payment success from a browser redirect alone.

### Onboarding
- Accepted and payment-confirmed participant receives confirmed dates, domain, mentor/contact, project brief, milestones, support route, and submission requirements.
- Enrollment rules must be explicitly defined; do not infer acceptance from payment alone.

### Project submission
- Participant can submit allowed repository/demo URLs and required reports.
- Private file uploads use private Storage and validation.
- Submission timestamps and versions are preserved.
- Reviewer can request revision with reason and deadline if policy allows.

### Evaluation
- Use a published rubric covering agreed dimensions such as requirement completion, functionality, code quality, documentation, and originality.
- Reviewer records feedback and decision.
- Student sees released feedback.
- Completion decision is distinct from payment status.

### Certificate
- Issued only after the published completion criteria are satisfied.
- Generated from verified records and approved template.
- Unique verification ID.
- Stored privately; authenticated participant download.
- Public verification reveals minimum necessary information.
- Issuance/revocation is auditable and duplicate-safe.

### LOR
- Policy must be published before payment.
- If guaranteed to all successful completers, the workflow must fulfil that promise.
- If conditional, criteria must be explicit and consistently applied.
- Content must be truthful, based on evidence, and approved by an authorized signatory.
- Private access by default; no public LOR download.

## 8. Admin requirements

Admin must be able to:
- Create/edit domains and cohorts.
- Configure dates, capacity, fee, eligibility and terms version.
- Review and decide applications.
- Reconcile payment statuses.
- Assign mentors and project briefs.
- Track active participants and deadlines.
- Review submissions and release feedback.
- Decide completion.
- Approve, issue, and where justified revoke documents.
- Review audit history and basic operational counts.
- Search/filter records without exposing unnecessary personal data.

Sensitive actions should require confirmation and server-side authorization. Consider stronger authentication/MFA for administrators before launch.

## 9. Functional acceptance criteria

1. A visitor can browse all published public pages on desktop and mobile.
2. An eligible applicant can submit a valid application and receive a reference.
3. Applicant A cannot read or modify Applicant B's private application.
4. A student cannot change their own application decision, fee, payment status, role, evaluation, completion, or document issuance.
5. An admin can review an application and the applicant sees the correct status.
6. Payment is marked paid only after trusted provider verification.
7. Duplicate payment events do not create duplicate payment records or enrollments.
8. A participant can submit a project and see status/feedback.
9. An unauthorized reviewer cannot access unassigned submissions.
10. A completion certificate cannot be issued without an authorized completion decision.
11. Duplicate issuance requests do not generate duplicate official records.
12. Public verification reveals only approved minimal data.
13. Private Storage files cannot be accessed by unrelated users.
14. LOR issuance follows the published policy and requires the required approval.
15. Loading, empty, failure, retry, and success states exist for key workflows.
16. All privileged actions create appropriate audit records.

## 10. Non-functional requirements

- Security: RLS, Storage policies, trusted privileged functions, secrets hygiene, validation, rate limits.
- Privacy: data minimization, consent, retention/deletion policy, clear privacy notice.
- Accessibility: semantic HTML, keyboard operation, visible focus, contrast, reduced motion.
- Performance: responsive images, limited JS, lazy loading, avoid unnecessary heavy effects.
- Reliability: idempotent payment/document operations, error handling, reconciliation.
- Maintainability: TypeScript, migrations, reusable components, lint/format, typed database access.
- SEO: page metadata, sitemap, canonical URLs, indexation controls, real content.
- Observability: actionable logs without secrets or unnecessary personal information.
- Recovery: backup and restore procedure tested before production.

## 11. Analytics and success measures

Do not fabricate targets or display metrics before there is data. Track privately, where appropriate:
- application starts and completed applications
- application decision time
- payment success/failure and reconciliation exceptions
- onboarding completion
- project submission rate
- review turnaround time
- document fulfillment turnaround time
- support requests and complaints
- site performance and form errors

Set numerical targets only after the initial baseline is measured.

## 12. Risks and mitigations

- Generic visual design: require a design system, real content, reference screenshots, and human review.
- Misleading program claims: approve terms and publish exact deliverables/conditions before accepting payment.
- Unauthorized data access: RLS/Storage policies and role-based tests.
- False payment status: signed webhook/server verification and idempotency.
- Missed promised documents: track due dates, issuance queue, failed delivery, and reconciliation.
- LOR overpromising: define a truthful policy and operational capacity.
- Fake project proof: clearly label demo/student work.
- Scope creep: defer LMS, advanced analytics, and nonessential integrations until core workflow passes.
- Incorrect legal classification: review the actual program model and applicable Indian law before launch.

## 13. Release gates

Do not launch live payments until:
- program fee, inclusions, taxes where applicable, and refund policy are approved;
- payment provider and webhook are configured and sandbox-tested;
- privacy, terms, and internship policies are reviewed;
- RLS and Storage access tests pass;
- certificate and LOR policies are operationally deliverable;
- owner approves domain, company details, and production deployment;
- backup/recovery and support ownership are documented.

## 14. Open decisions

- Official domain and ownership verification
- Company legal details and approved public copy
- Final services, genuine project examples, team details
- Program fee, tax handling, refund/withdrawal terms
- Payment provider
- Cohort dates/capacity and eligibility
- Mentoring model and assessment rubric
- Certificate/LOR policy and signatory
- Email provider and sender domain
- Hosting and monitoring provider
- Retention/deletion policy and applicable legal review
