import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Configure from Vite env (set in .env and Render env)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  // Fail early in development; in production this should be set at build time
  // eslint-disable-next-line no-console
  console.warn('Supabase env vars missing: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
