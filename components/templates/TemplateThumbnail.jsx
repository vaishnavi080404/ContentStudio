"use client";
import { useEffect, useRef } from "react";

const TemplateThumbnail = ({ canvasData, fullWidth, fullHeight }) => {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const staticRef = useRef(null);

  useEffect(() => {
    if (!canvasData) return;
    let cancelled = false;

    import("fabric").then(({ StaticCanvas }) => {
      if (cancelled) return;

      // box size now comes purely from CSS (fixed aspect-ratio card),
      // not from the template's own dimensions - every card ends up the same shape
      const boxW = wrapperRef.current.clientWidth;
      const boxH = wrapperRef.current.clientHeight;

      const dpr = window.devicePixelRatio || 1;

      // "contain" fit - scale by whichever axis is tighter so the whole
      // design shows up inside the box, nothing cropped, nothing stretched
      const scale = Math.min(boxW / fullWidth, boxH / fullHeight);

      // scaled design almost never fills the box exactly (different aspect
      // ratios) so center it - offset is just the leftover space / 2
      const offsetX = (boxW - fullWidth * scale) / 2;
      const offsetY = (boxH - fullHeight * scale) / 2;

      const canvas = new StaticCanvas(canvasRef.current, {
        width: boxW * dpr,
        height: boxH * dpr,
      });
      staticRef.current = canvas;

      canvas.loadFromJSON(canvasData).then(() => {
        if (cancelled) return;

        // viewportTransform: [scaleX, skewX, skewY, scaleY, translateX, translateY]
        // doing scale + translate in one shot instead of setZoom then panning separately
        canvas.setViewportTransform([
          scale * dpr, 0,
          0, scale * dpr,
          offsetX * dpr, offsetY * dpr,
        ]);
        canvas.renderAll();

        canvas.getElement().style.width = `${boxW}px`;
        canvas.getElement().style.height = `${boxH}px`;
      });
    });

    return () => {
      cancelled = true;
      staticRef.current?.dispose();
      staticRef.current = null;
    };
  }, [canvasData, fullWidth, fullHeight]);

  return (
    // TODO: swap aspect-[16/9] for whatever ratio matches your card design -
    // this is the "fixed size" part, tweak here not in the component logic
    <div ref={wrapperRef} className="w-full aspect-[16/9] bg-slate-100 rounded-lg overflow-hidden">
      <canvas ref={canvasRef} className="block" />
    </div>
  );
};

export default TemplateThumbnail;