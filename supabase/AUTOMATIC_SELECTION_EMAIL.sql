-- =============================================================================
-- AUTOMATIC SELECTION EMAIL TRIGGER & OFFER LETTER DISPATCH
-- Quiclogix Solutions — Public Internship Application System
-- =============================================================================
-- This script enables 100% automatic email sending directly from Supabase.
-- You do NOT need Edge Functions or the Supabase CLI.
-- Whenever you change an applicant's status to 'selected' in the Table Editor,
-- this trigger will automatically send their Offer Letter email via Resend!
-- =============================================================================

-- 1. Enable the pg_net extension (built-in networking for Supabase)
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- 2. Secure Configuration Table for your Email Credentials
-- Only accessible to postgres/service role (blocked from public / anon users)
CREATE TABLE IF NOT EXISTS public.app_secrets (
    key text PRIMARY KEY,
    value text NOT NULL,
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.app_secrets ENABLE ROW LEVEL SECURITY;

-- Block public / anon access completely
DROP POLICY IF EXISTS "Deny all public access to app_secrets" ON public.app_secrets;
CREATE POLICY "Deny all public access to app_secrets"
ON public.app_secrets FOR ALL
TO anon, authenticated
USING (false);

-- 2. Insert or update your Resend configuration & Offer Letter PDF URL
-- IMPORTANT: Replace 'YOUR_RESEND_API_KEY' with your actual Resend API key in your Supabase SQL editor
INSERT INTO public.app_secrets (key, value)
VALUES 
    ('resend_api_key', 'YOUR_RESEND_API_KEY'),
    ('sender_email', 'Quiclogix Admissions <admissions@quiclogix.com>'),
    ('offer_letter_url', 'https://xobdcbcocurmwhuelfji.supabase.co/storage/v1/object/public/documents/quiclogix%20offer%20letter.pdf')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

-- 3. Ensure selected_at and offer_letter_path columns exist
ALTER TABLE public.internship_applications ADD COLUMN IF NOT EXISTS selected_at TIMESTAMPTZ;
ALTER TABLE public.internship_applications ADD COLUMN IF NOT EXISTS offer_letter_path TEXT;

ALTER TABLE public.internship_applications DROP CONSTRAINT IF EXISTS internship_applications_status_check;
ALTER TABLE public.internship_applications ADD CONSTRAINT internship_applications_status_check
    CHECK (lower(trim(status)) IN ('submitted', 'under_review', 'under review', 'selected', 'not_selected', 'not selected'));

ALTER TABLE public.internship_applications DROP CONSTRAINT IF EXISTS internship_applications_selection_email_status_check;
ALTER TABLE public.internship_applications ADD CONSTRAINT internship_applications_selection_email_status_check
    CHECK (selection_email_status IN ('pending', 'queued', 'sent', 'failed'));

-- 4. Trigger Function: Automatically Cleans Status, Builds Offer Letter with PDF Attachment & Download Link
CREATE OR REPLACE FUNCTION public.trg_send_selection_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    v_resend_key text;
    v_sender_email text;
    v_offer_letter_url text;
    v_html_body text;
    v_request_id bigint;
    v_formatted_date text;
    v_attachments jsonb := '[]'::jsonb;
BEGIN
    -- Automatically sanitize and normalize status (removes accidental spaces and lowercases)
    NEW.status := lower(trim(NEW.status));
    IF NEW.status = 'under review' THEN NEW.status := 'under_review'; END IF;
    IF NEW.status = 'not selected' THEN NEW.status := 'not_selected'; END IF;

    -- Check if status is transitioning to 'selected' or if resend was requested (selection_email_status set to 'pending')
    IF NEW.status = 'selected' 
       AND (
           (lower(trim(coalesce(OLD.status, ''))) IS DISTINCT FROM 'selected')
           OR (NEW.selection_email_status = 'pending' AND lower(trim(coalesce(OLD.status, ''))) = 'selected')
       )
       AND (NEW.selection_email_status IS DISTINCT FROM 'sent') 
    THEN
        -- Retrieve credentials from secure app_secrets table
        SELECT value INTO v_resend_key FROM public.app_secrets WHERE key = 'resend_api_key';
        SELECT value INTO v_sender_email FROM public.app_secrets WHERE key = 'sender_email';

        -- Defaults if secrets are empty
        IF v_sender_email IS NULL OR v_sender_email = '' THEN
            v_sender_email := 'Quiclogix Admissions <admissions@quiclogix.com>';
        END IF;

        -- 1. PRIORITIZE CANDIDATE'S INDIVIDUAL CUSTOM OFFER LETTER PDF
        -- If you pasted the student's personalized PDF link in the row, use it!
        IF NEW.offer_letter_path IS NOT NULL AND trim(NEW.offer_letter_path) <> '' THEN
            v_offer_letter_url := trim(NEW.offer_letter_path);
        ELSE
            -- 2. Fall back to default template if no individual PDF was uploaded
            SELECT value INTO v_offer_letter_url FROM public.app_secrets WHERE key = 'offer_letter_url';
            IF v_offer_letter_url IS NULL OR v_offer_letter_url = '' THEN
                v_offer_letter_url := 'https://xobdcbcocurmwhuelfji.supabase.co/storage/v1/object/public/documents/quiclogix%20offer%20letter.pdf';
            END IF;
            -- Save the fallback URL into the student record
            NEW.offer_letter_path := v_offer_letter_url;
        END IF;

        -- Check if API key has been filled in
        IF v_resend_key IS NULL OR v_resend_key = '' OR v_resend_key = 're_your_api_key_here' THEN
            RAISE WARNING 'Resend API Key is not configured in public.app_secrets. Email dispatch skipped.';
            NEW.selection_email_status := 'queued';
            NEW.offer_letter_status := 'generated';
            NEW.selected_at := now();
            NEW.updated_at := now();
            RETURN NEW;
        END IF;

        -- Format date (e.g. October 20, 2026)
        v_formatted_date := to_char(now(), 'FMDD Month YYYY');

        -- Build attachments array for Resend with the custom PDF
        IF v_offer_letter_url IS NOT NULL AND v_offer_letter_url <> '' THEN
            v_attachments := jsonb_build_array(
                jsonb_build_object(
                    'filename', 'Quiclogix_Offer_Letter_' || replace(coalesce(NEW.reference_id, 'Candidate'), ' ', '_') || '.pdf',
                    'path', v_offer_letter_url
                )
            );
        END IF;

        -- Construct the Official Quiclogix Solutions Offer Letter HTML
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

        -- Asynchronously send the email with attachment using pg_net.http_post
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

        -- Record audit log in public.application_email_logs
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

        -- Update applicant status fields
        NEW.selection_email_status := 'sent';
        NEW.offer_letter_status := 'delivered';
        NEW.selected_at := now();
        NEW.updated_at := now();

    END IF;

    RETURN NEW;
END;
$$;

-- 4. Attach Trigger to internship_applications
DROP TRIGGER IF EXISTS trg_on_applicant_selected ON public.internship_applications;
CREATE TRIGGER trg_on_applicant_selected
BEFORE UPDATE ON public.internship_applications
FOR EACH ROW
EXECUTE FUNCTION public.trg_send_selection_email();

-- 5. Verification Query: Confirm trigger installation
SELECT tgname, relname 
FROM pg_trigger 
JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid 
WHERE tgname = 'trg_on_applicant_selected';
