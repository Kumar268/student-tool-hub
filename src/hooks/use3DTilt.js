import { useRef, useEffect } from 'react';

/**
 * use3DTilt — Premium 3D mouse rotation hook v2.0
 *
 * Fixes vs v1:
 *  - Stops RAF when not needed (no idle repaint loop)
 *  - Spring-back uses CSS transition swap, not RAF
 *  - will-change set on enter, released on leave
 *  - Disabled on: touch, mobile viewport, low-end hardware,
 *    prefers-reduced-motion, html.reduce-motion class
 *  - Returns { ref } only — isLowEnd removed (caller doesn't need it)
 */
export default function use3DTilt({ max = 2 } = {}) {
  const ref    = useRef(null);
  const rafId  = useRef(null);
  const cur    = useRef({ x: 0, y: 0 });
  const tgt    = useRef({ x: 0, y: 0 });
  const active = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // ── Disable checks ──────────────────────────────────────
    const touch   = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const mobile  = window.innerWidth <= 768;
    const lowEnd  = (navigator.hardwareConcurrency ?? 4) <= 2 ||
                    (navigator.deviceMemory        ?? 4) <= 1;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const htmlReduced = document.documentElement.classList.contains('reduce-motion');

    if (touch || mobile || lowEnd || reduced || htmlReduced) {
      if (lowEnd || reduced) {
        document.documentElement.classList.add('reduce-motion');
      }
      return;
    }

    const LERP    = 0.1;
    const SPRING  = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';

    function lerp(a, b, t) { return a + (b - a) * t; }
    function clamp(v, lo, hi) { return Math.min(Math.max(v, lo), hi); }

    function loop() {
      cur.current.x = lerp(cur.current.x, tgt.current.x, LERP);
      cur.current.y = lerp(cur.current.y, tgt.current.y, LERP);

      el.style.transform =
        `rotateX(${cur.current.x.toFixed(3)}deg) ` +
        `rotateY(${cur.current.y.toFixed(3)}deg)`;

      const stillMoving =
        Math.abs(cur.current.x - tgt.current.x) > 0.005 ||
        Math.abs(cur.current.y - tgt.current.y) > 0.005;

      if (active.current || stillMoving) {
        rafId.current = requestAnimationFrame(loop);
      } else {
        rafId.current = null;
        el.style.willChange = 'auto';
      }
    }

    function startLoop() {
      if (!rafId.current) {
        rafId.current = requestAnimationFrame(loop);
      }
    }

    function onEnter() {
      active.current      = true;
      el.style.transition = 'none';   // let RAF drive
      el.style.willChange = 'transform';
      startLoop();
    }

    function onMove(e) {
      const r  = el.getBoundingClientRect();
      const nx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2);
      const ny = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
      tgt.current.x = clamp(-ny * max, -max, max);
      tgt.current.y = clamp( nx * max, -max, max);
    }

    function onLeave() {
      active.current = false;
      tgt.current.x  = 0;
      tgt.current.y  = 0;
      // Swap to CSS spring for the snap-back
      el.style.transition = SPRING;
      startLoop();
    }

    el.addEventListener('mouseenter', onEnter, { passive: true });
    el.addEventListener('mousemove',  onMove,  { passive: true });
    el.addEventListener('mouseleave', onLeave, { passive: true });

    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mousemove',  onMove);
      el.removeEventListener('mouseleave', onLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      if (el) {
        el.style.transform  = '';
        el.style.transition = '';
        el.style.willChange = 'auto';
      }
    };
  }, [max]);

  return { ref };
}