'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedHeading({ children, className, style }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // split into words so they animate in one at a time instead of the whole line at once
    const words = children.split(' ');
    el.innerHTML = words.map((w) => `<span class="gsap-word">${w}&nbsp;</span>`).join('');

    const ctx = gsap.context(() => {
      gsap.from('.gsap-word', {
        y: 40,
        opacity: 0,
        rotateX: 45,
        stagger: 0.08,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%', // fires once heading is 85% up the viewport
          toggleActions: 'play none none reverse',
        },
      });
    }, ref);

    return () => ctx.revert(); // cleans up the ScrollTrigger instance on unmount
  }, [children]);

  return (
    <h2 ref={ref} className={className} style={{ ...style, perspective: 400 }}>
      {children}
    </h2>
  );
}