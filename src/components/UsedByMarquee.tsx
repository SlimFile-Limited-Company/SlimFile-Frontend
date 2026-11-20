/**
 * Home page social proof, kept to one slim row so the tool cards stay high on the page:
 *
 *   TRUSTED BY [Central University logo] | University of Ghana   KNUST   ...  (scrolling)
 *
 * Central University is SlimFile's first business customer, so its official logo (from
 * central.edu.gh) stays fixed and links to that story. The scrolling names are the other
 * campuses where SlimFile University Ambassadors are active. On phones only the
 * "Trusted by" logo shows; the moving names are hidden to keep the page short.
 */
import { Link } from 'react-router-dom';

const CAMPUSES = [
  'University of Ghana',
  'KNUST',
  'University of Cape Coast',
  'UMaT',
  'University for Development Studies',
  'KAAF University',
  'GCTU',
  'Takoradi Technical University',
  'UENR',
  'ALCHE Mauritius',
  'Hampden-Sydney College',
  'Livingstone College',
];

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {CAMPUSES.map((name) => (
        <li
          key={name}
          className="whitespace-nowrap px-5 sm:px-7 text-[14px] sm:text-[15px] font-semibold tracking-tight text-[#86868b] transition-colors duration-200 hover:text-[#E30613]"
        >
          {name}
        </li>
      ))}
    </ul>
  );
}

export default function UsedByMarquee() {
  return (
    <section aria-label="Who uses SlimFile" className="mx-auto mt-4 sm:mt-5 max-w-5xl">
      <p className="text-center text-[13px] text-[#6e6e73]">
        Used by <span className="font-semibold text-[#1d1d1f]">20,000+ people</span> in{' '}
        <span className="font-semibold text-[#1d1d1f]">184 countries</span>
        {/* The campus names only scroll on larger screens, so the lead-in only shows there. */}
        <span className="hidden sm:inline">, including students at</span>
      </p>
      <div className="mt-3 flex items-center justify-center sm:justify-start gap-3 sm:gap-0">
        <div className="flex shrink-0 items-center gap-2.5 sm:pr-6">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#86868b]">Trusted by</span>
          <Link
            to="/news/central-university-first-business-customer"
            aria-label="Central University, our first business customer"
            className="transition-opacity hover:opacity-80"
          >
            <img
              src="/logos/central-university.png"
              alt="Central University"
              width={800}
              height={279}
              className="h-7 sm:h-8 w-auto"
              loading="eager"
            />
          </Link>
        </div>
        <div className="hidden sm:block h-7 w-px shrink-0 bg-[#d2d2d7]" aria-hidden="true" />
        <div className="group relative hidden sm:block min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <div className="used-by-track flex w-max group-hover:[animation-play-state:paused]">
            <Row />
            <Row hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
