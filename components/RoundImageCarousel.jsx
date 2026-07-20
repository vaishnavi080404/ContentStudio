"use client";

import { useEffect, useRef } from "react";

const DEFAULT_IMAGES = [
  { src: "/templates/template1.png" },
  { src: "/templates/template2.png" },
  { src: "/templates/template3.png" },
  { src: "/templates/template4.png" },
  { src: "/templates/template5.png" },
  { src: "/templates/template6.png" },
  { src: "/templates/template7.png" },
  { src: "/templates/template8.png" },
];

/**
 * RoundCarousel Component
 * 
 * @param {Object} props
 * @param {Array} props.images - Array of objects with {src: string}
 * @param {number} props.imageWidth - Width of carousel items
 * @param {number} props.imageHeight - Height of carousel items
 * @param {number} props.spacing - Spacing factor between items
 * @param {number} props.speed - Constant rotation speed
 * @param {string} props.direction - "right" or "left"
 * @param {boolean} props.drag - Enable/disable mouse drag
 * @param {number} props.sensitivity - Drag sensitivity
 * @param {number} props.tilt - X-axis tilt in degrees
 * @param {number} props.perspective - CSS perspective value
 * @param {number} props.cornerRadius - Border radius of images
 * @param {number} props.innerDim - Brightness of the inner side of images
 * @param {string} props.background - Background color of the container
 * @param {Object} props.style - Additional inline styles
 */
export default function RoundImageCarousel({
  images = DEFAULT_IMAGES,
  imageWidth = 500,
  imageHeight = 200,
  spacing = 3,
  speed = 7,
  direction = "right",
  drag = true,
  sensitivity = 5,
  tilt = -7,
  perspective = 3000,
  cornerRadius = 22,
  innerDim = 3.5,
  background = "#000000",
  style = {},
}) {
  const items = images.length > 0 ? images : DEFAULT_IMAGES;
  const count = items.length;

  const ringRef = useRef(null);
  const rafRef = useRef(0);
  const rotYRef = useRef(0);
  const velRef = useRef(0);
  const lastRef = useRef(0);
  const dragRef = useRef({ active: false, x: 0 });

  const angle = 360 / count;
  const factor = 1 + spacing * 0.15;
  const radius = (imageWidth * factor) / (2 * Math.tan(Math.PI / count));
  const radiusPx = cornerRadius;
  const degPerSec = speed * 6 * (direction === "left" ? -1 : 1);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;

    const apply = () => {
      if (ring) {
        ring.style.transform = `translateZ(${-radius}px) rotateY(${rotYRef.current}deg)`;
      }
    };

    apply();

    const draw = (now) => {
      const dt = lastRef.current ? (now - lastRef.current) / 1000 : 0;
      lastRef.current = now;
      const f = Math.min(dt, 0.1);
      const d = dragRef.current;

      if (!d.active) {
        if (Math.abs(velRef.current) > 0.01) {
          rotYRef.current += velRef.current * f;
          velRef.current *= 0.94; // Friction
        } else {
          rotYRef.current += degPerSec * f;
        }
      }

      apply();
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [radius, degPerSec, count]);

  const onPointerDown = (e) => {
    if (!drag) return;
    if (e.currentTarget.setPointerCapture) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    dragRef.current = { active: true, x: e.clientX };
    velRef.current = 0;
  };

  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d.active) return;
    const dx = e.clientX - d.x;
    d.x = e.clientX;
    const k = 0.3 * sensitivity;
    rotYRef.current += dx * k;
    velRef.current = dx * k * 60;
  };

  const onPointerUp = (e) => {
    if (e.currentTarget.releasePointerCapture) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    dragRef.current.active = false;
  };

  const faceBase = {
    position: "absolute",
    inset: 0,
    borderRadius: radiusPx,
    overflow: "hidden",
    backfaceVisibility: "hidden",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div
      style={{
        ...style,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background,
        perspective: `${perspective}px`,
        cursor: drag ? "grab" : "default",
        touchAction: "none",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${tilt}deg)`,
        }}
      >
        <div
          ref={ringRef}
          style={{
            position: "relative",
            width: imageWidth,
            height: imageHeight,
            transformStyle: "preserve-3d",
          }}
        >
          {items.map((img, i) => {
            const src = img?.src;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: `rotateY(${i * angle}deg) translateZ(${radius}px)`,
                  transformStyle: "preserve-3d",
                }}
              >
                {/* front face */}
                <div
                  style={{
                    ...faceBase,
                    backgroundColor: src ? "transparent" : "#222",
                    backgroundImage: src ? `url(${src})` : undefined,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
                  }}
                />
                {/* inner face  */}
                <div
                  style={{
                    ...faceBase,
                    transform: "rotateY(180deg)",
                    backgroundColor: src ? "transparent" : "#181818",
                    backgroundImage: src ? `url(${src})` : undefined,
                    filter: `brightness(${innerDim / 10})`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}