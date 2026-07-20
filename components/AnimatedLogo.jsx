"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function AnimatedLogo() {
  const contentRef = useRef(null);
  const studioRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      // "Content" — clips in from left, like text being revealed by a cursor
      tl.fromTo(
        contentRef.current,
        { clipPath: "inset(0 100% 0 0)", opacity: 1 },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 0.5,
          ease: "power2.out",
        },
      )

      // small violet dot flashes between the two words — like a cursor blink
      .fromTo(
        dotRef.current,
        { opacity: 0, scaleY: 0 },
        { opacity: 1, scaleY: 1, duration: 0.1, ease: "power4.out" },
        "-=0.05",
      )
      .to(dotRef.current, { opacity: 0, duration: 0.15, delay: 0.05 })

      // "Studio" slides in from left + violet color fades in
      .fromTo(
        studioRef.current,
        { x: -8, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: "power3.out" },
        "-=0.1",
      )

      // subtle final pulse on "Studio" — like the color settling
      .fromTo(
        studioRef.current,
        { textShadow: "0 0 12px rgba(124,92,255,0.9)" },
        { textShadow: "0 0 0px rgba(124,92,255,0)", duration: 0.6, ease: "power2.out" },
      );
    });

    return () => ctx.revert(); // cleanup on unmount
  }, []);

  return (
    <span className="font-sans text-lg font-bold tracking-[-0.02em] text-white flex items-center">
      {/* "Content" — clipped reveal */}
      <span
        ref={contentRef}
        style={{ clipPath: "inset(0 100% 0 0)", display: "inline-block" }}
      >
        Content
      </span>

      {/* cursor blink dot between words */}
      <span
        ref={dotRef}
        style={{
          display: "inline-block",
          width: 2,
          height: "1em",
          background: "#7c5cff",
          borderRadius: 1,
          marginInline: 1,
          opacity: 0,
          verticalAlign: "middle",
          transformOrigin: "center",
        }}
      />

      {/* "Studio" — slides in with violet glow */}
      <span
        ref={studioRef}
        className="text-[#7c5cff]"
        style={{ opacity: 0, display: "inline-block" }}
      >
        Studio
      </span>
    </span>
  );
}