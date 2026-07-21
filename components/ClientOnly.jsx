"use client";

import { useEffect, useState } from "react";

export default function ClientOnly({ children, fallback = null }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => 
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true), 
    []);
  return <>{mounted ? children : fallback}</>;
}