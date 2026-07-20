// lib/gradientUtils.js

// our app's gradient shape: { type: "linear", angle, stops: [{color, offset}] }
// fabric's gradient shape:  { type: "linear", coords: {x1,y1,x2,y2}, colorStops: [...] }
// these two helpers are the only place that conversion happens

export const toFabricGradient = (gradientData, obj, GradientClass) => {
  const { angle = 90, stops } = gradientData;
  const w = obj.width * (obj.scaleX || 1);
  const h = obj.height * (obj.scaleY || 1);

  const rad = (angle - 90) * (Math.PI / 180);
  const cx = w / 2;
  const cy = h / 2;
  const len = Math.sqrt(w * w + h * h) / 2;

  return new GradientClass({
    type: "linear",
    coords: {
      x1: cx - Math.cos(rad) * len,
      y1: cy - Math.sin(rad) * len,
      x2: cx + Math.cos(rad) * len,
      y2: cy + Math.sin(rad) * len,
    },
    colorStops: stops.map((s) => ({ color: s.color, offset: s.offset })),
  });
};

// reverse direction - converts a live fabric Gradient instance (or a plain
// hex string) back into our app's shape, so it's always safe to hand to
// ColorControl. without this, a fabric Gradient instance leaks into state
// after re-selecting an object, and ColorControl reads .stops/.angle off it
// (which don't exist on a real Gradient - it has .colorStops/.coords),
// producing undefined values that eventually crash addColorStop with NaN
export const toAppGradient = (fill) => {
  if (!fill || typeof fill !== "object" || fill.type !== "linear") {
    return fill; // already a hex string (or null/undefined) - nothing to do
  }
  const { x1 = 0, y1 = 0, x2 = 0, y2 = 0 } = fill.coords || {};
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI + 90;
  return {
    type: "linear",
    angle: Math.round(angle),
    stops: (fill.colorStops || []).map((s) => ({
      color: s.color,
      offset: s.offset,
    })),
  };
};