# Security Matrix — Quiclogix Solutions

Version: 1.0
Status: Proposed — requires validation during Phase 2 implementation
Last updated: 2026-10-13

## 1. Role Definitions

| Role | Auth State | How Assigned | Description |
|------|-----------|--------------|-------------|
| `anonymous` | Not authenticated | Default | Public website visitor |
| `applicant` | Authenticated | On sign-up (default role) | Has submitted or is preparing an application |
| `student` | Authenticated | Admin promotes after acceptance + payment verification | Active or completed program participant |
| `reviewer` | Authenticated | Admin assigns via `user_roles` | Mentor/evaluator for assigned participants |
| `admin` | Authenticated | Seeded or promoted by existing admin via Edge Function | Full platform management |
| `service_role` | Server-side only | Supabase project key | Never exposed to client; used by Edge Functions |

**Role escalation prevention**: `user_roles` table has no INSERT/UPDATE policy for non-admin users. Role changes require an Edge Function that validates the caller is admin, writes the role, and logs an audit event.

---

## 2. RLS Policy Matrix — Database Tables

Legend:
- ✅ = Allowed
- ❌ = Denied
- 🔒 = Own rows only (filtered by `auth.uid()`)
- 📋 = Assigned rows only (filtered by assignment relationship)
- 🛡️ = Via Edge Function only (service_role, not direct RLS)

### Identity and Access

| Table | Operation | Anonymous | Applicant/Student | Reviewer | Admin |
|-------|-----------|-----------|-------------------|----------|-------|
| `profiles` | SELECT | ❌ | 🔒 own profile | 📋 assigned participants' name only | ✅ |
| `profiles` | INSERT | ❌ | 🔒 own profile (on sign-up) | ❌ | ✅ |
| `profiles` | UPDATE | ❌ | 🔒 own name/phone only | ❌ | ✅ |
| `profiles` | DELETE | ❌ | ❌ | ❌ | 🛡️ |
| `user_roles` | SELECT | ❌ | 🔒 own roles | 🔒 own roles | ✅ |
| `user_roles` | INSERT | ❌ | ❌ | ❌ | 🛡️ |
| `user_roles` | UPDATE | ❌ | ❌ | ❌ | 🛡️ |
| `user_roles` | DELETE | ❌ | ❌ | ❌ | 🛡️ |
| `reviewer_assignments` | SELECT | ❌ | ❌ | 🔒 own assignments | ✅ |
| `reviewer_assignments` | INSERT/UPDATE/DELETE | ❌ | ❌ | ❌ | 🛡️ |

### Program Configuration

| Table | Operation | Anonymous | Applicant/Student | Reviewer | Admin |
|-------|-----------|-----------|-------------------|----------|-------|
| `internship_domains` | SELECT | ✅ where `is_active = true` | ✅ where `is_active = true` | ✅ | ✅ |
| `internship_domains` | INSERT/UPDATE/DELETE | ❌ | ❌ | ❌ | ✅ |
| `cohorts` | SELECT | ✅ where `status = 'published'` | ✅ where `status = 'published'` | ✅ published + assigned | ✅ |
| `cohorts` | INSERT/UPDATE/DELETE | ❌ | ❌ | ❌ | ✅ |
| `project_briefs` | SELECT | ❌ | 🔒 assigned brief only | 📋 assigned briefs | ✅ |
| `project_briefs` | INSERT/UPDATE/DELETE | ❌ | ❌ | ❌ | ✅ |

### Applications and Payments

| Table | Operation | Anonymous | Applicant/Student | Reviewer | Admin |
|-------|-----------|-----------|-------------------|----------|-------|
| `applications` | SELECT | ❌ | 🔒 own applications | 📋 assigned applications | ✅ |
| `applications` | INSERT | ❌ | 🔒 own, status must be `draft` | ❌ | ✅ |
| `applications` | UPDATE | ❌ | 🔒 own, only `draft` → `submitted` | ❌ status changes via EF | ✅ via EF for decisions |
| `applications` | DELETE | ❌ | ❌ | ❌ | 🛡️ |
| `application_details` | SELECT | ❌ | 🔒 own | 📋 assigned | ✅ |
| `application_details` | INSERT | ❌ | 🔒 own | ❌ | ✅ |
| `application_details` | UPDATE | ❌ | 🔒 own, only while status is `draft` | ❌ | ✅ |
| `application_details` | DELETE | ❌ | ❌ | ❌ | 🛡️ |
| `payments` | SELECT | ❌ | 🔒 own payments | ❌ | ✅ |
| `payments` | INSERT | ❌ | ❌ | ❌ | 🛡️ (Edge Function creates) |
| `payments` | UPDATE | ❌ | ❌ | ❌ | 🛡️ (webhook/EF updates) |
| `payments` | DELETE | ❌ | ❌ | ❌ | ❌ |
| `payment_events` | SELECT | ❌ | ❌ | ❌ | ✅ |
| `payment_events` | INSERT | ❌ | ❌ | ❌ | 🛡️ (webhook handler only) |
| `payment_events` | UPDATE/DELETE | ❌ | ❌ | ❌ | ❌ |

### Internship and Project Work

| Table | Operation | Anonymous | Applicant/Student | Reviewer | Admin |
|-------|-----------|-----------|-------------------|----------|-------|
| `internships` | SELECT | ❌ | 🔒 own internship | 📋 assigned | ✅ |
| `internships` | INSERT/UPDATE | ❌ | ❌ | ❌ | 🛡️ |
| `internships` | DELETE | ❌ | ❌ | ❌ | ❌ |
| `project_assignments` | SELECT | ❌ | 🔒 own assignment | 📋 assigned | ✅ |
| `project_assignments` | INSERT/UPDATE/DELETE | ❌ | ❌ | ❌ | 🛡️ |
| `project_submissions` | SELECT | ❌ | 🔒 own submissions | 📋 assigned submissions | ✅ |
| `project_submissions` | INSERT | ❌ | 🔒 own, for own assignment | ❌ | ✅ |
| `project_submissions` | UPDATE | ❌ | 🔒 own, only while `draft` or `revision_required` | ❌ | 🛡️ |
| `project_submissions` | DELETE | ❌ | ❌ | ❌ | ❌ |
| `evaluations` | SELECT | ❌ | 🔒 own, only where `released_at IS NOT NULL` | 📋 own evaluations + assigned | ✅ |
| `evaluations` | INSERT | ❌ | ❌ | 📋 for assigned submissions | 🛡️ |
| `evaluations` | UPDATE | ❌ | ❌ | 📋 own, before release | 🛡️ |
| `evaluations` | DELETE | ❌ | ❌ | ❌ | ❌ |
| `submission_revisions` | SELECT | ❌ | 🔒 own submission's revisions | 📋 assigned | ✅ |
| `submission_revisions` | INSERT | ❌ | ❌ | 📋 for assigned submissions | ✅ |
| `submission_revisions` | UPDATE/DELETE | ❌ | ❌ | ❌ | 🛡️ |

### Documents and Communications

| Table | Operation | Anonymous | Applicant/Student | Reviewer | Admin |
|-------|-----------|-----------|-------------------|----------|-------|
| `issued_documents` | SELECT | ❌ | 🔒 own documents | ❌ | ✅ |
| `issued_documents` | INSERT/UPDATE | ❌ | ❌ | ❌ | 🛡️ |
| `issued_documents` | DELETE | ❌ | ❌ | ❌ | ❌ |
| `notifications` | SELECT | ❌ | 🔒 own notifications | 🔒 own notifications | 🔒 own notifications |
| `notifications` | INSERT | ❌ | ❌ | ❌ | 🛡️ |
| `notifications` | UPDATE | ❌ | 🔒 own `read_at` only | 🔒 own `read_at` only | 🔒 own `read_at` only |
| `notifications` | DELETE | ❌ | ❌ | ❌ | 🛡️ |
| `audit_logs` | SELECT | ❌ | ❌ | ❌ | ✅ |
| `audit_logs` | INSERT | ❌ | ❌ | ❌ | 🛡️ (system-generated) |
| `audit_logs` | UPDATE/DELETE | ❌ | ❌ | ❌ | ❌ (append-only) |

---

## 3. Storage Policy Matrix

All buckets use **private** access by default. No public buckets.

| Bucket | Upload | Download | Delete | Notes |
|--------|--------|----------|--------|-------|
| `resumes` | Applicant: own file, validated (PDF, ≤5MB) | Applicant: own file; Admin: any; Reviewer: assigned | Admin only via EF | Path: `{user_id}/{application_id}/resume.*` |
| `project-reports` | Student: own file, validated (PDF, ≤20MB) | Student: own file; Reviewer: assigned; Admin: any | Admin only via EF | Path: `{user_id}/{internship_id}/report.*` |
| `certificates` | None (EF generates) | Student: own; Admin: any | None (revocation marks status, doesn't delete) | Path: `certificates/{internship_id}/{verification_id}.pdf` |
| `lors` | None (EF generates) | Student: own; Admin: any | None | Path: `lors/{internship_id}/{verification_id}.pdf` |

**Upload validation rules** (enforced server-side):
- MIME type whitelist: `application/pdf` for documents; extend as needed
- Max file size per bucket (configurable)
- File name sanitization
- Consider virus scanning integration before production

**Signed URL policy**:
- All private file access uses short-lived signed URLs (≤15 minutes)
- Signed URL generation requires authenticated request + ownership/assignment check
- No direct Storage URL exposure to clients

---

## 4. Public Verification Endpoint

The public certificate verification endpoint (`/verify/:verificationId`) must:

| Concern | Policy |
|---------|--------|
| Authentication | None required (public) |
| Rate limiting | Aggressive — max 10 requests/minute per IP |
| Input validation | UUID format validation on `verificationId` |
| Response (valid) | `{ valid: true, name, program, domain, completionDate, status }` |
| Response (not found) | `{ valid: false }` — no information leakage |
| Never reveals | Email, phone, payment details, file paths, internal IDs, resume, evaluation scores, LOR existence |
| Caching | Short cache (1–5 min) to prevent enumeration abuse |
| Logging | Log lookups without PII; alert on anomalous patterns |

---

## 5. Edge Function Security Requirements

| Function | Auth | Authorization | Validation | Idempotency | Audit |
|----------|------|---------------|------------|-------------|-------|
| `create-payment-order` | JWT required | Caller owns accepted application; cohort open; fee from DB | Amount, currency, application_id | Reuse existing pending order for same application | Log order creation |
| `verify-payment` | Webhook signature | Provider signature validation | Event schema, amount match | `unique(provider, provider_event_id)` prevents duplicates | Log verification result |
| `decide-application` | JWT required | Admin role verified | Valid status transition, decision_note | Reject if already decided (unless policy allows re-review) | Log decision with actor |
| `assign-role` | JWT required | Admin role verified; target role allowed | Role enum check; no self-escalation | Upsert with unique constraint | Log role change |
| `create-internship` | JWT required | Admin role; accepted + paid application | All required fields validated | `unique(application_id)` prevents duplicates | Log enrollment |
| `submit-evaluation` | JWT required | Reviewer assigned to submission | Rubric dimensions complete; valid decision | One evaluation per submission (or versioned) | Log evaluation |
| `issue-document` | JWT required | Admin role; completion criteria met | Document type, template version, verification_id generation | `unique(internship_id, document_type)` | Log issuance |
| `revoke-document` | JWT required | Admin role | Reason required; valid document exists | Status check before revoke | Log revocation with reason |
| `verify-certificate` | None (public) | None | UUID format; rate limited | N/A (read-only) | Log lookup (no PII) |
| `send-notification` | Internal only | Service role | Template + recipient validation | Dedup by (user, type, entity_id, window) | Log send attempt |
| `generate-signed-url` | JWT required | Ownership or assignment check | Bucket, path, access level | N/A (ephemeral) | Optional log |

---

## 6. State Transition Authorization

### Application Status

```
draft ──[applicant]──▶ submitted ──[admin]──▶ under_review ──[admin]──▶ accepted
                                                            ──[admin]──▶ rejected
                                              ──[applicant]──▶ withdrawn (if allowed)
```

- Only the applicant can transition `draft → submitted`
- Only admin can transition to `under_review`, `accepted`, `rejected`
- `withdrawn` is applicant-initiated; only allowed from specific states per policy (owner decision P-03)
- No backward transitions except revision scenarios defined by policy

### Payment Status

```
pending ──[webhook/EF]──▶ paid
        ──[webhook/EF]──▶ failed
        ──[webhook/EF]──▶ cancelled
paid    ──[admin+EF]──▶ refunded
```

- **No client-side transition is ever trusted**
- Only Edge Functions with verified webhook signatures can change payment status
- Refund requires admin action through Edge Function

### Internship Status

```
scheduled ──[system]──▶ active ──[student submit]──▶ submitted
                                                    ──[reviewer]──▶ under_evaluation
                                                    ──[reviewer]──▶ completed
                               ──[admin]──▶ withdrawn
                               ──[admin]──▶ incomplete
```

- `scheduled → active`: triggered by start date or admin action
- `submitted`: student has submitted final project
- `completed`: requires evaluation decision, not payment alone
- `withdrawn` / `incomplete`: admin-only with audit

### Document Status

```
pending ──[admin]──▶ approved ──[EF]──▶ issued ──[admin+EF]──▶ revoked
```

- `approved`: admin confirms completion criteria are met
- `issued`: Edge Function generates PDF, assigns verification_id, stores file
- `revoked`: admin-initiated with mandatory reason; audit logged
- A payment alone NEVER triggers `approved` or `issued`

---

## 7. Frontend Security Boundaries

| Concern | Implementation |
|---------|---------------|
| No secrets in bundle | `.env` only contains `SUPABASE_URL` and `SUPABASE_ANON_KEY`; all secrets in Edge Function env |
| Route guards | UX convenience only — never the sole authorization check |
| Role display | Fetched from `user_roles` RLS-filtered query; not from JWT claims alone (JWT claims can be stale) |
| File uploads | Client sends file to Storage with policy-enforced path; server validates |
| Payment initiation | Client receives order from Edge Function; never constructs payment params locally |
| Form submissions | Client-side validation for UX; server-side validation is authoritative |

---

## 8. Audit Log Requirements

Every privileged action must produce an `audit_logs` entry:

| Action Category | Events |
|----------------|--------|
| Role management | `role.assigned`, `role.removed` |
| Application decisions | `application.submitted`, `application.reviewed`, `application.accepted`, `application.rejected`, `application.withdrawn` |
| Payment | `payment.order_created`, `payment.verified`, `payment.failed`, `payment.refunded` |
| Internship | `internship.created`, `internship.status_changed` |
| Evaluation | `evaluation.submitted`, `evaluation.released`, `evaluation.updated` |
| Documents | `document.approved`, `document.issued`, `document.revoked`, `document.downloaded` |
| Admin config | `cohort.created`, `cohort.updated`, `domain.created`, `domain.updated`, `brief.created`, `brief.updated` |

Fields per entry: `id`, `actor_id`, `action`, `entity_type`, `entity_id`, `metadata_json` (relevant context without secrets/PII), `created_at`.

The `audit_logs` table is **append-only**: no UPDATE or DELETE for any role.
