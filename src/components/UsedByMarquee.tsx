/**
 * Home page social proof: one band.
 *
 *   Used by 20,000 people in 184 countries
 *   [ Central University logo ] | University of Ghana   KNUST   University of Cape Coast ...  (scrolling)
 *
 * Central University is a SlimFile customer, so its official logo (from central.edu.gh)
 * stays fixed at the start. The scrolling names are the other campuses where SlimFile
 * University Ambassadors are active. On phones the logo sits above the strip.
 */
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
          className="whitespace-nowrap px-6 sm:px-8 text-[15px] sm:text-[17px] font-semibold tracking-tight text-[#86868b] transition-colors duration-200 hover:text-[#E30613]"
        >
          {name}
        </li>
      ))}
    </ul>
  );
}

export default function UsedByMarquee() {
  return (
    <section aria-label="Who uses SlimFile" className="mx-auto mt-8 sm:mt-10 max-w-5xl">
      <p className="text-center text-[13px] sm:text-[14px] text-[#6e6e73]">
        Used by <span className="font-semibold text-[#1d1d1f]">20,000 people</span> in{' '}
        <span className="font-semibold text-[#1d1d1f]">184 countries</span>
      </p>

      <div className="mt-4 flex flex-col sm:flex-row items-center gap-4 sm:gap-0">
        <div className="flex shrink-0 flex-col items-center sm:items-start gap-1.5 sm:pr-8">
          <span className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.14em] text-[#86868b]">Trusted by</span>
          <img
            src="/logos/central-university.png"
            alt="Central University"
            width={800}
            height={279}
            className="h-11 sm:h-12 w-auto"
            loading="eager"
          />
        </div>
        <div className="hidden sm:block h-10 w-px shrink-0 bg-[#d2d2d7]" aria-hidden="true" />
        <div className="group relative w-full min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <div className="used-by-track flex w-max group-hover:[animation-play-state:paused]">
            <Row />
            <Row hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
