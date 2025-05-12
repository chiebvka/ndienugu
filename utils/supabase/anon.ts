import { createBrowserClient } from '@supabase/ssr'; // Or appropriate client

export function createAnonClient() {
  return createBrowserClient( // Or createClient if not in a browser/component context but a route handler that needs anon
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}