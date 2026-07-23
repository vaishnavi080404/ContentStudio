"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import ClientOnly from "./ClientOnly";
import ShapesBackground from "./ShapesBackground";

const HEADING = "The design tool";


const SUB_PHRASES = [
  "that colors on the fly.",
  2000,
  "that renders in real time.",
  2000,
  "that builds itself.",
  2000,
  "that thinks in shapes.",
  2000,
];


const ITEMS = [
  {
    id: "colorPalette",
    top: "82%",
    left: "16%",
    content: (
      <div className="flex items-center gap-1 bg-white rounded-xl px-3 py-2 shadow-lg border border-neutral-100">
        <span className="text-[9px] text-neutral-400 font-medium mr-2 uppercase tracking-wider">Colors</span>
        {["#7c5cff", "#ff5cae", "#0ea5e9", "#f59e0b", "#10b981", "#f43f5e"].map((c) => (
          <span key={c} className="h-4 w-4 rounded-full border-2 border-white shadow-sm" style={{ background: c }} />
        ))}
        <span className="ml-1 text-[9px] text-neutral-300">+12</span>
      </div>
    ),
  },
  {
    id: "fontCard",
    top: "24%",
    left: "30%",
    content: (
      <div className="bg-white rounded-xl px-4 py-3 shadow-lg border border-neutral-100 min-w-[140px]">
        <p className="text-[8px] text-neutral-400 uppercase tracking-widest mb-1">Font family</p>
        <p className="text-[15px] font-bold text-neutral-900" style={{ fontFamily: "Georgia, serif" }}>Playfair Display</p>
        <p className="text-[9px] text-neutral-400 mt-0.5">Bold · 48px</p>
      </div>
    ),
  },
  {
    id: "shapeRect",
    top: "28%",
    left: "60%",
    content: (
      <div className="rounded-xl shadow-lg" style={{
        width: 120, height: 48,
        background: "linear-gradient(135deg, #7c5cff, #ff5cae)",
      }}>
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-white text-[10px] font-bold tracking-wide">SUMMER SALE</span>
        </div>
      </div>
    ),
  },
  {
    id: "aiChip",
    top: "56%",
    left: "64%",
    content: (
      <div className="flex items-center gap-2 bg-[#7c5cff] text-white rounded-full px-3 py-1.5 shadow-lg shadow-[#7c5cff]/40">
        <span className="text-xs animate-pulse">✦</span>
        <span className="text-[10px] font-semibold">AI generating layout</span>
      </div>
    ),
  },
  {
    id: "badge",
    top: "10%",
    left: "66%",
    content: (
      <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-xl border border-neutral-100">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-[9px] font-bold text-white">✓</span>
        <span className="text-[11px] font-semibold text-neutral-800">Design saved</span>
      </div>
    ),
  },
  {
    id: "layerPanel",
    top: "40%",
    left: "62%",
    content: (
      <div className="bg-white rounded-xl shadow-lg border border-neutral-100 px-3 py-2 min-w-[120px]">
        <p className="text-[8px] text-neutral-400 uppercase tracking-widest mb-2">Layers</p>
        {["Heading text", "Background", "Shape 01"].map((layer, i) => (
          <div key={layer} className="flex items-center gap-1.5 py-0.5">
            <div className="w-2 h-2 rounded-sm" style={{ background: ["#7c5cff","#ff5cae","#0ea5e9"][i] }} />
            <span className="text-[9px] text-neutral-600">{layer}</span>
          </div>
        ))}
      </div>
    ),
  },
];

const TOOLS = [
  { icon: "T", id: "text" },
  { icon: "◐", id: "badge" },
  { icon: "▢", id: "image" },
  { icon: "⬢", id: "cta" },
  { icon: "◉", id: "palette" },
];

export default function EditorCanvas() {
  const [visibleItems, setVisibleItems] = useState([]);
  const [activeTool, setActiveTool] = useState(null); 
  const [readyForItems, setReadyForItems] = useState(false);


  useEffect(() => {
    const t = setTimeout(() => setReadyForItems(true), 2200);
    return () => clearTimeout(t);
  }, []);

  // item loop — starts once, then repeat
  useEffect(() => {
    if (!readyForItems) return;
    let cancelled = false;

    function runLoop() {
      setVisibleItems([]);
      setActiveTool(null);

      ITEMS.forEach((item, i) => {
        setTimeout(() => {
          if (cancelled) return;
          setActiveTool(item.id);
          setVisibleItems((prev) => [...prev, item]);
        }, i * 700);
      });

      const holdTime = 2000; 
      const totalTime = ITEMS.length * 700 + holdTime;
      setTimeout(() => {
        if (!cancelled) runLoop();
      }, totalTime);
    }

    runLoop();
    return () => {
      cancelled = true;
    };
  }, [readyForItems]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-neutral-950">
      
      <ClientOnly
        fallback={<div className="absolute inset-0 bg-neutral-950" />}
      >
        <div className="absolute inset-0">
          <ShapesBackground count={34} />
        </div>
      </ClientOnly>
      <div className="absolute inset-0 bg-neutral-950/35" />

    
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, rotateX: 24, rotateY: -24, x: -60, y: 90 }}
          animate={{ opacity: 1, rotateX: 6, rotateY: -8, x: 0, y: 0 }}
          transition={{ delay: 0.3, duration: 0.9, ease: "easeOut" }}
          style={{ transformPerspective: 1400 }}
          className="relative left-12 top-10 h-[78%] w-[72%] overflow-hidden rounded-2xl bg-white shadow-[0_40px_80px_-20px_rgba(124,92,255,0.35)]"
        >
         
          <div className="flex items-center gap-2 border-b border-neutral-200/70 bg-white/70 px-4 py-2 backdrop-blur">
            editor
            <div className="mx-auto rounded bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-500">
              untitled — canvas
            </div>
          </div>

          <div className="relative h-[calc(100%-32px)] w-full p-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.6 }}
              className="max-w-[60%]"
            >
              <h2 className="text-3xl font-semibold leading-tight text-neutral-900">
                {HEADING}
                <TypeAnimation
                  sequence={SUB_PHRASES}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                  className="block bg-gradient-to-r from-[#7c5cff] to-[#ff5cae] bg-clip-text text-transparent"
                />
              </h2>

            
              <div className="mt-4 space-y-1.5">
                <div className="h-1.5 w-[70%] rounded-full bg-neutral-200" />
                <div className="h-1.5 w-[55%] rounded-full bg-neutral-200" />
                <div className="h-1.5 w-[45%] rounded-full bg-neutral-200" />
              </div>

              
              <div className="mt-3 flex items-center gap-1.5 text-xs text-neutral-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#7c5cff]" />
                building live
              </div>
            </motion.div>

            <AnimatePresence>
              {visibleItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.85, x: 24, y: -16 }}
                  animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute"
                  style={{ top: item.top, left: item.left }}
                >
                  {item.content}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

    
      <motion.div
        initial={{ opacity: 0, y: -140 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, type: "spring", bounce: 0.5, duration: 0.7 }}
        className="absolute right-[8%] top-[15%] h-[80%] w-16 rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-800 to-neutral-950 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.1)]"
      >
        <div className="flex flex-col items-center gap-3 p-2 pt-4">
          {TOOLS.map((tool) => (
            <span
              key={tool.id}
              className={`grid h-10 w-10 place-items-center rounded-lg text-sm font-semibold transition-colors duration-300 ${
                activeTool === tool.id
                  ? "bg-[#7c5cff] text-white shadow-[0_6px_16px_-4px_rgba(124,92,255,0.7)]"
                  : "bg-white/10 text-white/70"
              }`}
            >
              {tool.icon}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
