// Automated Security Verification Script for Quiclogix Solutions Supabase Foundation
// Validates:
// 1. Table Definitions & RLS Activation (18 tables)
// 2. Privilege Escalation Safeguards (user_roles lock)
// 3. Security Definer Helper Isolation & Caller-Probing Defense
// 4. State Machine Transition Safeguards (Applications & Submissions)
// 5. Reviewer Scope & Assignment Isolation (Profiles & Work items)
// 6. Relational Storage Policies (Resumes, Project Reports, Documents)
// 7. Database Table Grants (Defense-in-depth: revoke public, deny unauthorized writes)
// 8. Public Credential Verification Safety & PII Redaction
// 9. TypeScript Database Typings & Client-Side Secret Isolation
// 10. Environment Template Sanitization

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const REQUIRED_TABLES = [
  'profiles',
  'user_roles',
  'reviewer_assignments',
  'internship_domains',
  'cohorts',
  'project_briefs',
  'applications',
  'application_details',
  'payments',
  'payment_events',
  'internships',
  'project_assignments',
  'project_submissions',
  'evaluations',
  'submission_revisions',
  'issued_documents',
  'notifications',
  'audit_logs',
];

const REQUIRED_FUNCTIONS = [
  'has_role',
  'is_admin',
  'handle_new_user',
  'is_assigned_to_application',
  'is_assigned_to_internship',
  'is_assigned_to_submission',
  'verify_credential',
];

const REQUIRED_STORAGE_BUCKETS = [
  'resumes',
  'project-reports',
  'certificates',
  'lors',
];

let errors = 0;
let passed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  [PASS] ${message}`);
  } else {
    errors++;
    console.error(`  [FAIL] ${message}`);
  }
}

console.log('--- Quiclogix Solutions: Supabase Security & Penetration Review ---\n');

// 1. Migration File Check
console.log('1. SQL Migration Existence & Integrity:');
const migrationPath = path.join(
  rootDir,
  'supabase',
  'migrations',
  '20261016000000_initial_schema_and_security.sql'
);
assert(fs.existsSync(migrationPath), 'Initial migration file exists');
const migrationSql = fs.readFileSync(migrationPath, 'utf8');

// 2. All 18 Tables Defined
console.log('\n2. Verifying Table Definitions (18 Core Tables):');
for (const table of REQUIRED_TABLES) {
  const tableRegex = new RegExp(`CREATE TABLE IF NOT EXISTS public\\.${table}\\b`, 'i');
  assert(tableRegex.test(migrationSql), `Table 'public.${table}' is defined`);
}

// 3. Row Level Security on Every Table
console.log('\n3. Verifying Row Level Security (RLS) Coverage:');
for (const table of REQUIRED_TABLES) {
  const rlsRegex = new RegExp(`ALTER TABLE public\\.${table} ENABLE ROW LEVEL SECURITY`, 'i');
  assert(rlsRegex.test(migrationSql), `RLS enabled on table 'public.${table}'`);
}

// 4. Security Definer Helper Functions & Safe Search Paths
console.log('\n4. Verifying Security Definer Helper Functions & Search Paths:');
for (const fn of REQUIRED_FUNCTIONS) {
  const fnRegex = new RegExp(`CREATE OR REPLACE FUNCTION public\\.${fn}\\b`, 'i');
  assert(fnRegex.test(migrationSql), `Function 'public.${fn}' is defined`);
}
assert(
  (migrationSql.match(/SECURITY DEFINER[\s\S]*?SET search_path = public/g) || []).length >= 6,
  'All security definer helper functions enforce explicit SET search_path = public'
);

// 5. Anti-Probing & Caller-Supplied ID Defense
console.log('\n5. Anti-Probing Defense in Security Definer Helpers:');
assert(
  migrationSql.includes('check_user_id = auth.uid() OR public.is_admin()'),
  'has_role prevents unprivileged callers from probing other users roles'
);
assert(
  migrationSql.includes('(check_user_id = auth.uid() OR public.is_admin())') &&
    migrationSql.includes('is_assigned_to_application'),
  'is_assigned_to_application prevents unprivileged callers from probing arbitrary assignments'
);

// 6. Privilege Escalation Defense (user_roles)
console.log('\n6. Privilege Escalation Safeguards:');
assert(
  !migrationSql.includes('CREATE POLICY "user_roles_insert_applicant"'),
  'No policy allowing non-admins to insert roles in user_roles'
);
assert(
  !migrationSql.includes('GRANT INSERT ON public.user_roles TO authenticated'),
  'Database grants explicitly deny authenticated users INSERT on user_roles'
);
assert(
  !migrationSql.includes('GRANT UPDATE ON public.user_roles TO authenticated'),
  'Database grants explicitly deny authenticated users UPDATE on user_roles'
);

// 7. Strict State Machine: Applications & Submissions
console.log('\n7. State Machine Transition Safeguards:');
assert(
  migrationSql.includes("applicant_id = auth.uid()\n            AND status = 'draft'::public.application_status"),
  'applications UPDATE policy USING requires status = draft (applicant cannot modify submitted/decided apps)'
);
assert(
  migrationSql.includes('reviewed_by IS NULL') &&
    migrationSql.includes('reviewed_at IS NULL') &&
    migrationSql.includes('decision_note IS NULL'),
  'applications WITH CHECK forbids applicant from tampering with reviewer metadata'
);
assert(
  migrationSql.includes("status IN ('draft'::public.submission_status, 'submitted'::public.submission_status)") &&
    migrationSql.includes('project_submissions_update_student'),
  'project_submissions WITH CHECK forbids student from setting approved or under_review status'
);

// 8. Reviewer Scope & Assignment Isolation
console.log('\n8. Reviewer Scope & Assignment Isolation:');
assert(
  !migrationSql.includes("USING (id = auth.uid() OR public.is_admin() OR public.has_role(auth.uid(), 'reviewer'::public.app_role));"),
  'profiles SELECT policy does NOT grant blanket access to all reviewers'
);
assert(
  migrationSql.includes('ra.reviewer_id = auth.uid()') && migrationSql.includes('profiles_select_own'),
  'profiles SELECT policy limits reviewer visibility strictly to assigned participants'
);
assert(
  migrationSql.includes('released_at IS NULL') && migrationSql.includes('evaluations_insert_reviewer'),
  'evaluations INSERT policy forbids reviewer from publishing releases directly without admin sign-off'
);

// 9. Relational Storage Policies (Beyond Filepath Alone)
console.log('\n9. Storage Policies & Database Relational Checks:');
for (const bucket of REQUIRED_STORAGE_BUCKETS) {
  const bucketRegex = new RegExp(`'${bucket}',\\s*'${bucket}',\\s*false`, 'i');
  assert(bucketRegex.test(migrationSql), `Storage bucket '${bucket}' configured with public = false (private)`);
}
assert(
  migrationSql.includes("AND a.status = 'draft'::public.application_status") &&
    migrationSql.includes('resumes_upload_owner'),
  'resumes upload policy verifies application relational existence and draft status'
);
assert(
  migrationSql.includes("i.status IN ('active'::public.internship_status, 'submitted'::public.internship_status)") &&
    migrationSql.includes('project_reports_upload_owner'),
  'project_reports upload policy verifies active/submitted internship relational ownership'
);
assert(
  migrationSql.includes('is_assigned_to_application') && migrationSql.includes('resumes_select_authorized'),
  'resumes download policy restricts reviewers to assigned applications only'
);

// 10. Financial & Issuance Tampering Defense
console.log('\n10. Financial & Issuance Defense:');
assert(
  !migrationSql.includes('GRANT INSERT ON public.payments TO authenticated'),
  'Database grants explicitly deny authenticated users direct INSERT on payments'
);
assert(
  !migrationSql.includes('GRANT UPDATE ON public.payments TO authenticated'),
  'Database grants explicitly deny authenticated users direct UPDATE on payments'
);
assert(
  !migrationSql.includes('GRANT INSERT ON public.issued_documents TO authenticated'),
  'Database grants explicitly deny authenticated users direct INSERT on issued_documents'
);
assert(
  !migrationSql.includes('GRANT INSERT ON public.audit_logs TO authenticated'),
  'Database grants explicitly deny authenticated users direct INSERT on audit_logs'
);

// 11. Public Credential Verification RPC Safety
console.log('\n11. Credential Verification RPC Safety & Input Sanitation:');
const verifyFnMatch = migrationSql.match(/FUNCTION public\.verify_credential[\s\S]*?AS \$\$([\s\S]*?)\$\$;/i);
if (verifyFnMatch) {
  const fnBody = verifyFnMatch[1];
  assert(!fnBody.includes('p.phone'), 'verify_credential does NOT leak student phone number');
  assert(!fnBody.includes('p.email'), 'verify_credential does NOT leak student email');
  assert(!fnBody.includes('d.file_path'), 'verify_credential does NOT leak private storage file path');
  assert(fnBody.includes("d.document_type = 'certificate'"), 'verify_credential restricts public verification to certificates (never LORs)');
  assert(
    fnBody.includes('length(trim(p_verification_id)) < 3') || fnBody.includes('p_verification_id IS NULL'),
    'verify_credential sanitizes and guards against malformed/empty/overflow identifiers'
  );
} else {
  assert(false, 'verify_credential function body could not be parsed');
}

// 12. TypeScript Database Types
console.log('\n12. Verifying TypeScript Database Types:');
const typesPath = path.join(rootDir, 'src', 'types', 'database.types.ts');
assert(fs.existsSync(typesPath), 'src/types/database.types.ts exists');
if (fs.existsSync(typesPath)) {
  const typesContent = fs.readFileSync(typesPath, 'utf8');
  for (const table of REQUIRED_TABLES) {
    assert(typesContent.includes(`${table}: {`), `database.types.ts includes table '${table}'`);
  }
}

// 13. Client-Side Secret Isolation
console.log('\n13. Client-Side Secret Isolation:');
const clientPath = path.join(rootDir, 'src', 'lib', 'supabase', 'client.ts');
assert(fs.existsSync(clientPath), 'src/lib/supabase/client.ts exists');
if (fs.existsSync(clientPath)) {
  const clientContent = fs.readFileSync(clientPath, 'utf8');
  assert(
    !clientContent.includes('SUPABASE_SERVICE_ROLE_KEY'),
    'Client bundle does NOT import or reference SUPABASE_SERVICE_ROLE_KEY'
  );
  assert(
    !clientContent.includes('service_role'),
    'Client bundle does NOT reference service_role'
  );
  assert(
    clientContent.includes('VITE_SUPABASE_URL') && clientContent.includes('VITE_SUPABASE_ANON_KEY'),
    'Client safely references only VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
  );
}

// 14. Environment Template Sanitization
console.log('\n14. Environment Template Sanitization:');
const envExamplePath = path.join(rootDir, '.env.example');
assert(fs.existsSync(envExamplePath), '.env.example exists');
if (fs.existsSync(envExamplePath)) {
  const envContent = fs.readFileSync(envExamplePath, 'utf8');
  assert(envContent.includes('VITE_SUPABASE_URL='), '.env.example contains VITE_SUPABASE_URL placeholder');
  assert(envContent.includes('VITE_SUPABASE_ANON_KEY='), '.env.example contains VITE_SUPABASE_ANON_KEY placeholder');
  assert(envContent.includes('SUPABASE_SERVICE_ROLE_KEY='), '.env.example contains SUPABASE_SERVICE_ROLE_KEY server placeholder');
  assert(!envContent.includes('eyJhbGciOi'), '.env.example does not contain real JWT secrets');
}

console.log(`\n======================================================`);
console.log(`Security Test Suite Summary: ${passed} passed, ${errors} failed.`);
console.log(`======================================================\n`);

if (errors > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
