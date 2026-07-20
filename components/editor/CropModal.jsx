// components/editor/CropModal.jsx
"use client";
import { useEffect, useRef, useState } from "react";

// HANDLE_SIZE controls how big the corner drag targets are in px
const HANDLE_SIZE = 10;

export default function CropModal({ imageUrl, naturalWidth, naturalHeight, onConfirm, onCancel }) {
  const containerRef = useRef(null);
  const [previewSize, setPreviewSize] = useState({ w: 0, h: 0 });

  // crop box in preview-pixel coordinates
  const [crop, setCrop] = useState({ x: 0, y: 0, w: 0, h: 0 });

  // what the user is currently dragging: null | "new" | "move" | "tl"|"tr"|"bl"|"br"
  const dragRef = useRef(null);
  const startRef = useRef(null); // mouse position at drag start
  const cropStartRef = useRef(null); // crop box at drag start

  // calculate preview dimensions on mount — fit image inside 600x480 box
  useEffect(() => {
    const maxW = 600;
    const maxH = 480;
    const scale = Math.min(maxW / naturalWidth, maxH / naturalHeight, 1);
    const w = Math.round(naturalWidth * scale);
    const h = Math.round(naturalHeight * scale);
    setPreviewSize({ w, h });
    // default crop: full image
    setCrop({ x: 0, y: 0, w, h });
  }, [naturalWidth, naturalHeight]);

  // scale factor: preview px → real image px
  const scaleX = naturalWidth / (previewSize.w || 1);
  const scaleY = naturalHeight / (previewSize.h || 1);

  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

  const getMousePos = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: clamp(e.clientX - rect.left, 0, previewSize.w),
      y: clamp(e.clientY - rect.top, 0, previewSize.h),
    };
  };

  const hitHandle = (pos, crop) => {
    const handles = {
      tl: { x: crop.x, y: crop.y },
      tr: { x: crop.x + crop.w, y: crop.y },
      bl: { x: crop.x, y: crop.y + crop.h },
      br: { x: crop.x + crop.w, y: crop.y + crop.h },
    };
    for (const [key, h] of Object.entries(handles)) {
      if (Math.abs(pos.x - h.x) <= HANDLE_SIZE && Math.abs(pos.y - h.y) <= HANDLE_SIZE) {
        return key;
      }
    }
    return null;
  };

  const isInsideCrop = (pos, crop) =>
    pos.x > crop.x && pos.x < crop.x + crop.w &&
    pos.y > crop.y && pos.y < crop.y + crop.h;

  const onMouseDown = (e) => {
    e.preventDefault();
    const pos = getMousePos(e);
    const handle = hitHandle(pos, crop);

    if (handle) {
      dragRef.current = handle;
    } else if (isInsideCrop(pos, crop)) {
      dragRef.current = "move";
    } else {
      dragRef.current = "new";
      setCrop({ x: pos.x, y: pos.y, w: 0, h: 0 });
    }
    startRef.current = pos;
    cropStartRef.current = { ...crop };
  };

  const onMouseMove = (e) => {
    if (!dragRef.current) return;
    const pos = getMousePos(e);
    const dx = pos.x - startRef.current.x;
    const dy = pos.y - startRef.current.y;
    const c = cropStartRef.current;
    const { w: pw, h: ph } = previewSize;

    if (dragRef.current === "new") {
      // drawing a fresh selection from the mousedown origin
      const ox = startRef.current.x;
      const oy = startRef.current.y;
      setCrop({
        x: Math.min(ox, pos.x),
        y: Math.min(oy, pos.y),
        w: Math.abs(pos.x - ox),
        h: Math.abs(pos.y - oy),
      });
      return;
    }

    if (dragRef.current === "move") {
      setCrop({
        ...c,
        x: clamp(c.x + dx, 0, pw - c.w),
        y: clamp(c.y + dy, 0, ph - c.h),
      });
      return;
    }

    // corner handles — resize from the opposite corner as anchor
    let { x, y, w, h } = c;
    if (dragRef.current === "tl") {
      x = clamp(c.x + dx, 0, c.x + c.w - 10);
      y = clamp(c.y + dy, 0, c.y + c.h - 10);
      w = c.x + c.w - x;
      h = c.y + c.h - y;
    } else if (dragRef.current === "tr") {
      y = clamp(c.y + dy, 0, c.y + c.h - 10);
      w = clamp(c.w + dx, 10, pw - c.x);
      h = c.y + c.h - y;
    } else if (dragRef.current === "bl") {
      x = clamp(c.x + dx, 0, c.x + c.w - 10);
      w = c.x + c.w - x;
      h = clamp(c.h + dy, 10, ph - c.y);
    } else if (dragRef.current === "br") {
      w = clamp(c.w + dx, 10, pw - c.x);
      h = clamp(c.h + dy, 10, ph - c.y);
    }
    setCrop({ x, y, w, h });
  };

  const onMouseUp = () => { dragRef.current = null; };

  const handleConfirm = () => {
    // convert preview-px crop back to real image px
    onConfirm({
      cropX: Math.round(crop.x * scaleX),
      cropY: Math.round(crop.y * scaleY),
      cropW: Math.round(crop.w * scaleX),
      cropH: Math.round(crop.h * scaleY),
    });
  };

  const handles = [
    { key: "tl", style: { left: crop.x - HANDLE_SIZE / 2, top: crop.y - HANDLE_SIZE / 2 } },
    { key: "tr", style: { left: crop.x + crop.w - HANDLE_SIZE / 2, top: crop.y - HANDLE_SIZE / 2 } },
    { key: "bl", style: { left: crop.x - HANDLE_SIZE / 2, top: crop.y + crop.h - HANDLE_SIZE / 2 } },
    { key: "br", style: { left: crop.x + crop.w - HANDLE_SIZE / 2, top: crop.y + crop.h - HANDLE_SIZE / 2 } },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-6 flex flex-col gap-4">
        <p className="text-sm font-semibold text-gray-700">Crop Image</p>

        {/* image + crop overlay */}
        <div
          ref={containerRef}
          className="relative select-none overflow-hidden cursor-crosshair"
          style={{ width: previewSize.w, height: previewSize.h }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          <img
            src={imageUrl}
            alt="crop preview"
            style={{ width: previewSize.w, height: previewSize.h, display: "block" }}
            draggable={false}
          />

          {/* dark overlay outside crop box — 4 rectangles covering the non-cropped area */}
          {/* top */}
          <div className="absolute bg-black/40 pointer-events-none"
            style={{ left: 0, top: 0, width: previewSize.w, height: crop.y }} />
          {/* bottom */}
          <div className="absolute bg-black/40 pointer-events-none"
            style={{ left: 0, top: crop.y + crop.h, width: previewSize.w, height: previewSize.h - crop.y - crop.h }} />
          {/* left */}
          <div className="absolute bg-black/40 pointer-events-none"
            style={{ left: 0, top: crop.y, width: crop.x, height: crop.h }} />
          {/* right */}
          <div className="absolute bg-black/40 pointer-events-none"
            style={{ left: crop.x + crop.w, top: crop.y, width: previewSize.w - crop.x - crop.w, height: crop.h }} />

          {/* crop border */}
          <div className="absolute border-2 border-white pointer-events-none"
            style={{ left: crop.x, top: crop.y, width: crop.w, height: crop.h }} />

          {/* rule-of-thirds grid lines inside crop box */}
          <div className="absolute pointer-events-none"
            style={{ left: crop.x, top: crop.y, width: crop.w, height: crop.h }}>
            <div className="absolute border-white/40 border-l" style={{ left: "33%", top: 0, height: "100%" }} />
            <div className="absolute border-white/40 border-l" style={{ left: "66%", top: 0, height: "100%" }} />
            <div className="absolute border-white/40 border-t" style={{ top: "33%", left: 0, width: "100%" }} />
            <div className="absolute border-white/40 border-t" style={{ top: "66%", left: 0, width: "100%" }} />
          </div>

          {/* corner handles */}
          {handles.map(({ key, style }) => (
            <div
              key={key}
              className="absolute bg-white border-2 border-violet-500 rounded-sm"
              style={{ ...style, width: HANDLE_SIZE, height: HANDLE_SIZE }}
            />
          ))}
        </div>

        {/* crop dimensions hint */}
        <p className="text-xs text-gray-400">
          {Math.round(crop.w * scaleX)} × {Math.round(crop.h * scaleY)}px
        </p>

        {/* buttons */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-1.5 rounded-lg text-sm text-gray-600 border border-gray-200 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-1.5 rounded-lg text-sm text-white bg-violet-500 hover:bg-violet-600"
          >
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
}