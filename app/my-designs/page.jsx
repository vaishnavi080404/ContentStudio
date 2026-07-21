"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { supabase } from "@/lib/supabase";

const MyDesigns = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

 const fetchDesigns = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data, error } = await supabase
      .from("Designs")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (!error) setDesigns(data);
    setLoading(false);
  };


  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDesigns();
  }, []);

 

  return (
    <div className="h-screen flex overflow-hidden bg-[#0d0d14]">
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        {/* page header — same pattern as templates page */}
        <div className="px-8 pt-8 pb-6 border-b border-white/5">
          <p className="text-xs text-violet-400 font-medium tracking-widest uppercase mb-1">
            ContentStudio
          </p>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            My Designs
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Everything you&apos;ve created, saved and ready to pick back up.
          </p>
        </div>

        <div className="px-8 py-6">
          {loading ? (
            // skeleton grid instead of a plain text loader — feels intentional, matches the glass cards below
            <div className="grid grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06] animate-pulse"
                >
                  <div className="bg-white/[0.04]" style={{ aspectRatio: "16/9" }} />
                  <div className="px-4 py-3 space-y-2">
                    <div className="h-3 w-2/3 rounded bg-white/[0.06]" />
                    <div className="h-2.5 w-1/3 rounded bg-white/[0.04]" />
                  </div>
                </div>
              ))}
            </div>
          ) : designs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-neutral-600 text-sm">No designs yet.</p>
              <p className="text-neutral-700 text-xs mt-1">
                Go create one from a template or generate with AI.
              </p>
              <button
                onClick={() => (window.location.href = "/templates")}
                className="mt-5 px-5 py-2 bg-violet-600 text-white rounded-lg text-xs font-semibold hover:bg-violet-500 transition-colors"
              >
                Browse templates
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-5">
              {designs.map((design) => (
                <div
                  key={design.id}
                  onClick={() =>
                    (window.location.href = `/editor/${design.template_id}?designId=${design.id}`)
                  }
                  className="group relative rounded-2xl overflow-hidden cursor-pointer
                    bg-white/[0.05] backdrop-blur-xl border border-white/10
                    shadow-[0_4px_24px_rgba(0,0,0,0.25)]
                    transition-all duration-300
                    hover:-translate-y-1 hover:border-violet-500/40
                    hover:shadow-[0_8px_32px_rgba(124,92,255,0.2)]"
                >
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
                    <img
                      src={design.thumbnail}
                      alt={design.title}
                      className="w-full h-full object-cover"
                    />

                    {/* glass sheen across the top of the thumbnail — subtle, not a full overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent pointer-events-none" />

                    {/* hover overlay — open button, same slide-up pattern as templates page */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/editor/${design.template_id}?designId=${design.id}`;
                        }}
                        className="px-5 py-2 bg-white text-gray-900 rounded-lg text-xs font-semibold
                          hover:bg-gray-100 transition-colors
                          translate-y-3 group-hover:translate-y-0 transition-transform duration-300"
                      >
                        Open design
                      </button>
                    </div>
                  </div>

                  {/* card footer */}
                  <div className="px-4 py-3 flex items-center justify-between bg-white/[0.02]">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-neutral-200 truncate">
                        {design.title}
                      </p>
                      <p className="text-xs text-neutral-600 mt-0.5">
                        {new Date(design.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyDesigns;