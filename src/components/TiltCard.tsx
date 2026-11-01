import { useRef, type ReactNode } from 'react';

const MAX_TILT = 8; // degrees
const DRIFT = 10; // px the icon drifts, for depth

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Tilts toward the mouse in 3D, with a soft light reflection. Children can
 * read --drift-x / --drift-y to move against the tilt and look raised.
 * Mouse only: touch and reduced-motion users get a still card.
 */
export default function TiltCard({ className = '', children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse' || reducedMotion()) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width; // 0..1
    const y = (e.clientY - r.top) / r.height;
    el.style.transition = 'transform 120ms ease-out, background-color 300ms, box-shadow 300ms';
    el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * MAX_TILT * 2}deg) rotateY(${(x - 0.5) * MAX_TILT * 2}deg) scale(1.02)`;
    el.style.setProperty('--glare-x', `${x * 100}%`);
    el.style.setProperty('--glare-y', `${y * 100}%`);
    el.style.setProperty('--drift-x', `${(x - 0.5) * DRIFT * 2}px`);
    el.style.setProperty('--drift-y', `${(y - 0.5) * DRIFT * 2}px`);
  };

  const leave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = 'transform 600ms cubic-bezier(0.2, 0.8, 0.2, 1), background-color 300ms, box-shadow 300ms';
    el.style.transform = '';
    el.style.setProperty('--drift-x', '0px');
    el.style.setProperty('--drift-y', '0px');
  };

  return (
    <div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      className={`relative isolate will-change-transform [&>*:not(.tilt-glare)]:relative [&>*:not(.tilt-glare)]:z-[1] ${className}`}
    >
      {/* Light reflection that follows the mouse, kept behind the content */}
      <span
        aria-hidden
        className="tilt-glare pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: 'radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255,255,255,0.95), transparent 60%)' }}
      />
      {children}
    </div>
  );
}
