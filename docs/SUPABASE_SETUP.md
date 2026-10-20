# Supabase Foundation & Security Documentation — Quiclogix Solutions

Version: 1.0  
Status: Local Foundation Implemented (Awaiting Owner Review & Production Project Approval)  
Last Updated: 2026-10-16  

---

## 1. Overview & Architecture Summary

This document specifies the PostgreSQL relational schema, security architecture, Row Level Security (RLS) policies, and Supabase integration for **Quiclogix Solutions**.

In adherence to the project's security constraints:
- **No live remote Supabase resources have been provisioned or altered.** All migrations, seeds, and security policies are local and version-controlled.
- **Client code never possesses or references privileged secrets** (`SUPABASE_SERVICE_ROLE_KEY` is strictly excluded from frontend builds).
- **Client role self-assignment is impossible.** The `user_roles` table permits no client-side `INSERT` or `UPDATE` operations.
- **Financial, evaluation, and document issuance state transitions remain server-side.** Clients cannot alter payment status, review decisions, or issuance state.
- **Public credential verification is strictly scoped** via a dedicated `SECURITY DEFINER` RPC function that returns minimal non-PII verification data and never exposes private storage paths or personally identifiable contact details.

---

## 2. Role Model & Access Control

The platform enforces four explicit user roles via the `public.user_roles` table:

| Role | Auth Status | Granting Mechanism | Capabilities |
| :--- | :--- | :--- | :--- |
| **`applicant`** | Authenticated | Default role on sign-up via `handle_new_user()` trigger | Can create and update draft applications; upload own resume to private storage; view own payments and notifications. |
| **`student`** | Authenticated | Promoted by administrator after application acceptance and verified payment | Can view assigned project briefs; submit project work and reports; view released evaluation feedback; view and download issued certificates. |
| **`reviewer`** | Authenticated | Assigned by administrator to specific cohorts or internships via `reviewer_assignments` | Can inspect assigned applications; inspect assigned student submissions; create draft evaluations and request submission revisions. |
| **`admin`** | Authenticated | Granted server-side by trusted initialization or administrative Edge Function | Full management of cohorts, project briefs, applications, evaluations, payments, and document issuance. |
| **`service_role`**| Server-side only | Used exclusively in trusted Edge Functions and webhooks | Bypasses RLS for secure operations (payment webhook processing, PDF document generation, role management). |

### Privilege Escalation Prevention
- The `user_roles` table enables RLS with only two policies:
  1. `user_roles_select`: Authenticated users can only read their own role records (`user_id = auth.uid()`), while administrators can view all roles.
  2. `user_roles_admin_manage`: Only users with `is_admin()` can insert, update, or delete role records.
- Role checks in policies call the `has_role(user_id, role)` helper function marked `SECURITY DEFINER SET search_path = public` to avoid recursive RLS query loops.

---

## 3. Relational Schema Summary

The initial migration (`supabase/migrations/20261016000000_initial_schema_and_security.sql`) creates 18 relational tables:

### Identity & Access
1. **`profiles`**: Extends Supabase `auth.users(id)` with `full_name`, `phone`, timestamps. Automatically created upon auth signup via trigger.
2. **`user_roles`**: Authoritative role mappings (`applicant`, `student`, `reviewer`, `admin`) with `UNIQUE(user_id, role)`.
3. **`reviewer_assignments`**: Links reviewers to specific cohorts or internships.

### Program Configuration
4. **`internship_domains`**: The 4 approved engineering domains (AI Systems, Full-Stack Web, Cloud/DevOps, Data Engineering). Publicly readable when active.
5. **`cohorts`**: Program intake cycles with authoritative dates, capacity, fee minor units (placeholder pending owner decision), and status.
6. **`project_briefs`**: Real-world project briefs linked to domains, containing requirements and evaluation rubrics (`rubric_json`).

### Applications & Payments
7. **`applications`**: Intake records tracking applicant ID, cohort ID, domain ID, and status (`draft`, `submitted`, `under_review`, `accepted`, `rejected`, `withdrawn`).
8. **`application_details`**: Extended application metadata including education, skills array, portfolio URL, and private resume path.
9. **`payments`**: Authoritative financial records (`amount_minor_units`, currency, status: `pending`, `paid`, `failed`, `cancelled`, `refunded`).
10. **`payment_events`**: Webhook event log with idempotency constraint `UNIQUE(provider, provider_event_id)`.

### Internship & Project Work
11. **`internships`**: Active participant records created upon acceptance and payment confirmation, tracking student ID, assigned mentor ID, start/end dates, and status.
12. **`project_assignments`**: Assignment of specific project briefs to enrolled interns with explicit due dates.
13. **`project_submissions`**: Student submissions containing repository URL, demo URL, private report path, and notes.
14. **`evaluations`**: Reviewer assessments with rubric scores, feedback, decision (`pass`, `revision`, `fail`), and release timestamp.
15. **`submission_revisions`**: Audit trail for revision requests between reviewers and students.

### Documents & Observability
16. **`issued_documents`**: Official completion certificates and LORs with unique unguessable `verification_id`, file path, and lifecycle status (`pending`, `approved`, `issued`, `revoked`).
17. **`notifications`**: User-scoped communication alerts.
18. **`audit_logs`**: Append-only system audit log recording actor ID, action name, target entity, and sanitized metadata.

---

## 4. Row Level Security (RLS) Policy Reference

Every exposed table has Row Level Security enabled. Below is the operational policy enforcement:

| Table | SELECT | INSERT | UPDATE | DELETE |
| :--- | :--- | :--- | :--- | :--- |
| `profiles` | Own profile, assigned reviewer, or Admin | Own profile on signup or Admin | Own name/phone or Admin | Admin / Service Role only |
| `user_roles` | Own roles or Admin | Denied to clients (Admin only) | Denied to clients (Admin only) | Denied to clients (Admin only) |
| `reviewer_assignments` | Assigned reviewer or Admin | Denied to clients (Admin only) | Denied to clients (Admin only) | Denied to clients (Admin only) |
| `internship_domains` | Public (where `is_active = true`) | Admin only | Admin only | Admin only |
| `cohorts` | Public (where `status IN ('published', 'open', 'active', 'completed')`) | Admin only | Admin only | Admin only |
| `project_briefs` | Assigned students, reviewers, Admin | Admin only | Admin only | Admin only |
| `applications` | Own application, assigned reviewer, or Admin | Own application (status must be `draft`) | Own application (draft or draft → submitted) | Denied to clients |
| `application_details` | Own details, assigned reviewer, or Admin | Own details (while application is `draft`) | Own details (while application is `draft`) | Denied to clients |
| `payments` | Own payments or Admin | Denied to clients (Edge Function only) | Denied to clients (Edge Function only) | Denied |
| `payment_events` | Admin only | Webhook / Service Role only | Denied | Denied |
| `internships` | Own internship, assigned reviewer, or Admin | Admin / Service Role only | Admin / Service Role only | Denied |
| `project_assignments` | Own assignment, assigned reviewer, or Admin | Admin / Service Role only | Admin / Service Role only | Denied |
| `project_submissions` | Own submission, assigned reviewer, or Admin | Enrolled student (when internship is active) | Student (when draft or revision_required) | Denied |
| `evaluations` | Student (only when released_at IS NOT NULL), assigned reviewer, Admin | Assigned reviewer or Admin | Assigned reviewer (before release) or Admin | Denied |
| `submission_revisions` | Student, assigned reviewer, Admin | Assigned reviewer or Admin | Denied to clients | Denied |
| `issued_documents` | Student (only issued status), Admin | Denied to clients (Edge Function only) | Denied to clients (Admin only) | Denied |
| `notifications` | Own notifications | Service Role / Edge Function only | Own read status | Denied to clients |
| `audit_logs` | Admin only | System / Service Role only | Denied (Append-only) | Denied (Append-only) |

---

## 5. Storage Buckets & Policies

All buckets are configured as **private** (`public = false`):

1. **`resumes`**
   - Size limit: 5 MB.
   - Allowed MIME types: `application/pdf`.
   - Path structure: `resumes/{user_id}/{application_id}/resume.pdf`.
   - Access: Upload and read restricted to file owner (`auth.uid() = foldername[1]`), assigned reviewers, and administrators.
2. **`project-reports`**
   - Size limit: 20 MB.
   - Allowed MIME types: `application/pdf`, `application/zip`.
   - Path structure: `project-reports/{user_id}/{internship_id}/report.pdf`.
   - Access: Upload restricted to student intern; read restricted to student, assigned mentor, and administrators.
3. **`certificates` & `lors`**
   - Size limit: 10 MB.
   - Allowed MIME types: `application/pdf`.
   - Path structure: `certificates/{internship_id}/{verification_id}.pdf`.
   - Access: Direct upload restricted to server-side PDF generator (`service_role`). Students can only read documents whose `verification_id` matches their own issued document record.

---

## 6. Public Certificate Verification RPC

The public certificate verification endpoint is powered by the `verify_credential` stored procedure:

```sql
SELECT * FROM public.verify_credential('QLX-2026-CERT-XXXXX');
```

**Security Guarantees:**
- Accessible to unauthenticated callers (`anon` role).
- Returns **only**:
  - `valid` (boolean)
  - `verification_id` (text)
  - `document_type` ('certificate')
  - `student_name` (text)
  - `domain_name` (text)
  - `completion_date` (date)
  - `status` ('issued')
  - `issued_at` (timestamptz)
- **Never exposes**: Email addresses, phone numbers, raw storage file paths, internal database IDs, evaluation scores, or LOR records.

---

## 7. Local Development & Migration Instructions

### Prerequisites
- Node.js 18+
- Docker Desktop (for local Supabase instance)
- Supabase CLI (`npm install -D supabase` or via `npx supabase`)

### Starting Local Supabase
```bash
# 1. Initialize local Supabase if not already initialized
npx supabase init

# 2. Start local PostgreSQL, Auth, Storage, and Inbucket services
npx supabase start

# 3. Apply initial migration and seed data
npx supabase db reset
```

### Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from the output of `npx supabase status`.

### Running Verification Tests
To validate the migration script, RLS policies, storage privacy, and TypeScript types:
```bash
npm run test:supabase
```
To run the complete automated test suite (contrast audit + Supabase validation):
```bash
npm test
```

---

## 8. Unresolved Decision Status & Next Phase

Before proceeding to remote deployment or application portal UX:
1. **Decision O-01 (Supabase Project Approval)**: The owner must approve creating or connecting a live Supabase project. Until approved, development remains 100% local.
2. **Decision O-02 (Fee Structure & Refund Terms)**: Fee amounts remain minor-unit placeholders (0) in migrations and seed data.
3. **Decision O-03 (Payment Gateway Selection)**: Webhook endpoints and order generation will be implemented in Edge Functions after the provider is chosen.
