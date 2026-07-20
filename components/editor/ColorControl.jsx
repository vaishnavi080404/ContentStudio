// components/editor/ColorControl.jsx
"use client";
import { useState } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";

// gradient is stored as { type: "linear", angle, stops: [{ color, offset }] }
// solid is just a plain hex string - the parent decides which one it's holding
export default function ColorControl({ label, value, onChange, onCommit }) {
  const isGradient = typeof value === "object" && value?.type === "linear";
  const [mode, setMode] = useState(isGradient ? "gradient" : "solid");

  const solidColor = isGradient ? value.stops[0].color : value;
  const stops = isGradient
    ? value.stops
    : [
        { color: value, offset: 0 },
        { color: "#ffffff", offset: 1 },
      ];
  const angle = isGradient ? value.angle : 90;

  const updateStop = (idx, color) => {
    const newStops = stops.map((s, i) => (i === idx ? { ...s, color } : s));
    onChange({ type: "linear", angle, stops: newStops });
  };

  const updateAngle = (newAngle) => {
    onChange({ type: "linear", angle: newAngle, stops });
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs text-gray-500 font-medium">{label}</label>
        <div className="flex gap-1">
          <button
            onClick={() => {
              setMode("solid");
              onChange(solidColor);
              onCommit?.();
            }}
            className={`px-2 py-0.5 rounded text-[10px] border ${
              mode === "solid"
                ? "bg-violet-100 border-violet-400 text-violet-700"
                : "border-gray-200 text-gray-500"
            }`}
          >
            Solid
          </button>
          <button
            onClick={() => {
              setMode("gradient");
              onChange({ type: "linear", angle, stops });
              onCommit?.();
            }}
            className={`px-2 py-0.5 rounded text-[10px] border ${
              mode === "gradient"
                ? "bg-violet-100 border-violet-400 text-violet-700"
                : "border-gray-200 text-gray-500"
            }`}
          >
            Gradient
          </button>
        </div>
      </div>

      {mode === "solid" ? (
        <>
          <HexColorPicker
            color={solidColor}
            onChange={onChange}
            onMouseUp={() => onCommit?.()}
          />
          <div className="flex items-center gap-2 mt-2">
            <div
              className="w-7 h-7 rounded border border-gray-200 shrink-0"
              style={{ backgroundColor: solidColor }}
            />
            <HexColorInput
              color={solidColor}
              onChange={(val) => {
                onChange(val);
                onCommit?.(); // typed hex commits immediately, no drag to wait for
              }}
              prefixed
              className="w-full border border-gray-200 rounded px-2 py-1 text-xs font-mono"
            />
          </div>
        </>
      ) : (
        <div className="space-y-3">
          {stops.map((stop, idx) => (
            <div key={idx}>
              <p className="text-[10px] text-gray-400 mb-1">
                {idx === 0 ? "Start" : "End"}
              </p>
              <HexColorPicker
                color={stop.color}
                onChange={(c) => updateStop(idx, c)}
                onMouseUp={() => onCommit?.()}
              />
              <div className="flex items-center gap-2 mt-2">
                <div
                  className="w-7 h-7 rounded border border-gray-200 shrink-0"
                  style={{ backgroundColor: stop.color }}
                />
                <HexColorInput
                  color={stop.color}
                  onChange={(val) => {
                    updateStop(idx, val);
                    onCommit?.();
                  }}
                  prefixed
                  className="w-full border border-gray-200 rounded px-2 py-1 text-xs font-mono"
                />
              </div>
            </div>
          ))}
          <div>
            <label className="text-[10px] text-gray-400 block mb-1">
              Angle: {angle}°
            </label>
            <input
              type="range"
              min="0"
              max="360"
              value={angle}
              onChange={(e) => updateAngle(parseInt(e.target.value))}
              onMouseUp={() => onCommit?.()}
              className="w-full accent-violet-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}


// ColorControl

// 1. Detects solid or gradient.
// 2. Shows correct UI.
// 3. Sends updates to canvas.
// 4. Saves changes to undo history.

// 1. Rectangle is light blue.
// 2. User changes it to red.
// 3. User converts it to red → blue gradient.
// 4. User changes blue to yellow.
// 5. User rotates gradient direction.
// 6. User converts it back to solid green.