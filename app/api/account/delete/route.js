// app/api/account/delete/route.js
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  // this client reads the caller's own session cookie — it can only ever
  // tell us "who is making this request", it has no elevated privileges
  const supabaseAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISH_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {}, // no-op — this route doesn't need to refresh/write cookies
      },
    }
  );

  const {
    data: { user },
    error: authError,
  } = await supabaseAuth.auth.getUser();

  if (authError || !user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  // service-role client — only ever constructed server-side, only ever used
  // with the id we just verified above, never with a client-supplied id
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // clean up owned data first — skipping this leaves orphaned rows referencing
  // a user_id that no longer exists in auth.users
  const { error: designsError } = await supabaseAdmin
    .from("Designs")
    .delete()
    .eq("user_id", user.id);

  if (designsError) {
    return Response.json({ error: designsError.message }, { status: 500 });
  }

  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

  if (deleteError) {
    return Response.json({ error: deleteError.message }, { status: 500 });
  }

  return Response.json({ success: true });
}