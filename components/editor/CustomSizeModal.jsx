"use client";
import { useState } from "react";

// common design sizes so the user doesn't have to know pixel dimensions
// off the top of their head — manual entry is still there for anything else
const PRESETS = [
  { label: "Instagram Post", w: 1080, h: 1080 },
  { label: "Instagram Story", w: 1080, h: 1920 },
  { label: "Facebook Banner", w: 1200, h: 628 },
  { label: "A4 Poster", w: 794, h: 1123 },
  { label: "Business Card", w: 1050, h: 600 },
];

export default function CustomSizeModal({ onConfirm, onCancel }) {
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(450);

  const handleConfirm = () => {
    const w = Math.max(50, Math.min(4000, Number(width) || 800));
    const h = Math.max(50, Math.min(4000, Number(height) || 450));
    onConfirm({ width: w, height: h });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#0d0d14] rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-lg font-bold text-neutral-200 mb-1">
          Custom size
        </h2>
        <p className="text-xs text-violet-100 mb-4">
          Pick a preset or enter your own dimensions in pixels.
        </p>

        {/* presets */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                setWidth(p.w);
                setHeight(p.h);
              }}
              className="px-3 py-1.5 rounded-full border border-neutral-200 text-xs font-medium bg-grey-100 text-neutral-100 hover:bg-violet-100 hover:text-violet-700 transition-colors"
            >
              {p.label} · {p.w}×{p.h}
            </button>
          ))}
        </div>

        {/* manual entry */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1">
            <label className="text-xs text-neutral-200 font-medium block mb-1">
              Width (px)
            </label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              min={50}
              max={4000}
              className="w-full border border-neutral-200 text-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 transition-colors"
            />
          </div>
          <span className="text-neutral-400 mt-5">×</span>
          <div className="flex-1">
            <label className="text-xs text-neutral-200 font-medium block mb-1">
              Height (px)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              min={50}
              max={4000}
              className="w-full text-neutral-200 border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 transition-colors"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-red-500 border border-red-200 hover:bg-red-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 transition-colors"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}