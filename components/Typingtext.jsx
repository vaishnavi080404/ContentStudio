"use client";

import { useEffect, useState } from "react";

export default function TypingText({
  phrases,
  className,
  typeSpeed = 60,
  eraseSpeed = 30,
  holdMs = 1600,
}) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState("typing"); // "typing" | "hold" | "erasing"

  useEffect(() => {
    const current = phrases[index % phrases.length];
    let t;
    if (phase === "typing") {
      if (text.length < current.length) {
        t = setTimeout(() => setText(current.slice(0, text.length + 1)), typeSpeed);
      } else {
        t = setTimeout(() => setPhase("hold"), 20);
      }
    } else if (phase === "hold") {
      t = setTimeout(() => setPhase("erasing"), holdMs);
    } else {
      if (text.length > 0) {
        t = setTimeout(() => setText(current.slice(0, text.length - 1)), eraseSpeed);
      } else {
        setPhase("typing");
        setIndex((i) => i + 1);
      }
    }
    return () => clearTimeout(t);
  }, [text, phase, index, phrases, typeSpeed, eraseSpeed, holdMs]);

  return (
    <span className={className}>
      {text}
      <span className="type-caret" aria-hidden="true" />
    </span>
  );
}