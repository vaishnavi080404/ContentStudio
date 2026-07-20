// app/page.jsx
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import AnimatedHeading from "@/components/Animationheading";
import EditorCanvas from "@/components/EditorCanvas";
import RoundImageCarousel from "@/components/RoundImageCarousel";
import Link from "next/link";
import { RippleButton } from "@/components/ui/ripple-button";
import { RainbowButton } from "@/components/ui/rainbow-button";

// server-side check — runs on the server before the page renders, so there's
// no flash of the wrong destination and no client-side redirect needed
async function getIsLoggedIn() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISH_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {}, // read-only here, this page never needs to refresh the session
      },
    }
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return !!user;
}

export default async function HomePage() {
  const isLoggedIn = await getIsLoggedIn();
  // any CTA that means "go make a design" should gate through login first —
  // "Sign in" itself always goes to /login regardless of auth state
  const ctaHref = isLoggedIn ? "/templates" : "/login";

  return (
    <main className="bg-[#0a0a0f]">
      {/* ---------- HERO ---------- */}
      <div className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <EditorCanvas />
        </div>

        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(10,10,15,0.92)_0%,rgba(10,10,15,0.3)_50%,rgba(10,10,15,0.1)_100%)]"
        />

        <nav className="absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b border-white/[6%] bg-[#0a0a0f]/40 px-10 py-5 backdrop-blur-md">
          <span className="font-sans text-lg font-bold tracking-[-0.02em] text-white">
            Content<span className="text-[#7c5cff]">Studio</span>
          </span>
          <div className="flex gap-2">
            {/* only show "Sign in" if not already logged in — no point offering it otherwise */}
            {!isLoggedIn && (
              <Link href="/login">
                <RainbowButton>Sign in</RainbowButton>
              </Link>
            )}

            <Link
              href={ctaHref}
              className="rounded-lg bg-[#7c5cff] px-[18px] py-2 font-sans text-[13px] font-semibold text-white no-underline"
            >
              Start designing →
            </Link>
          </div>
        </nav>

        <div className="absolute -bottom-10 left-0 right-0 z-10 max-w-[680px] px-10 pb-[60px]">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[#7c5cff]/35 bg-[#7c5cff]/[12%] px-3 py-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#7c5cff]" />
            <span className="font-sans text-[11px] font-medium tracking-[0.06em] text-[#a78bfa]">
              WATCH IT BUILD ITSELF
            </span>
          </div>

          <h1 className="mb-4 font-sans text-[clamp(36px,5vw,64px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-white">
            Design anything. <br />
            <span className="text-[#7c5cff]">In seconds.</span>
          </h1>

          <p className="mb-7 max-w-[440px] font-sans text-[17px] leading-[1.6] text-white/50">
            Describe your design — banner, card, post — and watch AI place every
            element live on the canvas. Then edit anything yourself.
          </p>

          <div className="flex gap-3">
            <Link href={ctaHref}>
              <RippleButton className="rounded-xl border-violet-400 bg-violet-600 px-7 py-4 font-semibold text-white shadow-[0_0_40px_rgba(124,92,255,0.4)] hover:bg-violet-700">
                Start for free
              </RippleButton>
            </Link>
            <Link href={ctaHref}>
              <RainbowButton className="h-auto p-[18px] font-sans text-[13px] font-semibold no-underline">
                Browse templates
              </RainbowButton>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-[60px] right-10 z-10 flex flex-col gap-4">
          {[
            { n: "70+", label: "shape variants" },
            { n: "100+", label: "Google Fonts" },
            { n: "∞", label: "AI generations" },
          ].map(({ n, label }) => (
            <div key={label} className="text-right">
              <p className="m-0 font-sans text-xl font-bold text-white">{n}</p>
              <p className="m-0 font-sans text-[11px] text-white/30">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- TEMPLATE CAROUSEL ---------- */}
      <section className="bg-[#0a0a0f] px-10 py-20">
        <div className="mb-12 text-center">
          <AnimatedHeading className="mb-3 font-sans text-[clamp(28px,3.5vw,42px)] font-extrabold tracking-[-0.02em] text-white">
            Start from a template
          </AnimatedHeading>
          <p className="m-0 font-sans text-base text-white/50">
            Every design here started from one of these.
          </p>
        </div>
        <RoundImageCarousel
            // images={TEMPLATE_IMAGES}
            imageWidth={450}
            imageHeight={280}
            speed={2.5}
            tilt={-4}
            background="transparent"
            cornerRadius={16}
          />
        </section>

      {/* ---------- CLOSING CTA ---------- */}
      <section className="relative overflow-hidden bg-[#0a0a0f] px-10 py-24 text-center">
        {/* soft radial glow — same violet accent as the hero, ties the ending back to the opening */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,92,255,0.15),transparent_60%)]" />

        <div className="relative mx-auto max-w-2xl">
          <h2 className="mb-4 font-sans text-[clamp(28px,4vw,48px)] font-extrabold tracking-[-0.02em] text-white">
            Ready to design something great?
          </h2>
          <p className="mb-8 font-sans text-base text-white/50">
            Jump into a template or start from a blank canvas — it only takes a few seconds.
          </p>
          <div className="flex justify-center">
  <Link href={ctaHref}>
    <RippleButton className="rounded-xl border-violet-400 bg-violet-600 px-8 py-4 font-semibold text-white shadow-[0_0_40px_rgba(124,92,255,0.4)] hover:bg-violet-700">
      Start designing →
    </RippleButton>
  </Link>
</div>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="border-t border-white/[6%] bg-[#0a0a0f] px-10 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <span className="font-sans text-sm font-bold text-white/70">
            Content<span className="text-[#7c5cff]">Studio</span>
          </span>
          <nav className="flex gap-6 font-sans text-sm text-white/50">
            <Link href="/templates" className="hover:text-white">
              Templates
            </Link>
            <Link href="/my-designs" className="hover:text-white">
              My Designs
            </Link>
            <Link href="/login" className="hover:text-white">
              Sign in
            </Link>
          </nav>
        </div>
        <p className="mt-6 text-center font-sans text-xs text-white/30">
          © {new Date().getFullYear()} ContentStudio. All rights reserved.
        </p>
      </footer>
    </main>
  );
}