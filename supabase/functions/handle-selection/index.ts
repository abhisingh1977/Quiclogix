// Supabase Edge Function: handle-selection
// Triggered when an application transitions to 'selected' in Supabase Table Editor.
// Generates personalized offer letter and dispatches selection email with idempotency protection.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { generateOfferLetterHtml } from './offerTemplate.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: 'Supabase server environment variables not configured.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const body = await req.json();
    const applicationId = body.application_id || body.record?.id;

    if (!applicationId) {
      return new Response(
        JSON.stringify({ error: 'Missing application_id in request body.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 1. Fetch candidate application record
    const { data: app, error: appError } = await supabase
      .from('internship_applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (appError || !app) {
      return new Response(
        JSON.stringify({ error: `Application not found: ${appError?.message || 'Invalid ID'}` }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Validate selection status
    if (app.status !== 'selected') {
      return new Response(
        JSON.stringify({
          error: `Application status is '${app.status}'. Offer letter can only be generated for 'selected' status.`,
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Idempotency Check: Prevent duplicate offer letter dispatch
    if (app.selection_email_status === 'sent') {
      return new Response(
        JSON.stringify({
          message: 'Selection email was already dispatched previously. Duplicate send prevented.',
          reference_id: app.reference_id,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Generate Personalized Offer Letter HTML
    const selectionDateFormatted = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const offerHtml = generateOfferLetterHtml({
      candidateName: app.full_name,
      referenceId: app.reference_id,
      domainName: app.domain_name,
      selectionDate: selectionDateFormatted,
    });

    // 5. Send selection email via email provider if key is supplied
    if (resendApiKey) {
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: 'Quiclogix Admissions <admissions@quiclogix.com>',
          to: [app.email],
          subject: `Internship Selection Notification & Offer Letter — ${app.reference_id}`,
          html: offerHtml,
        }),
      });

      if (!emailRes.ok) {
        const errorText = await emailRes.text();
        // Log delivery failure safely without deleting the application
        await supabase.from('application_email_logs').insert({
          application_id: app.id,
          recipient_email: app.email,
          email_type: 'selection_offer',
          provider: 'resend',
          delivery_status: 'failed',
          error_message: errorText,
          payload_snapshot: { reference_id: app.reference_id, domain_name: app.domain_name },
        });

        await supabase
          .from('internship_applications')
          .update({
            selection_email_status: 'failed',
            offer_letter_status: 'generated',
            updated_at: new Date().toISOString(),
          })
          .eq('id', app.id);

        return new Response(
          JSON.stringify({
            error: 'Email provider rejected dispatch.',
            details: errorText,
          }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const emailData = await emailRes.json();

      // Record successful delivery audit log
      await supabase.from('application_email_logs').insert({
        application_id: app.id,
        recipient_email: app.email,
        email_type: 'selection_offer',
        provider: 'resend',
        delivery_status: 'sent',
        provider_message_id: emailData.id,
        payload_snapshot: { reference_id: app.reference_id, domain_name: app.domain_name },
      });

      await supabase
        .from('internship_applications')
        .update({
          selection_email_status: 'sent',
          offer_letter_status: 'delivered',
          updated_at: new Date().toISOString(),
        })
        .eq('id', app.id);

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Selection email and offer letter successfully delivered to candidate.',
          reference_id: app.reference_id,
          provider_message_id: emailData.id,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 6. When RESEND_API_KEY is not yet supplied: record pending status honestly
    await supabase.from('application_email_logs').insert({
      application_id: app.id,
      recipient_email: app.email,
      email_type: 'selection_offer',
      provider: 'resend',
      delivery_status: 'queued',
      error_message: 'RESEND_API_KEY secret not yet set in Supabase project secrets.',
      payload_snapshot: { reference_id: app.reference_id, domain_name: app.domain_name },
    });

    await supabase
      .from('internship_applications')
      .update({
        selection_email_status: 'pending',
        offer_letter_status: 'generated',
        updated_at: new Date().toISOString(),
      })
      .eq('id', app.id);

    return new Response(
      JSON.stringify({
        success: true,
        message:
          'Offer letter generated. Email delivery queued pending RESEND_API_KEY configuration in Supabase Dashboard (Settings -> Edge Functions -> Secrets).',
        reference_id: app.reference_id,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
