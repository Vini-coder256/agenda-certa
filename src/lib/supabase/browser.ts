import { createBrowserClient } from "@supabase/ssr";

/**
 * Returns null until the public Supabase URL and publishable key are configured.
 * Call this only from browser code; creating the client does not make a request.
 */
export function createSupabaseBrowserClient() {
  if (typeof window === "undefined") return null;

  const url = import.meta.env["VITE_SUPABASE_URL"];
  const publishableKey = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

  if (!url || !publishableKey) return null;

  return createBrowserClient(url, publishableKey);
}
