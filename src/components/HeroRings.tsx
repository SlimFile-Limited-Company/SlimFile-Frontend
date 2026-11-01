import { useEffect, useRef } from 'react';

/**
 * The thin rings from the feature cards, drawn large and faint behind the top
 * of the home page. They fade out before the page goes on, and drift slowly
 * as you scroll (unless the visitor prefers reduced motion). Hidden on phones,
 * where the rings are too large to read as circles.
 */
export default function HeroRings() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (ref.current) ref.current.style.transform = `translate3d(0, ${Math.min(window.scrollY, 1200) * 0.18}px, 0)`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-[1100px] -z-10 overflow-hidden hidden sm:block [mask-image:linear-gradient(to_bottom,black_45%,transparent)]"
    >
      <div ref={ref} className="absolute inset-0 will-change-transform">
        <span className="absolute -top-[420px] -right-[260px] w-[900px] aspect-square rounded-full border border-black/[0.09]" />
        <span className="absolute -top-[260px] -right-[120px] w-[560px] aspect-square rounded-full border border-black/[0.07]" />
        <span className="absolute top-[260px] -left-[340px] w-[760px] aspect-square rounded-full border border-black/[0.08]" />
        <span className="absolute top-[520px] left-[38%] w-[420px] aspect-square rounded-full border border-black/[0.06]" />
      </div>
    </div>
  );
}
