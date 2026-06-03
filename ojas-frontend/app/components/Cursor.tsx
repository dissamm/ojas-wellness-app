'use client';

import { useEffect, useRef } from 'react';

export default function Cursor() {
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  
  // Track mouse and previous positions
  const mouse = useRef({ x: -200, y: -200 });
  const pos1 = useRef({ x: -200, y: -200 });
  const pos2 = useRef({ x: -200, y: -200 });
  const requestRef = useRef<number>();

  useEffect(() => {
    // Only run on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener('mousemove', onMouseMove);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      pos1.current.x = lerp(pos1.current.x, mouse.current.x, 0.14);
      pos1.current.y = lerp(pos1.current.y, mouse.current.y, 0.14);

      pos2.current.x = lerp(pos2.current.x, pos1.current.x, 0.1);
      pos2.current.y = lerp(pos2.current.y, pos1.current.y, 0.1);

      if (orb1Ref.current && orb2Ref.current) {
        orb1Ref.current.style.left = `${pos1.current.x}px`;
        orb1Ref.current.style.top = `${pos1.current.y}px`;

        orb2Ref.current.style.left = `${pos2.current.x}px`;
        orb2Ref.current.style.top = `${pos2.current.y}px`;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <>
      <div ref={orb1Ref} className="cursor-orb cursor-orb-1 hidden md:block"></div>
      <div ref={orb2Ref} className="cursor-orb cursor-orb-2 hidden md:block"></div>
    </>
  );
}
