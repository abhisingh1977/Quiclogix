// Supabase client instance for Quiclogix Solutions
// Provides typed client access and safe initialization handling.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database.types';

// Browser-safe environment variables
// Defaults provide production resilience for Vercel deployments before dashboard env variables are mapped.
const DEFAULT_SUPABASE_URL = 'https://xobdcbcocurmwhuelfji.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvYmRjYmNvY3VybXdodWVsZmppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxNTMxOTMsImV4cCI6MjEwNzcyOTE5M30.0RX7Rsiydl3MIPLZObg703x8A3mvus52AiEiHcHYrv4';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseUrl =
  rawUrl && !rawUrl.includes('your-project-id') && rawUrl.trim() !== ''
    ? rawUrl.trim()
    : DEFAULT_SUPABASE_URL;

const supabaseAnonKey =
  rawAnonKey && !rawAnonKey.includes('your-anon-public-key') && rawAnonKey.trim() !== ''
    ? rawAnonKey.trim()
    : DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-anon-public-key') &&
  supabaseUrl.trim() !== '' &&
  supabaseAnonKey.trim() !== ''
);

let clientInstance: SupabaseClient<Database> | null = null;

/**
 * Returns the typed Supabase client singleton.
 * If credentials are not configured in local environment, returns null or logs a clear warning.
 */
export function getSupabaseClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured) {
    return null;
  }

  if (!clientInstance) {
    clientInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return clientInstance;
}

/**
 * Convenience export of the client.
 * For use in environments where Supabase credentials are known to be set.
 */
export const supabase = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
