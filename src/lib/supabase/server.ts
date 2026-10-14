/// <reference types="node" />

import { createServerClient } from "@supabase/ssr";
import { getCookies, setCookie, setResponseHeader } from "@tanstack/react-start/server";

/**
 * Create this per request from a TanStack Start server function or server route.
 * Returns null while Supabase is unconfigured, without reading request cookies.
 */
export function createSupabaseServerClient() {
  const url = process.env["VITE_SUPABASE_URL"];
  const publishableKey = process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

  if (!url || !publishableKey) return null;

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return Object.entries(getCookies()).map(([name, value]) => ({ name, value }));
      },
      setAll(cookies, headers) {
        for (const { name, value, options } of cookies) {
          setCookie(name, value, options);
        }
        for (const [name, value] of Object.entries(headers ?? {})) {
          setResponseHeader(name, value);
        }
      },
    },
  });
}
