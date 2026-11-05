import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import { AMBASSADOR_STORIES, GENERAL_NEWS, NEWS, absoluteUrl, findNews, formatNewsDate, type NewsItem } from '@/lib/news';

/**
 * SlimFile Newsroom, after apple.com/newsroom: the latest story large, the
 * rest in a grid, with University Ambassadors in a section of their own.
 * Each story has its own page at /news/:id.
 */
export default function News() {
  const navigate = useNavigate();

  // Old links pointed at /news#story-id; send them to the story's own page.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (findNews(id)) navigate(`/news/${id}`, { replace: true });
  }, [navigate]);

  useSEO({
    title: 'SlimFile Newsroom — Latest News and Updates',
    description: 'The latest SlimFile news: new tools, product launches, the University Ambassador Program, press coverage and events.',
    ogImage: absoluteUrl(NEWS[0].image),
  });

  const [latest, ...rest] = GENERAL_NEWS;

  return (
    <div className="min-h-screen bg-white pt-12 text-[#1d1d1f]">
      <section className="px-4 sm:px-6 pt-14 sm:pt-20 pb-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight leading-[1.05]">Newsroom.</h1>
          <p className="mt-4 text-xl sm:text-2xl text-[#6e6e73] max-w-2xl leading-snug">
            The latest news and updates from SlimFile.
          </p>
        </div>
      </section>

      {/* Latest story */}
      <section className="px-4 sm:px-6 pb-12">
        <Link to={`/news/${latest.id}`} className="group block max-w-6xl mx-auto">
          <article className="grid md:grid-cols-[1.4fr_1fr] rounded-[28px] overflow-hidden bg-[#f5f5f7] transition-shadow duration-300 hover:shadow-[0_24px_50px_-20px_rgba(0,0,0,0.22)]">
            <div className="aspect-[16/9] md:aspect-auto md:min-h-[380px] overflow-hidden bg-[#e8e8ed]">
              <img
                src={latest.image}
                alt={latest.imageAlt}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            </div>
            <div className="p-7 sm:p-10 flex flex-col">
              <p className="text-[13px] font-semibold text-red-600 uppercase tracking-wide">{latest.category}</p>
              <h2 className="mt-3 text-[28px] sm:text-[36px] font-semibold tracking-tight leading-[1.1]">{latest.title}</h2>
              <p className="mt-3 text-[17px] text-[#6e6e73] leading-relaxed line-clamp-4">{latest.subtitle}</p>
              <p className="mt-auto pt-6 text-[13px] text-[#6e6e73]">{formatNewsDate(latest)}</p>
            </div>
          </article>
        </Link>
      </section>

      {/* University Ambassadors */}
      <section className="px-4 sm:px-6 pb-14">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 mb-6">
            <h2 className="text-[28px] sm:text-[32px] font-semibold tracking-tight">Our University Ambassadors.</h2>
            <Link to="/news/slimfile-university-ambassador-program" className="text-[15px] text-red-600 hover:underline">
              About the program ›
            </Link>
          </div>
          <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
            {AMBASSADOR_STORIES.map(item => <AmbassadorCard key={item.id} item={item} />)}
          </div>
        </div>
      </section>

      {/* Everything else */}
      <section className="px-4 sm:px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[28px] sm:text-[32px] font-semibold tracking-tight mb-6">More from SlimFile.</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map(item => <NewsCard key={item.id} item={item} />)}
          </div>
        </div>
      </section>
    </div>
  );
}

function AmbassadorCard({ item }: { item: NewsItem }) {
  const person = item.ambassador!;
  return (
    <Link to={`/news/${item.id}`} className="group block h-full">
      <article className="h-full flex flex-col rounded-[22px] overflow-hidden bg-[#f5f5f7] transition-shadow duration-300 hover:shadow-[0_20px_44px_-20px_rgba(0,0,0,0.22)]">
        <div className="aspect-[4/5] overflow-hidden bg-[#e8e8ed]">
          <img
            src={person.portrait}
            alt={item.imageAlt}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </div>
        <div className="p-4 sm:p-5 flex flex-col flex-1">
          <h3 className="text-[17px] sm:text-[19px] font-semibold tracking-tight leading-snug">{person.name}</h3>
          <p className="mt-1 text-[13px] sm:text-[14px] text-[#6e6e73] leading-snug">{person.university}</p>
          {person.badge && <p className="mt-2 text-[12px] font-semibold text-red-600 leading-snug">{person.badge}</p>}
        </div>
      </article>
    </Link>
  );
}

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link to={`/news/${item.id}`} className="group block h-full">
      <article className="h-full flex flex-col rounded-[22px] overflow-hidden bg-[#f5f5f7] transition-shadow duration-300 hover:shadow-[0_20px_44px_-20px_rgba(0,0,0,0.22)]">
        <div className="aspect-[16/9] overflow-hidden bg-[#e8e8ed]">
          <img
            src={item.image}
            alt={item.imageAlt}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </div>
        <div className="p-6 flex flex-col flex-1">
          <p className="text-[12px] font-semibold text-red-600 uppercase tracking-wide">{item.category}</p>
          <h3 className="mt-2 text-[19px] font-semibold tracking-tight leading-snug">{item.title}</h3>
          <p className="mt-auto pt-4 flex items-center justify-between text-[13px] text-[#6e6e73]">
            {formatNewsDate(item)}
            <ChevronRight className="w-4 h-4 text-red-600 transition-transform duration-300 group-hover:translate-x-0.5" />
          </p>
        </div>
      </article>
    </Link>
  );
}
