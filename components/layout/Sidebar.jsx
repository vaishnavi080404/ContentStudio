"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Home, LayoutTemplate, Files, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

const sidebarItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Templates", href: "/templates", icon: LayoutTemplate },
  { label: "My Designs", href: "/my-designs", icon: Files },
  { label: "Settings", href: "/settings", icon: Settings },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [showEmail, setShowEmail] = useState(false); // hover or click reveals the email tooltip

  useEffect(() => {
    // grab whoever's currently logged in — this is what the avatar reflects
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    // keep it in sync if they log in/out without a full page reload
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const displayName = user?.user_metadata?.full_name || user?.email;
  const initial = displayName ? displayName[0].toUpperCase() : "?";

  return (
    <>
      {/* Tailwind has no built-in keyframes for these three, so they're defined
          once here and triggered below via arbitrary animate-[name_...] values */}
      <style>{`
        @keyframes spin-once {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes bob {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-4px); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.7); }
        }
      `}</style>

      <div className="relative z-20 flex min-h-screen w-[88px] flex-col items-center gap-1 border-r border-white/[6%] bg-[#0a0a0f] py-5 shadow-[4px_0_24px_rgba(0,0,0,0.4),inset_-1px_0_0_rgba(255,255,255,0.04)]">
        {/* logo mark */}
        <div className="mb-6 flex h-9 w-9 cursor-default items-center justify-center rounded-[10px] bg-gradient-to-br from-[#7c5cff] to-[#ff5cae] shadow-[0_4px_12px_rgba(124,92,255,0.4),inset_0_1px_0_rgba(255,255,255,0.15)]">
          <span className="font-sans text-sm font-extrabold tracking-[-0.05em] text-white">
            CS
          </span>
        </div>

        {/* nav items */}
        <div className="flex w-full flex-col gap-1 px-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex flex-col items-center justify-center gap-[5px] rounded-xl px-1 py-2.5 no-underline transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                  isActive ? "-translate-y-px" : "hover:-translate-y-0.5 hover:bg-white/5"
                }`}
              >
                {/* active indicator dot — left edge */}
                {isActive && (
                  <span className="absolute -left-2 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-sm bg-[#7c5cff] shadow-[0_0_8px_#7c5cff] animate-[pulse-dot_2s_ease-in-out_infinite]" />
                )}

                {/* icon wrapper — 3D raised surface */}
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-[10px] transition-all duration-200 ${
                    isActive
                      ? "bg-[#7c5cff]/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_4px_8px_rgba(0,0,0,0.3)]"
                      : "bg-white/[4%] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] group-hover:bg-white/[8%] group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.2)]"
                  }`}
                >
                  <Icon
                    strokeWidth={isActive ? 2.5 : 1.8}
                    className={`h-[18px] w-[18px] transition-colors duration-200 ${
                      isActive
                        ? "animate-[spin-once_0.5s_cubic-bezier(0.34,1.56,0.64,1)] text-[#a78bfa]"
                        : "text-white/[35%] group-hover:animate-[bob_0.6s_ease-in-out] group-hover:text-white/80"
                    }`}
                  />
                </div>

                {/* label */}
                <span
                  className={`font-mono  font-semibold text-[9px] uppercase tracking-[0.04em] transition-colors duration-200 ${
                    isActive
                      ? "font-semibold text-[#a78bfa]"
                      : "font-normal text-white/25 group-hover:text-white/60"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* spacer */}
        <div className="flex-1" />

        {/* bottom — first letter of whoever's logged in; hover or click reveals their email */}
        <div className="relative mb-2">
          <div
            onMouseEnter={() => setShowEmail(true)}
            onMouseLeave={() => setShowEmail(false)}
            onClick={() => setShowEmail((prev) => !prev)}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/[12%] bg-violet-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
          >
            <span className="font-sans text-[11px] font-semibold text-violet-50 ">
              {initial}
            </span>
          </div>

          {showEmail && user?.email && (
            <div className="absolute bottom-0 left-full ml-2 whitespace-nowrap rounded-md border border-white/10 bg-neutral-900 px-2 py-1 text-xs text-white/70 shadow-lg">
              {user.email}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;