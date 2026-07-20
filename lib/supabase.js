import { createBrowserClient } from "@supabase/ssr";

let browserClient = null;

export const createSupabaseBrowserClient = () => {
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISH_KEY,
    );
  }
  return browserClient;
};

// convenience shortcut
export const supabase = createSupabaseBrowserClient();