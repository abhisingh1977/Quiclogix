-- Quiclogix Solutions — Public Internship Application System Schema & Functions
-- Migration: 20261020000000_public_application_system.sql
-- Description:
-- 1. Creates `public.internship_applications` table for direct, unauthenticated public intake.
-- 2. Eliminates client-side authentication requirements while maintaining strict Row Level Security.
-- 3. Implements secure `submit_public_application` RPC with server-side validation & rate-limiting.
-- 4. Creates audit log table `application_email_logs` for tracking selection notifications & offer letters.
-- 5. Enables private inspection for project owner via Supabase Table Editor.

-- ============================================================================
-- 1. PUBLIC INTERNSHIP APPLICATIONS TABLE
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

-- Indices for fast search, filter, and deduplication in Supabase Table Editor
CREATE INDEX IF NOT EXISTS idx_internship_apps_email ON public.internship_applications (lower(email));
CREATE INDEX IF NOT EXISTS idx_internship_apps_domain ON public.internship_applications (domain_id);
CREATE INDEX IF NOT EXISTS idx_internship_apps_status ON public.internship_applications (status);
CREATE INDEX IF NOT EXISTS idx_internship_apps_created ON public.internship_applications (created_at DESC);

-- ============================================================================
-- 2. AUDIT LOG FOR SELECTION & OFFER LETTER DELIVERY
-- ============================================================================

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

-- ============================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.internship_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_email_logs ENABLE ROW LEVEL SECURITY;

-- Anonymous and public users CANNOT SELECT application records (zero PII leakage)
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

-- Email logs are private to admin/service role
DROP POLICY IF EXISTS "email_logs_admin_all" ON public.application_email_logs;
CREATE POLICY "email_logs_admin_all" ON public.application_email_logs
    FOR ALL TO authenticated
    USING (public.is_admin());

-- Revoke raw public INSERT/UPDATE/DELETE
REVOKE ALL ON TABLE public.internship_applications FROM public, anon;
REVOKE ALL ON TABLE public.application_email_logs FROM public, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.internship_applications TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.application_email_logs TO service_role;

-- ============================================================================
-- 4. SECURE PUBLIC SUBMISSION RPC
-- ============================================================================

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
    v_existing_time TIMESTAMPTZ;
BEGIN
    -- 1. Sanitize string inputs
    v_clean_name := trim(p_full_name);
    v_clean_email := lower(trim(p_email));

    -- 2. Validate mandatory fields
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

    -- 3. Verify domain exists and is active
    SELECT name INTO v_domain_name
    FROM public.internship_domains
    WHERE id = p_domain_id AND is_active = true;

    IF v_domain_name IS NULL THEN
        RAISE EXCEPTION 'Selected internship domain is invalid or inactive.';
    END IF;

    -- 4. Duplicate prevention (check for submission in the last 24 hours for same email & domain)
    SELECT id, reference_id, created_at INTO v_existing_id, v_existing_ref, v_existing_time
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

    -- 5. Generate unique, human-readable reference ID: QLX-2026-APP-XXXXX
    v_ref_id := 'QLX-2026-APP-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));

    -- 6. Insert record with status 'submitted'
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

-- Grant execution to anonymous and authenticated users
REVOKE ALL ON FUNCTION public.submit_public_application FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_public_application TO anon, authenticated;

-- ============================================================================
-- 5. STORAGE POLICY FOR RESUME UPLOADS
-- ============================================================================

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'storage' AND table_name = 'objects') THEN
        -- Allow anonymous users to upload PDF resumes to 'resumes' bucket
        DROP POLICY IF EXISTS "resumes_public_upload" ON storage.objects;
        CREATE POLICY "resumes_public_upload" ON storage.objects
            FOR INSERT TO anon, authenticated
            WITH CHECK (
                bucket_id = 'resumes'
                AND (lower(storage.extension(name)) = 'pdf' OR name LIKE '%.pdf')
            );

        -- Disallow public read access on resumes
        DROP POLICY IF EXISTS "resumes_public_read_deny" ON storage.objects;
    END IF;
END $$;
