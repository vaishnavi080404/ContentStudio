// app/api/thumbnail/upload/route.js
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { uploadThumbnail } from "@/lib/storage";

export async function POST(req) {
  
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISH_KEY,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { dataUrl, designId } = await req.json();

    if (!dataUrl || !designId) {
      return Response.json(
        { error: "Missing dataUrl or designId" },
        { status: 400 },
      );
    }

    const base64 = dataUrl.split(",")[1];
    const buffer = Buffer.from(base64, "base64");

    const key = `thumbnails/${user.id}/${designId}.png`;
    const url = await uploadThumbnail(buffer, key);

    return Response.json({ url });
  } catch (err) {
   
    console.error("Thumbnail upload route crashed:", err);
    return Response.json(
      { error: err.message || "Upload failed" },
      { status: 500 },
    );
  }
}
