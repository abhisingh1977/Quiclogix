-- Quiclogix Solutions — Initial PostgreSQL Schema and Security Foundation
-- Migration: 20261016000000_initial_schema_and_security.sql
-- Description: Core schema, role-based access control, RLS policies, audit logs, and verification RPC
-- Security Hardened: Phase 2 Security Review (Explicit Grants, Strict State Machine RLS, Assignment-Scoped Storage)

-- ============================================================================
-- 1. EXTENSIONS & SETUP
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. ENUMS & DOMAINS
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('applicant', 'student', 'reviewer', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.cohort_status AS ENUM ('draft', 'upcoming', 'published', 'open', 'active', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.application_status AS ENUM ('draft', 'submitted', 'under_review', 'accepted', 'rejected', 'withdrawn');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'failed', 'cancelled', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.internship_status AS ENUM ('scheduled', 'active', 'submitted', 'under_evaluation', 'completed', 'withdrawn', 'incomplete', 'on_hold');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.submission_status AS ENUM ('draft', 'submitted', 'under_review', 'revision_required', 'approved');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.evaluation_decision AS ENUM ('pass', 'revision', 'fail');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.document_type AS ENUM ('certificate', 'lor');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.document_status AS ENUM ('pending', 'approved', 'issued', 'revoked');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 3. IDENTITY AND ACCESS TABLES
-- ============================================================================

-- Profiles table: Extends auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- User Roles table: Authoritative role assignments
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role public.app_role NOT NULL,
    granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, role)
);

-- Helper security definer functions for RLS without recursive lookups
-- 1. is_admin: Check if authenticated caller holds admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = auth.uid()
          AND role = 'admin'::public.app_role
    );
$$;

-- 2. has_role: Protected against probe attacks (only caller or admin can inspect role)
CREATE OR REPLACE FUNCTION public.has_role(check_user_id UUID, check_role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = check_user_id
          AND role = check_role
          AND (check_user_id = auth.uid() OR public.is_admin())
    );
$$;

-- Auto-create profile trigger on auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, 'Participant')
    )
    ON CONFLICT (id) DO NOTHING;

    -- Assign default 'applicant' role to all new authenticated sign-ups
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'applicant'::public.app_role)
    ON CONFLICT (user_id, role) DO NOTHING;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Reviewer Assignments table: Mentors/reviewers linked to cohorts or internships
CREATE TABLE IF NOT EXISTS public.reviewer_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    cohort_id UUID,
    internship_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT chk_reviewer_assignment_target CHECK (cohort_id IS NOT NULL OR internship_id IS NOT NULL)
);

-- ============================================================================
-- 4. PROGRAM CONFIGURATION TABLES
-- ============================================================================

-- Internship Domains: Engineering and consulting tracks
CREATE TABLE IF NOT EXISTS public.internship_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    eligibility TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Cohorts: Program intake cycles with authoritative dates and capacity
CREATE TABLE IF NOT EXISTS public.cohorts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    application_deadline TIMESTAMPTZ NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 50 CHECK (capacity > 0),
    fee_minor_units INTEGER NOT NULL DEFAULT 0 CHECK (fee_minor_units >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    status public.cohort_status NOT NULL DEFAULT 'draft',
    terms_version TEXT NOT NULL DEFAULT '1.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT chk_cohort_dates CHECK (end_date >= start_date)
);

-- Project Briefs: Real-world briefs with evaluation rubrics
CREATE TABLE IF NOT EXISTS public.project_briefs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_id UUID NOT NULL REFERENCES public.internship_domains(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    rubric_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    version TEXT NOT NULL DEFAULT '1.0',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Add foreign key constraint to reviewer_assignments now that cohorts is declared
DO $$ BEGIN
    ALTER TABLE public.reviewer_assignments
        ADD CONSTRAINT fk_reviewer_assignment_cohort
        FOREIGN KEY (cohort_id) REFERENCES public.cohorts(id) ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 5. APPLICATIONS AND PAYMENTS TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    applicant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    cohort_id UUID NOT NULL REFERENCES public.cohorts(id) ON DELETE RESTRICT,
    domain_id UUID NOT NULL REFERENCES public.internship_domains(id) ON DELETE RESTRICT,
    status public.application_status NOT NULL DEFAULT 'draft',
    submitted_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    decision_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(applicant_id, cohort_id)
);

CREATE TABLE IF NOT EXISTS public.application_details (
    application_id UUID PRIMARY KEY REFERENCES public.applications(id) ON DELETE CASCADE,
    education_or_experience TEXT,
    skills TEXT[] DEFAULT '{}',
    portfolio_url TEXT,
    resume_path TEXT,
    consent_version TEXT NOT NULL DEFAULT '1.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE RESTRICT,
    provider TEXT NOT NULL,
    provider_order_id TEXT NOT NULL,
    provider_payment_id TEXT,
    amount_minor_units INTEGER NOT NULL CHECK (amount_minor_units >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    status public.payment_status NOT NULL DEFAULT 'pending',
    verified_at TIMESTAMPTZ,
    refunded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.payment_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL,
    provider_event_id TEXT NOT NULL,
    payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    payload_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(provider, provider_event_id)
);

-- ============================================================================
-- 6. INTERNSHIP AND EVALUATION TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.internships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL UNIQUE REFERENCES public.applications(id) ON DELETE RESTRICT,
    cohort_id UUID NOT NULL REFERENCES public.cohorts(id) ON DELETE RESTRICT,
    domain_id UUID NOT NULL REFERENCES public.internship_domains(id) ON DELETE RESTRICT,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mentor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status public.internship_status NOT NULL DEFAULT 'scheduled',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT chk_internship_dates CHECK (end_date >= start_date)
);

-- Add foreign key constraint to reviewer_assignments for internship_id
DO $$ BEGIN
    ALTER TABLE public.reviewer_assignments
        ADD CONSTRAINT fk_reviewer_assignment_internship
        FOREIGN KEY (internship_id) REFERENCES public.internships(id) ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.project_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    internship_id UUID NOT NULL REFERENCES public.internships(id) ON DELETE CASCADE,
    project_brief_id UUID NOT NULL REFERENCES public.project_briefs(id) ON DELETE RESTRICT,
    assigned_by UUID NOT NULL REFERENCES auth.users(id),
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    due_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.project_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES public.project_assignments(id) ON DELETE CASCADE,
    repository_url TEXT,
    demo_url TEXT,
    report_path TEXT,
    notes TEXT,
    status public.submission_status NOT NULL DEFAULT 'draft',
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES public.project_submissions(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES auth.users(id),
    rubric_scores_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    overall_score NUMERIC(5,2),
    feedback TEXT NOT NULL,
    decision public.evaluation_decision NOT NULL,
    released_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.submission_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES public.project_submissions(id) ON DELETE CASCADE,
    requested_by UUID NOT NULL REFERENCES auth.users(id),
    reason TEXT NOT NULL,
    due_at TIMESTAMPTZ NOT NULL,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 7. DOCUMENTS AND AUDIT TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.issued_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    internship_id UUID NOT NULL REFERENCES public.internships(id) ON DELETE RESTRICT,
    document_type public.document_type NOT NULL,
    verification_id TEXT NOT NULL UNIQUE,
    file_path TEXT NOT NULL,
    status public.document_status NOT NULL DEFAULT 'pending',
    issued_by UUID REFERENCES auth.users(id),
    approved_by UUID REFERENCES auth.users(id),
    issued_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    revocation_reason TEXT,
    template_version TEXT NOT NULL DEFAULT '1.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(internship_id, document_type)
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Append-only audit logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 8. INDEXES FOR PERFORMANCE & SECURITY LOOKUPS
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_reviewer_assignments_reviewer ON public.reviewer_assignments(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviewer_assignments_cohort ON public.reviewer_assignments(cohort_id);
CREATE INDEX IF NOT EXISTS idx_reviewer_assignments_internship ON public.reviewer_assignments(internship_id);
CREATE INDEX IF NOT EXISTS idx_cohorts_status ON public.cohorts(status);
CREATE INDEX IF NOT EXISTS idx_applications_applicant ON public.applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_applications_cohort ON public.applications(cohort_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_payments_application ON public.payments(application_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_internships_student ON public.internships(student_id);
CREATE INDEX IF NOT EXISTS idx_internships_cohort ON public.internships(cohort_id);
CREATE INDEX IF NOT EXISTS idx_internships_mentor ON public.internships(mentor_id);
CREATE INDEX IF NOT EXISTS idx_internships_status ON public.internships(status);
CREATE INDEX IF NOT EXISTS idx_project_assignments_internship ON public.project_assignments(internship_id);
CREATE INDEX IF NOT EXISTS idx_project_submissions_assignment ON public.project_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_submission ON public.evaluations(submission_id);
CREATE INDEX IF NOT EXISTS idx_issued_documents_verification ON public.issued_documents(verification_id);
CREATE INDEX IF NOT EXISTS idx_issued_documents_internship ON public.issued_documents(internship_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);

-- ============================================================================
-- 9. HELPER FUNCTIONS FOR ROW LEVEL SECURITY (Caller-isolation hardened)
-- ============================================================================

-- Check if caller is an assigned reviewer for an application (prevents probing)
CREATE OR REPLACE FUNCTION public.is_assigned_to_application(check_application_id UUID, check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT (
        (check_user_id = auth.uid() OR public.is_admin())
        AND (
            EXISTS (
                SELECT 1
                FROM public.applications a
                JOIN public.reviewer_assignments ra ON ra.cohort_id = a.cohort_id
                WHERE a.id = check_application_id
                  AND ra.reviewer_id = check_user_id
            ) OR public.is_admin()
        )
    );
$$;

-- Check if caller is an assigned reviewer or mentor for an internship (prevents probing)
CREATE OR REPLACE FUNCTION public.is_assigned_to_internship(check_internship_id UUID, check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT (
        (check_user_id = auth.uid() OR public.is_admin())
        AND (
            EXISTS (
                SELECT 1
                FROM public.internships i
                LEFT JOIN public.reviewer_assignments ra ON (ra.internship_id = i.id OR ra.cohort_id = i.cohort_id)
                WHERE i.id = check_internship_id
                  AND (i.mentor_id = check_user_id OR ra.reviewer_id = check_user_id)
            ) OR public.is_admin()
        )
    );
$$;

-- Check if caller is assigned to a submission (prevents probing)
CREATE OR REPLACE FUNCTION public.is_assigned_to_submission(check_submission_id UUID, check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT (
        (check_user_id = auth.uid() OR public.is_admin())
        AND (
            EXISTS (
                SELECT 1
                FROM public.project_submissions ps
                JOIN public.project_assignments pa ON pa.id = ps.assignment_id
                JOIN public.internships i ON i.id = pa.internship_id
                LEFT JOIN public.reviewer_assignments ra ON (ra.internship_id = i.id OR ra.cohort_id = i.cohort_id)
                WHERE ps.id = check_submission_id
                  AND (i.mentor_id = check_user_id OR ra.reviewer_id = check_user_id)
            ) OR public.is_admin()
        )
    );
$$;

-- ============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on every table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviewer_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issued_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- PROFILES POLICIES (Reviewers see ONLY assigned participants)
-- ----------------------------------------------------------------------------
CREATE POLICY "profiles_select_own" ON public.profiles
    FOR SELECT TO authenticated
    USING (
        id = auth.uid()
        OR public.is_admin()
        OR EXISTS (
            SELECT 1 FROM public.applications a
            JOIN public.reviewer_assignments ra ON ra.cohort_id = a.cohort_id
            WHERE a.applicant_id = profiles.id AND ra.reviewer_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM public.internships i
            LEFT JOIN public.reviewer_assignments ra ON (ra.internship_id = i.id OR ra.cohort_id = i.cohort_id)
            WHERE i.student_id = profiles.id AND (i.mentor_id = auth.uid() OR ra.reviewer_id = auth.uid())
        )
    );

CREATE POLICY "profiles_insert_own" ON public.profiles
    FOR INSERT TO authenticated
    WITH CHECK (id = auth.uid() OR public.is_admin());

CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE TO authenticated
    USING (id = auth.uid() OR public.is_admin())
    WITH CHECK (id = auth.uid() OR public.is_admin());

-- ----------------------------------------------------------------------------
-- USER_ROLES POLICIES (Strict: read own roles or admin; no client writes)
-- ----------------------------------------------------------------------------
CREATE POLICY "user_roles_select" ON public.user_roles
    FOR SELECT TO authenticated
    USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "user_roles_admin_manage" ON public.user_roles
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- REVIEWER_ASSIGNMENTS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "reviewer_assignments_select" ON public.reviewer_assignments
    FOR SELECT TO authenticated
    USING (reviewer_id = auth.uid() OR public.is_admin());

CREATE POLICY "reviewer_assignments_admin_manage" ON public.reviewer_assignments
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- INTERNSHIP_DOMAINS POLICIES (Public read active, admin write)
-- ----------------------------------------------------------------------------
CREATE POLICY "domains_read_public" ON public.internship_domains
    FOR SELECT TO anon, authenticated
    USING (is_active = true OR public.is_admin());

CREATE POLICY "domains_admin_manage" ON public.internship_domains
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- COHORTS POLICIES (Public read published/open, admin write)
-- ----------------------------------------------------------------------------
CREATE POLICY "cohorts_read_public" ON public.cohorts
    FOR SELECT TO anon, authenticated
    USING (status IN ('published', 'open', 'active', 'completed') OR public.is_admin());

CREATE POLICY "cohorts_admin_manage" ON public.cohorts
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- PROJECT_BRIEFS POLICIES (Assigned students, assigned reviewers, admin)
-- ----------------------------------------------------------------------------
CREATE POLICY "project_briefs_select" ON public.project_briefs
    FOR SELECT TO authenticated
    USING (
        public.is_admin()
        OR EXISTS (
            SELECT 1 FROM public.project_assignments pa
            JOIN public.internships i ON i.id = pa.internship_id
            WHERE pa.project_brief_id = project_briefs.id
              AND (
                  i.student_id = auth.uid()
                  OR public.is_assigned_to_internship(i.id, auth.uid())
              )
        )
    );

CREATE POLICY "project_briefs_admin_manage" ON public.project_briefs
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- APPLICATIONS POLICIES (Strict state-machine: applicant can only update while draft)
-- ----------------------------------------------------------------------------
CREATE POLICY "applications_select" ON public.applications
    FOR SELECT TO authenticated
    USING (
        applicant_id = auth.uid()
        OR public.is_admin()
        OR public.is_assigned_to_application(id, auth.uid())
    );

CREATE POLICY "applications_insert_draft" ON public.applications
    FOR INSERT TO authenticated
    WITH CHECK (
        applicant_id = auth.uid()
        AND status = 'draft'::public.application_status
        AND reviewed_by IS NULL
        AND reviewed_at IS NULL
        AND decision_note IS NULL
    );

CREATE POLICY "applications_update_applicant" ON public.applications
    FOR UPDATE TO authenticated
    USING (
        public.is_admin()
        OR (
            applicant_id = auth.uid()
            AND status = 'draft'::public.application_status
        )
    )
    WITH CHECK (
        public.is_admin()
        OR (
            applicant_id = auth.uid()
            AND (
                status = 'draft'::public.application_status
                OR status = 'submitted'::public.application_status
            )
            AND reviewed_by IS NULL
            AND reviewed_at IS NULL
            AND decision_note IS NULL
        )
    );

-- ----------------------------------------------------------------------------
-- APPLICATION_DETAILS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "application_details_select" ON public.application_details
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.applications a
            WHERE a.id = application_details.application_id
              AND (
                  a.applicant_id = auth.uid()
                  OR public.is_admin()
                  OR public.is_assigned_to_application(a.id, auth.uid())
              )
        )
    );

CREATE POLICY "application_details_insert_own" ON public.application_details
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.applications a
            WHERE a.id = application_details.application_id
              AND a.applicant_id = auth.uid()
              AND a.status = 'draft'::public.application_status
        )
        OR public.is_admin()
    );

CREATE POLICY "application_details_update_own" ON public.application_details
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.applications a
            WHERE a.id = application_details.application_id
              AND a.applicant_id = auth.uid()
              AND a.status = 'draft'::public.application_status
        )
        OR public.is_admin()
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.applications a
            WHERE a.id = application_details.application_id
              AND a.applicant_id = auth.uid()
              AND a.status = 'draft'::public.application_status
        )
        OR public.is_admin()
    );

-- ----------------------------------------------------------------------------
-- PAYMENTS POLICIES (Applicant reads own payments, admin reads; client cannot write)
-- ----------------------------------------------------------------------------
CREATE POLICY "payments_select" ON public.payments
    FOR SELECT TO authenticated
    USING (
        public.is_admin()
        OR EXISTS (
            SELECT 1 FROM public.applications a
            WHERE a.id = payments.application_id
              AND a.applicant_id = auth.uid()
        )
    );

CREATE POLICY "payments_admin_manage" ON public.payments
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- PAYMENT_EVENTS POLICIES (Admin only read, no direct client writes)
-- ----------------------------------------------------------------------------
CREATE POLICY "payment_events_admin_select" ON public.payment_events
    FOR SELECT TO authenticated
    USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- INTERNSHIPS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "internships_select" ON public.internships
    FOR SELECT TO authenticated
    USING (
        student_id = auth.uid()
        OR public.is_admin()
        OR public.is_assigned_to_internship(id, auth.uid())
    );

CREATE POLICY "internships_admin_manage" ON public.internships
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- PROJECT_ASSIGNMENTS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "project_assignments_select" ON public.project_assignments
    FOR SELECT TO authenticated
    USING (
        public.is_admin()
        OR EXISTS (
            SELECT 1 FROM public.internships i
            WHERE i.id = project_assignments.internship_id
              AND (
                  i.student_id = auth.uid()
                  OR public.is_assigned_to_internship(i.id, auth.uid())
              )
        )
    );

CREATE POLICY "project_assignments_admin_manage" ON public.project_assignments
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- PROJECT_SUBMISSIONS POLICIES (Students can only set draft or submitted)
-- ----------------------------------------------------------------------------
CREATE POLICY "project_submissions_select" ON public.project_submissions
    FOR SELECT TO authenticated
    USING (
        public.is_admin()
        OR EXISTS (
            SELECT 1 FROM public.project_assignments pa
            JOIN public.internships i ON i.id = pa.internship_id
            WHERE pa.id = project_submissions.assignment_id
              AND (
                  i.student_id = auth.uid()
                  OR public.is_assigned_to_internship(i.id, auth.uid())
              )
        )
    );

CREATE POLICY "project_submissions_insert_student" ON public.project_submissions
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_admin()
        OR (
            EXISTS (
                SELECT 1 FROM public.project_assignments pa
                JOIN public.internships i ON i.id = pa.internship_id
                WHERE pa.id = project_submissions.assignment_id
                  AND i.student_id = auth.uid()
                  AND i.status IN ('active'::public.internship_status, 'submitted'::public.internship_status)
            )
            AND status IN ('draft'::public.submission_status, 'submitted'::public.submission_status)
        )
    );

CREATE POLICY "project_submissions_update_student" ON public.project_submissions
    FOR UPDATE TO authenticated
    USING (
        public.is_admin()
        OR EXISTS (
            SELECT 1 FROM public.project_assignments pa
            JOIN public.internships i ON i.id = pa.internship_id
            WHERE pa.id = project_submissions.assignment_id
              AND i.student_id = auth.uid()
              AND project_submissions.status IN ('draft'::public.submission_status, 'revision_required'::public.submission_status)
        )
    )
    WITH CHECK (
        public.is_admin()
        OR (
            EXISTS (
                SELECT 1 FROM public.project_assignments pa
                JOIN public.internships i ON i.id = pa.internship_id
                WHERE pa.id = project_submissions.assignment_id
                  AND i.student_id = auth.uid()
            )
            AND status IN ('draft'::public.submission_status, 'submitted'::public.submission_status)
        )
    );

-- ----------------------------------------------------------------------------
-- EVALUATIONS POLICIES (Reviewers cannot publish release directly)
-- ----------------------------------------------------------------------------
CREATE POLICY "evaluations_select" ON public.evaluations
    FOR SELECT TO authenticated
    USING (
        public.is_admin()
        OR (
            -- Student sees released evaluations only
            released_at IS NOT NULL
            AND EXISTS (
                SELECT 1 FROM public.project_submissions ps
                JOIN public.project_assignments pa ON pa.id = ps.assignment_id
                JOIN public.internships i ON i.id = pa.internship_id
                WHERE ps.id = evaluations.submission_id
                  AND i.student_id = auth.uid()
            )
        )
        OR (
            -- Reviewer sees assigned evaluations
            public.is_assigned_to_submission(submission_id, auth.uid())
        )
    );

CREATE POLICY "evaluations_insert_reviewer" ON public.evaluations
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_admin()
        OR (
            reviewer_id = auth.uid()
            AND public.has_role(auth.uid(), 'reviewer'::public.app_role)
            AND public.is_assigned_to_submission(submission_id, auth.uid())
            AND released_at IS NULL
        )
    );

CREATE POLICY "evaluations_update_reviewer" ON public.evaluations
    FOR UPDATE TO authenticated
    USING (
        public.is_admin()
        OR (
            reviewer_id = auth.uid()
            AND released_at IS NULL
            AND public.is_assigned_to_submission(submission_id, auth.uid())
        )
    )
    WITH CHECK (
        public.is_admin()
        OR (
            reviewer_id = auth.uid()
            AND released_at IS NULL
            AND public.is_assigned_to_submission(submission_id, auth.uid())
        )
    );

-- ----------------------------------------------------------------------------
-- SUBMISSION_REVISIONS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "submission_revisions_select" ON public.submission_revisions
    FOR SELECT TO authenticated
    USING (
        public.is_admin()
        OR public.is_assigned_to_submission(submission_id, auth.uid())
        OR EXISTS (
            SELECT 1 FROM public.project_submissions ps
            JOIN public.project_assignments pa ON pa.id = ps.assignment_id
            JOIN public.internships i ON i.id = pa.internship_id
            WHERE ps.id = submission_revisions.submission_id
              AND i.student_id = auth.uid()
        )
    );

CREATE POLICY "submission_revisions_insert_reviewer" ON public.submission_revisions
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_admin()
        OR (
            requested_by = auth.uid()
            AND public.is_assigned_to_submission(submission_id, auth.uid())
        )
    );

-- ----------------------------------------------------------------------------
-- ISSUED_DOCUMENTS POLICIES (Students read own issued, admin manage)
-- ----------------------------------------------------------------------------
CREATE POLICY "issued_documents_select" ON public.issued_documents
    FOR SELECT TO authenticated
    USING (
        public.is_admin()
        OR EXISTS (
            SELECT 1 FROM public.internships i
            WHERE i.id = issued_documents.internship_id
              AND i.student_id = auth.uid()
              AND issued_documents.status = 'issued'::public.document_status
        )
    );

CREATE POLICY "issued_documents_admin_manage" ON public.issued_documents
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- NOTIFICATIONS POLICIES (Users manage their own notifications)
-- ----------------------------------------------------------------------------
CREATE POLICY "notifications_select_own" ON public.notifications
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "notifications_update_own" ON public.notifications
    FOR UPDATE TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- AUDIT_LOGS POLICIES (Strict append-only, admin read only)
-- ----------------------------------------------------------------------------
CREATE POLICY "audit_logs_select_admin" ON public.audit_logs
    FOR SELECT TO authenticated
    USING (public.is_admin());

-- ============================================================================
-- 11. PUBLIC CREDENTIAL VERIFICATION RPC (Sanitized & Rate Safe)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.verify_credential(p_verification_id TEXT)
RETURNS TABLE (
    valid BOOLEAN,
    verification_id TEXT,
    document_type TEXT,
    student_name TEXT,
    domain_name TEXT,
    completion_date DATE,
    status TEXT,
    issued_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Input sanitation: reject null, whitespace-only, or overly long strings
    IF p_verification_id IS NULL OR length(trim(p_verification_id)) < 3 OR length(p_verification_id) > 64 THEN
        RETURN;
    END IF;

    RETURN QUERY
    SELECT
        true AS valid,
        d.verification_id,
        d.document_type::TEXT,
        p.full_name AS student_name,
        dom.name AS domain_name,
        i.end_date AS completion_date,
        d.status::TEXT,
        d.issued_at
    FROM public.issued_documents d
    JOIN public.internships i ON i.id = d.internship_id
    JOIN public.profiles p ON p.id = i.student_id
    JOIN public.internship_domains dom ON dom.id = i.domain_id
    WHERE d.verification_id = trim(p_verification_id)
      AND d.document_type = 'certificate'::public.document_type
      AND d.status = 'issued'::public.document_status;
END;
$$;

-- Grant public execution of credential verification RPC
REVOKE ALL ON FUNCTION public.verify_credential(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_credential(TEXT) TO anon, authenticated;

-- ============================================================================
-- 12. STORAGE BUCKETS CONFIGURATION & DATABASE-RELATIONSHIP POLICIES
-- ============================================================================

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'storage') THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES
            ('resumes', 'resumes', false, 5242880, ARRAY['application/pdf']),
            ('project-reports', 'project-reports', false, 20971520, ARRAY['application/pdf', 'application/zip']),
            ('certificates', 'certificates', false, 10485760, ARRAY['application/pdf']),
            ('lors', 'lors', false, 10485760, ARRAY['application/pdf'])
        ON CONFLICT (id) DO UPDATE SET
            public = false,
            file_size_limit = EXCLUDED.file_size_limit,
            allowed_mime_types = EXCLUDED.allowed_mime_types;
    END IF;
END $$;

-- Storage RLS policies: Enforces authenticated user, folder ownership AND relational entity existence
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'storage' AND table_name = 'objects') THEN

        -- storage.objects has RLS enabled by default in Supabase (owned by supabase_storage_admin)

        -- Drop existing policies if any
        DROP POLICY IF EXISTS "resumes_upload_owner" ON storage.objects;
        DROP POLICY IF EXISTS "resumes_select_authorized" ON storage.objects;
        DROP POLICY IF EXISTS "project_reports_upload_owner" ON storage.objects;
        DROP POLICY IF EXISTS "project_reports_select_authorized" ON storage.objects;
        DROP POLICY IF EXISTS "issued_documents_read_student" ON storage.objects;

        -- RESUMES: Path must be resumes/{user_id}/{application_id}/...
        -- Verifies authenticated owner AND application existence in draft status
        CREATE POLICY "resumes_upload_owner" ON storage.objects
            FOR INSERT TO authenticated
            WITH CHECK (
                bucket_id = 'resumes'
                AND (storage.foldername(name))[1] = auth.uid()::text
                AND (storage.foldername(name))[2] IS NOT NULL
                AND EXISTS (
                    SELECT 1 FROM public.applications a
                    WHERE a.id = ((storage.foldername(name))[2])::uuid
                      AND a.applicant_id = auth.uid()
                      AND a.status = 'draft'::public.application_status
                )
            );

        CREATE POLICY "resumes_select_authorized" ON storage.objects
            FOR SELECT TO authenticated
            USING (
                bucket_id = 'resumes'
                AND (
                    (storage.foldername(name))[1] = auth.uid()::text
                    OR public.is_admin()
                    OR (
                        (storage.foldername(name))[2] IS NOT NULL
                        AND public.is_assigned_to_application(((storage.foldername(name))[2])::uuid, auth.uid())
                    )
                )
            );

        -- PROJECT REPORTS: Path must be project-reports/{user_id}/{internship_id}/...
        -- Verifies authenticated owner AND internship existence in active/submitted status
        CREATE POLICY "project_reports_upload_owner" ON storage.objects
            FOR INSERT TO authenticated
            WITH CHECK (
                bucket_id = 'project-reports'
                AND (storage.foldername(name))[1] = auth.uid()::text
                AND (storage.foldername(name))[2] IS NOT NULL
                AND EXISTS (
                    SELECT 1 FROM public.internships i
                    WHERE i.id = ((storage.foldername(name))[2])::uuid
                      AND i.student_id = auth.uid()
                      AND i.status IN ('active'::public.internship_status, 'submitted'::public.internship_status)
                )
            );

        CREATE POLICY "project_reports_select_authorized" ON storage.objects
            FOR SELECT TO authenticated
            USING (
                bucket_id = 'project-reports'
                AND (
                    (storage.foldername(name))[1] = auth.uid()::text
                    OR public.is_admin()
                    OR (
                        (storage.foldername(name))[2] IS NOT NULL
                        AND public.is_assigned_to_internship(((storage.foldername(name))[2])::uuid, auth.uid())
                    )
                )
            );

        -- ISSUED CERTIFICATES & LORS: Only admin/service_role can insert; student can read their own
        CREATE POLICY "issued_documents_read_student" ON storage.objects
            FOR SELECT TO authenticated
            USING (
                bucket_id IN ('certificates', 'lors')
                AND (
                    public.is_admin()
                    OR EXISTS (
                        SELECT 1 FROM public.issued_documents d
                        JOIN public.internships i ON i.id = d.internship_id
                        WHERE i.student_id = auth.uid()
                          AND d.file_path = storage.objects.name
                          AND d.status = 'issued'::public.document_status
                    )
                )
            );

    END IF;
END $$;

-- ============================================================================
-- 13. DEFENSE-IN-DEPTH: EXPLICIT DATABASE ROLE GRANTS
-- ============================================================================

-- Revoke all table-level privileges from PUBLIC
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM PUBLIC;

-- Anon grants: read-only access to public program tracks and public cohorts
GRANT SELECT ON public.internship_domains TO anon;
GRANT SELECT ON public.cohorts TO anon;

-- Authenticated grants:
-- Tables where client CRUD is permitted (governed by RLS)
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT SELECT ON public.reviewer_assignments TO authenticated;
GRANT SELECT ON public.internship_domains TO authenticated;
GRANT SELECT ON public.cohorts TO authenticated;
GRANT SELECT ON public.project_briefs TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.applications TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.application_details TO authenticated;
GRANT SELECT ON public.payments TO authenticated;
GRANT SELECT ON public.payment_events TO authenticated;
GRANT SELECT ON public.internships TO authenticated;
GRANT SELECT ON public.project_assignments TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.project_submissions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.evaluations TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.submission_revisions TO authenticated;
GRANT SELECT ON public.issued_documents TO authenticated;
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT SELECT ON public.audit_logs TO authenticated;

-- Function execution grants
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_assigned_to_application(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_assigned_to_internship(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_assigned_to_submission(UUID, UUID) TO authenticated;
-- Quiclogix Solutions — Migration: 19 Internship Domains & Application Schema Extensions
-- Migration ID: 20261016000001_seed_19_internship_domains.sql
-- Description:
-- 1. Upserts the authoritative 19 internship domains requested by owner on 2026-10-16.
-- 2. Preserves existing referential integrity and stable UUIDs.
-- 3. Extends public.application_details with academic profile columns (course, branch, institution, year).
-- 4. Enforces database partial unique index preventing duplicate active applications per student/domain.

-- 1. EXTEND APPLICATION DETAILS TABLE
ALTER TABLE public.application_details
    ADD COLUMN IF NOT EXISTS course_or_degree TEXT,
    ADD COLUMN IF NOT EXISTS branch_specialization TEXT,
    ADD COLUMN IF NOT EXISTS institution_name TEXT,
    ADD COLUMN IF NOT EXISTS study_or_graduation_year TEXT,
    ADD COLUMN IF NOT EXISTS phone TEXT;

-- 2. PREVENT DUPLICATE ACTIVE APPLICATIONS PER STUDENT AND DOMAIN
-- Enforces that an applicant cannot hold multiple concurrent draft, submitted, under_review, or accepted applications for the same domain.
CREATE UNIQUE INDEX IF NOT EXISTS idx_applications_active_student_domain
    ON public.applications (applicant_id, domain_id)
    WHERE status IN ('draft', 'submitted', 'under_review', 'accepted');

-- 3. UPSERT THE 19 AUTHORITATIVE INTERNSHIP DOMAINS
INSERT INTO public.internship_domains (id, slug, name, description, is_active, sort_order)
VALUES
    (
        '11111111-1111-1111-1111-111111111101',
        'app-development',
        'App Development',
        'Architect and build performant cross-platform and native mobile applications. Focus on reactive state management, offline-first data caching, native device APIs, and accessible UI engineering.',
        true,
        1
    ),
    (
        '11111111-1111-1111-1111-111111111102',
        'artificial-intelligence',
        'Artificial Intelligence',
        'Design intelligent systems incorporating modern transformer models, Retrieval-Augmented Generation (RAG) pipelines, semantic embeddings, and automated agentic decision workflows.',
        true,
        2
    ),
    (
        '11111111-1111-1111-1111-111111111103',
        'frontend-developer',
        'Frontend Developer',
        'Construct high-performance, accessible client-side applications. Master tokenized design systems, WCAG 2.2 AA accessibility, responsive layout craft, and complex asynchronous state handling.',
        true,
        3
    ),
    (
        '11111111-1111-1111-1111-111111111104',
        'backend-developer',
        'Backend Developer',
        'Engineer robust server-side APIs, relational database schemas, and microservice architectures. Implement idempotent transaction handlers, authentication layers, and append-only audit trails.',
        true,
        4
    ),
    (
        '11111111-1111-1111-1111-111111111105',
        'full-stack-developer',
        'Full Stack Developer',
        'Bridge client interfaces with server logic. Build end-to-end applications from database migrations and security policies through API endpoints to responsive, polished user interfaces.',
        true,
        5
    ),
    (
        '11111111-1111-1111-1111-111111111106',
        'blockchain-developer',
        'Blockchain Developer',
        'Develop smart contracts and decentralized applications. Focus on gas optimization, smart contract security standards, cryptographic verification, and Web3 wallet integration.',
        true,
        6
    ),
    (
        '11111111-1111-1111-1111-111111111107',
        'c-programming',
        'C Programming',
        'Delve into fundamental systems programming. Master pointer arithmetic, manual heap allocation, POSIX system calls, custom data structures, and deterministic performance profiling.',
        true,
        7
    ),
    (
        '11111111-1111-1111-1111-111111111108',
        'cybersecurity',
        'Cybersecurity',
        'Assess application vulnerabilities and implement robust defense postures. Explore secure authentication flows, cryptographic hygiene, OWASP Top 10 mitigation, and threat modeling.',
        true,
        8
    ),
    (
        '11111111-1111-1111-1111-111111111109',
        'data-analytics',
        'Data Analytics',
        'Transform complex operational data into actionable strategic insights. Clean and model disparate datasets, compute statistical KPIs, and engineer interactive analytical dashboards.',
        true,
        9
    ),
    (
        '11111111-1111-1111-1111-111111111110',
        'data-science',
        'Data Science',
        'Formulate statistical hypotheses, engineer predictive features, and apply regression, classification, and clustering algorithms to solve non-linear real-world problems.',
        true,
        10
    ),
    (
        '11111111-1111-1111-1111-111111111111',
        'devops',
        'DevOps',
        'Automate infrastructure and delivery lifecycles. Build declarative CI/CD pipelines, containerize microservices with Docker, manage Kubernetes clusters, and instrument observability.',
        true,
        11
    ),
    (
        '11111111-1111-1111-1111-111111111112',
        'digital-marketing',
        'Digital Marketing',
        'Master data-driven digital growth. Execute technical SEO audits, analyze funnel conversion drops, optimize acquisition channels, and construct structured digital marketing campaigns.',
        true,
        12
    ),
    (
        '11111111-1111-1111-1111-111111111113',
        'graphic-designer',
        'Graphic Designer',
        'Develop sophisticated visual communication assets. Create comprehensive brand identity systems, editorial layouts, vector icon sets, and marketing collateral adhering to strict design standards.',
        true,
        13
    ),
    (
        '11111111-1111-1111-1111-111111111114',
        'internet-of-things',
        'Internet of Things',
        'Connect physical sensor networks to cloud telemetry. Program microcontrollers, configure lightweight MQTT/CoAP broker pipelines, and visualize real-time industrial telemetry feeds.',
        true,
        14
    ),
    (
        '11111111-1111-1111-1111-111111111115',
        'java-programmer',
        'Java Programmer',
        'Develop enterprise-grade, concurrent software on modern Java. Master object-oriented principles, Spring Boot dependency injection, JPA/Hibernate persistence, and unit test suites with JUnit.',
        true,
        15
    ),
    (
        '11111111-1111-1111-1111-111111111116',
        'machine-learning',
        'Machine Learning',
        'Engineer end-to-end ML training and evaluation workflows. Explore supervised algorithms, gradient boosting, neural networks in PyTorch, hyperparameter tuning, and model export pipelines.',
        true,
        16
    ),
    (
        '11111111-1111-1111-1111-111111111117',
        'python-programming',
        'Python Programming',
        'Write idiomatic, modular, and asynchronous Python applications. Build high-speed APIs with FastAPI, automate data extraction and workflow scripts, and adhere to strict PEP8 and typing standards.',
        true,
        17
    ),
    (
        '11111111-1111-1111-1111-111111111118',
        'robotics-and-information',
        'Robotics and Information',
        'Investigate robotic operating systems (ROS), robotic kinematics, sensor fusion algorithms, and computer vision integration for autonomous mobile and arm manipulation simulations.',
        true,
        18
    ),
    (
        '11111111-1111-1111-1111-111111111119',
        'ui-ux-design',
        'UI/UX Design',
        'Craft intuitive, human-centered digital experiences. Conduct user research, define wireframes and interactive prototypes in Figma, and build scalable design systems with tokenized specifications.',
        true,
        19
    )
ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    sort_order = EXCLUDED.sort_order;

-- ============================================================================
-- 14. SEED INITIAL ACTIVE COHORT (Required by Application & Portal flow)
-- ============================================================================
INSERT INTO public.cohorts (
    id,
    name,
    start_date,
    end_date,
    application_deadline,
    capacity,
    fee_minor_units,
    currency,
    status,
    terms_version
)
VALUES (
    '33333333-3333-3333-3333-333333333301',
    'Cohort 2026-Alpha (Premier Studio)',
    CURRENT_DATE + INTERVAL '30 days',
    CURRENT_DATE + INTERVAL '90 days',
    CURRENT_DATE + INTERVAL '20 days',
    50,
    0,
    'INR',
    'open',
    '1.0'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    status = 'open';

-- ============================================================================
-- 15. PUBLIC INTERNSHIP APPLICATIONS (UNAUTHENTICATED INTAKE)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.internship_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_id TEXT NOT NULL UNIQUE,
    domain_id UUID NOT NULL REFERENCES public.internship_domains(id) ON DELETE RESTRICT,
    domain_name TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    course_or_degree TEXT NOT NULL,
    branch_specialization TEXT,
    institution_name TEXT NOT NULL,
    graduation_year TEXT,
    skills TEXT,
    portfolio_url TEXT,
    resume_path TEXT,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'selected', 'not_selected')),
    selection_email_status TEXT NOT NULL DEFAULT 'pending' CHECK (selection_email_status IN ('pending', 'sent', 'failed')),
    offer_letter_status TEXT NOT NULL DEFAULT 'pending' CHECK (offer_letter_status IN ('pending', 'generated', 'delivered', 'failed')),
    offer_letter_path TEXT,
    owner_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_internship_apps_email ON public.internship_applications (lower(email));
CREATE INDEX IF NOT EXISTS idx_internship_apps_domain ON public.internship_applications (domain_id);
CREATE INDEX IF NOT EXISTS idx_internship_apps_status ON public.internship_applications (status);
CREATE INDEX IF NOT EXISTS idx_internship_apps_created ON public.internship_applications (created_at DESC);

CREATE TABLE IF NOT EXISTS public.application_email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES public.internship_applications(id) ON DELETE CASCADE,
    recipient_email TEXT NOT NULL,
    email_type TEXT NOT NULL CHECK (email_type IN ('application_received', 'selection_offer', 'status_update')),
    provider TEXT NOT NULL DEFAULT 'resend',
    delivery_status TEXT NOT NULL CHECK (delivery_status IN ('queued', 'sent', 'failed')),
    provider_message_id TEXT,
    error_message TEXT,
    payload_snapshot JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_app_email_logs_app ON public.application_email_logs (application_id);

ALTER TABLE public.internship_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_email_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "internship_apps_admin_select" ON public.internship_applications;
CREATE POLICY "internship_apps_admin_select" ON public.internship_applications
    FOR SELECT TO authenticated
    USING (public.is_admin());

DROP POLICY IF EXISTS "internship_apps_admin_update" ON public.internship_applications;
CREATE POLICY "internship_apps_admin_update" ON public.internship_applications
    FOR UPDATE TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "internship_apps_admin_delete" ON public.internship_applications;
CREATE POLICY "internship_apps_admin_delete" ON public.internship_applications
    FOR DELETE TO authenticated
    USING (public.is_admin());

DROP POLICY IF EXISTS "email_logs_admin_all" ON public.application_email_logs;
CREATE POLICY "email_logs_admin_all" ON public.application_email_logs
    FOR ALL TO authenticated
    USING (public.is_admin());

REVOKE ALL ON TABLE public.internship_applications FROM public, anon;
REVOKE ALL ON TABLE public.application_email_logs FROM public, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.internship_applications TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.application_email_logs TO service_role;

CREATE OR REPLACE FUNCTION public.submit_public_application(
    p_domain_id UUID,
    p_full_name TEXT,
    p_email TEXT,
    p_course_or_degree TEXT,
    p_institution_name TEXT,
    p_branch_specialization TEXT DEFAULT NULL,
    p_phone TEXT DEFAULT NULL,
    p_graduation_year TEXT DEFAULT NULL,
    p_skills TEXT DEFAULT NULL,
    p_portfolio_url TEXT DEFAULT NULL,
    p_resume_path TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_clean_name TEXT;
    v_clean_email TEXT;
    v_domain_name TEXT;
    v_ref_id TEXT;
    v_new_id UUID;
    v_existing_id UUID;
    v_existing_ref TEXT;
BEGIN
    v_clean_name := trim(p_full_name);
    v_clean_email := lower(trim(p_email));

    IF length(v_clean_name) < 2 THEN
        RAISE EXCEPTION 'Full name must contain at least 2 characters.';
    END IF;

    IF v_clean_email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RAISE EXCEPTION 'Please provide a valid email address.';
    END IF;

    IF length(trim(p_course_or_degree)) < 2 THEN
        RAISE EXCEPTION 'Course or degree is required.';
    END IF;

    IF length(trim(p_institution_name)) < 2 THEN
        RAISE EXCEPTION 'College or university name is required.';
    END IF;

    SELECT name INTO v_domain_name
    FROM public.internship_domains
    WHERE id = p_domain_id AND is_active = true;

    IF v_domain_name IS NULL THEN
        RAISE EXCEPTION 'Selected internship domain is invalid or inactive.';
    END IF;

    SELECT id, reference_id INTO v_existing_id, v_existing_ref
    FROM public.internship_applications
    WHERE lower(email) = v_clean_email
      AND domain_id = p_domain_id
      AND created_at > (timezone('utc'::text, now()) - INTERVAL '24 hours')
    ORDER BY created_at DESC
    LIMIT 1;

    IF v_existing_id IS NOT NULL THEN
        RETURN jsonb_build_object(
            'success', true,
            'is_duplicate', true,
            'application_id', v_existing_id,
            'reference_id', v_existing_ref,
            'domain_name', v_domain_name,
            'message', 'An application for this domain was already received recently. Your existing reference ID is ' || v_existing_ref || '.'
        );
    END IF;

    v_ref_id := 'QLX-2026-APP-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));

    INSERT INTO public.internship_applications (
        reference_id,
        domain_id,
        domain_name,
        full_name,
        email,
        phone,
        course_or_degree,
        branch_specialization,
        institution_name,
        graduation_year,
        skills,
        portfolio_url,
        resume_path,
        status,
        selection_email_status,
        offer_letter_status
    )
    VALUES (
        v_ref_id,
        p_domain_id,
        v_domain_name,
        v_clean_name,
        v_clean_email,
        nullif(trim(p_phone), ''),
        trim(p_course_or_degree),
        nullif(trim(p_branch_specialization), ''),
        trim(p_institution_name),
        nullif(trim(p_graduation_year), ''),
        nullif(trim(p_skills), ''),
        nullif(trim(p_portfolio_url), ''),
        nullif(trim(p_resume_path), ''),
        'submitted',
        'pending',
        'pending'
    )
    RETURNING id INTO v_new_id;

    RETURN jsonb_build_object(
        'success', true,
        'is_duplicate', false,
        'application_id', v_new_id,
        'reference_id', v_ref_id,
        'domain_name', v_domain_name,
        'message', 'Application submitted successfully.'
    );
END;
$$;

REVOKE ALL ON FUNCTION public.submit_public_application FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_public_application TO anon, authenticated;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'storage' AND table_name = 'objects') THEN
        DROP POLICY IF EXISTS "resumes_public_upload" ON storage.objects;
        CREATE POLICY "resumes_public_upload" ON storage.objects
            FOR INSERT TO anon, authenticated
            WITH CHECK (
                bucket_id = 'resumes'
                AND (lower(storage.extension(name)) = 'pdf' OR name LIKE '%.pdf')
            );
    END IF;
END $$;

-- ============================================================================
-- 16. AUTOMATIC SELECTION EMAIL TRIGGER & APP SECRETS (NATIVE PG_NET)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

ALTER TABLE public.internship_applications ADD COLUMN IF NOT EXISTS selected_at TIMESTAMPTZ;

ALTER TABLE public.internship_applications DROP CONSTRAINT IF EXISTS internship_applications_status_check;
ALTER TABLE public.internship_applications ADD CONSTRAINT internship_applications_status_check
    CHECK (lower(trim(status)) IN ('submitted', 'under_review', 'under review', 'selected', 'not_selected', 'not selected'));

ALTER TABLE public.internship_applications DROP CONSTRAINT IF EXISTS internship_applications_selection_email_status_check;
ALTER TABLE public.internship_applications ADD CONSTRAINT internship_applications_selection_email_status_check
    CHECK (selection_email_status IN ('pending', 'queued', 'sent', 'failed'));

CREATE TABLE IF NOT EXISTS public.app_secrets (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.app_secrets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Deny all public access to app_secrets" ON public.app_secrets;
CREATE POLICY "Deny all public access to app_secrets"
ON public.app_secrets FOR ALL
TO anon, authenticated
USING (false);

CREATE OR REPLACE FUNCTION public.trg_send_selection_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    v_resend_key TEXT;
    v_sender_email TEXT;
    v_offer_letter_url TEXT;
    v_html_body TEXT;
    v_request_id BIGINT;
    v_formatted_date TEXT;
    v_attachments JSONB := '[]'::jsonb;
BEGIN
    NEW.status := lower(trim(NEW.status));
    IF NEW.status = 'under review' THEN NEW.status := 'under_review'; END IF;
    IF NEW.status = 'not selected' THEN NEW.status := 'not_selected'; END IF;

    IF NEW.status = 'selected' 
       AND (
           (lower(trim(coalesce(OLD.status, ''))) IS DISTINCT FROM 'selected')
           OR (NEW.selection_email_status = 'pending' AND lower(trim(coalesce(OLD.status, ''))) = 'selected')
       )
       AND (NEW.selection_email_status IS DISTINCT FROM 'sent') 
    THEN
        SELECT value INTO v_resend_key FROM public.app_secrets WHERE key = 'resend_api_key';
        SELECT value INTO v_sender_email FROM public.app_secrets WHERE key = 'sender_email';

        IF v_sender_email IS NULL OR v_sender_email = '' THEN
            v_sender_email := 'Quiclogix Admissions <admissions@quiclogix.com>';
        END IF;

        IF NEW.offer_letter_path IS NOT NULL AND trim(NEW.offer_letter_path) <> '' THEN
            v_offer_letter_url := trim(NEW.offer_letter_path);
        ELSE
            SELECT value INTO v_offer_letter_url FROM public.app_secrets WHERE key = 'offer_letter_url';
            IF v_offer_letter_url IS NULL OR v_offer_letter_url = '' THEN
                v_offer_letter_url := 'https://xobdcbcocurmwhuelfji.supabase.co/storage/v1/object/public/documents/quiclogix%20offer%20letter.pdf';
            END IF;
            NEW.offer_letter_path := v_offer_letter_url;
        END IF;

        IF v_resend_key IS NULL OR v_resend_key = '' OR v_resend_key = 're_your_api_key_here' THEN
            RAISE WARNING 'Resend API Key is not configured in public.app_secrets. Email dispatch skipped.';
            NEW.selection_email_status := 'queued';
            NEW.offer_letter_status := 'generated';
            NEW.selected_at := now();
            NEW.updated_at := now();
            RETURN NEW;
        END IF;

        v_formatted_date := to_char(now(), 'FMDD Month YYYY');

        IF v_offer_letter_url IS NOT NULL AND v_offer_letter_url <> '' THEN
            v_attachments := jsonb_build_array(
                jsonb_build_object(
                    'filename', 'Quiclogix_Offer_Letter_' || replace(coalesce(NEW.reference_id, 'Candidate'), ' ', '_') || '.pdf',
                    'path', v_offer_letter_url
                )
            );
        END IF;

        v_html_body := '<!DOCTYPE html><html><head><meta charset="utf-8">'
            || '<style>'
            || 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; background-color: #f4f6f5; margin: 0; padding: 24px; color: #111613; }'
            || '.letter-card { max-width: 650px; margin: 0 auto; background: #ffffff; border: 1px solid #e0dad0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }'
            || '.letter-head { background: #D8B437; padding: 24px 32px; border-bottom: 4px solid #111613; }'
            || '.company-name { font-size: 22px; font-weight: 800; color: #111613; margin: 0; }'
            || '.company-info { font-size: 12px; color: #222222; margin: 6px 0 0 0; line-height: 1.4; }'
            || '.letter-content { padding: 36px 32px; line-height: 1.6; font-size: 15px; color: #222222; }'
            || '.letter-title { font-size: 20px; font-weight: 800; font-style: italic; text-align: center; margin: 0 0 28px 0; color: #111613; letter-spacing: 0.05em; }'
            || '.meta-table { width: 100%; margin-bottom: 24px; font-size: 14px; border-collapse: collapse; }'
            || '.meta-table td { padding: 4px 0; }'
            || '.meta-label { font-weight: 700; width: 120px; color: #111613; }'
            || '.meta-val { color: #333333; }'
            || '.btn-box { text-align: center; margin: 30px 0; }'
            || '.btn-download { display: inline-block; background: #111613; color: #D8B437 !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; font-size: 14px; letter-spacing: 0.02em; border: 1px solid #D8B437; }'
            || '.btn-sub { font-size: 12px; color: #738078; margin-top: 8px; }'
            || '.signoff { margin-top: 36px; line-height: 1.5; font-size: 14px; }'
            || '.letter-footer { background: #fafafa; border-top: 1px solid #eeeeee; padding: 18px 32px; font-size: 11px; color: #738078; text-align: center; }'
            || '</style></head><body>'
            || '<div class="letter-card">'
            || '<div class="letter-head">'
            || '<h1 class="company-name">Quiclogix Solutions Private Limited</h1>'
            || '<div class="company-info">'
            || 'Registered address: 385, Gali-05, Adarsh colony, Biharipura, Ghaziabad, Uttar Pradesh-201009<br>'
            || '<strong>CIN:</strong> U62099UP2026PTC242887 &nbsp;|&nbsp; <strong>Web:</strong> www.quiclogix.com &nbsp;|&nbsp; <strong>Contact:</strong> contact@quiclogix.com'
            || '</div>'
            || '</div>'
            || '<div class="letter-content">'
            || '<div class="letter-title">Internship Offer Letter</div>'
            || '<table class="meta-table">'
            || '<tr><td class="meta-label">Date:</td><td class="meta-val">' || v_formatted_date || '</td></tr>'
            || '<tr><td class="meta-label">Intern ID:</td><td class="meta-val"><strong>' || coalesce(NEW.reference_id, 'QLX-REF') || '</strong></td></tr>'
            || '<tr><td class="meta-label">Name:</td><td class="meta-val">' || coalesce(NEW.full_name, 'Candidate') || '</td></tr>'
            || '<tr><td class="meta-label">Domain:</td><td class="meta-val"><strong>' || coalesce(NEW.domain_name, 'Technology') || '</strong></td></tr>'
            || '</table>'
            || '<p>Dear <strong>' || coalesce(NEW.full_name, 'Intern') || '</strong>,</p>'
            || '<p>Congratulations! We are pleased to welcome you to Quiclogix as an intern in <strong>' || coalesce(NEW.domain_name, 'your chosen domain') || '</strong>.</p>'
            || '<p>This internship will provide you with hands-on project experience, practical learning, and mentorship to enhance your technical skills.</p>'
            || '<p>Upon successful completion of the internship and fulfilment of program requirements, you will receive an <strong>Internship Completion Certificate</strong> and <strong>Letter of Recommendation (LOR)</strong>.</p>'
            || '<p>We wish you a valuable and successful learning experience with Quiclogix.</p>'
            || '<div class="btn-box">'
            || '<a href="' || v_offer_letter_url || '" target="_blank" class="btn-download">📄 Download Your Official Signed Offer Letter (PDF)</a>'
            || '<div class="btn-sub">Your personalized signed offer letter is also attached directly to this email.</div>'
            || '</div>'
            || '<div class="signoff">'
            || 'Warm regards,<br><em>Sincerely,</em><br><br>'
            || '<strong>Pushpendra singh</strong><br>'
            || 'Founder &amp; CEO<br>'
            || '<strong>Quiclogix Solutions Private Limited</strong>'
            || '</div>'
            || '</div>'
            || '<div class="letter-footer">'
            || 'Official Offer Dispatch &bull; Reference ID: ' || coalesce(NEW.reference_id, 'QLX') || ' &bull; Quiclogix Solutions'
            || '</div>'
            || '</div></body></html>';

        SELECT net.http_post(
            url := 'https://api.resend.com/emails',
            headers := jsonb_build_object(
                'Content-Type', 'application/json',
                'Authorization', 'Bearer ' || v_resend_key
            ),
            body := jsonb_build_object(
                'from', v_sender_email,
                'to', jsonb_build_array(NEW.email),
                'subject', 'Internship Selection Notification & Offer Letter — ' || coalesce(NEW.reference_id, 'Quiclogix'),
                'html', v_html_body,
                'attachments', v_attachments
            )
        ) INTO v_request_id;

        INSERT INTO public.application_email_logs (
            application_id,
            recipient_email,
            email_type,
            provider,
            delivery_status,
            payload_snapshot
        ) VALUES (
            NEW.id,
            NEW.email,
            'selection_offer',
            'resend_pg_net',
            'sent',
            jsonb_build_object(
                'reference_id', NEW.reference_id,
                'domain_name', NEW.domain_name,
                'offer_letter_url', v_offer_letter_url,
                'request_id', v_request_id
            )
        );

        NEW.selection_email_status := 'sent';
        NEW.offer_letter_status := 'delivered';
        NEW.selected_at := now();
        NEW.updated_at := now();

    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_on_applicant_selected ON public.internship_applications;
CREATE TRIGGER trg_on_applicant_selected
BEFORE UPDATE ON public.internship_applications
FOR EACH ROW
EXECUTE FUNCTION public.trg_send_selection_email();



