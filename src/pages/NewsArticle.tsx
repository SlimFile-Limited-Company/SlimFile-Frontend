import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ChevronLeft, Link2, Check } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import { NEWS, absoluteUrl, findNews, formatNewsDate, newsArticleSchema, newsUrl } from '@/lib/news';
import { NewsCard } from './News';

/** One news story, with the article details Google reads for Search and Discover. */
export default function NewsArticle() {
  const { newsId } = useParams<{ newsId: string }>();
  const item = findNews(newsId);
  const [copied, setCopied] = useState(false);

  useSEO({
    title: item ? `${item.title} — SlimFile Newsroom` : 'SlimFile Newsroom',
    description: item?.subtitle || 'The latest news and updates from SlimFile.',
    canonical: item ? newsUrl(item) : undefined,
    ogImage: item ? absoluteUrl(item.image) : undefined,
    ogType: 'article',
  });

  useEffect(() => {
    if (!item) return;
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.text = JSON.stringify(newsArticleSchema(item));
    document.head.appendChild(el);
    window.scrollTo(0, 0);
    return () => el.remove();
  }, [item]);

  if (!item) return <Navigate to="/news" replace />;

  const more = NEWS.filter(n => n.id !== item.id).slice(0, 3);
  const url = newsUrl(item);
  const shareText = encodeURIComponent(`${item.title} ${url}`);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard blocked */ }
  };

  return (
    <div className="min-h-screen bg-white pt-12 text-[#1d1d1f]">
      <article className="px-4 sm:px-6 pt-10 sm:pt-14">
        <div className="max-w-3xl mx-auto">
          <Link to="/news" className="inline-flex items-center gap-0.5 text-[15px] text-red-600 hover:underline">
            <ChevronLeft className="w-4 h-4" /> Newsroom
          </Link>
          <p className="mt-8 text-[13px] font-semibold text-red-600 uppercase tracking-wide">
            {item.category} <span className="text-[#6e6e73] font-normal normal-case tracking-normal">· {formatNewsDate(item)}</span>
          </p>
          <h1 className="mt-3 text-4xl sm:text-[52px] font-semibold tracking-tight leading-[1.07]">{item.title}</h1>
          <p className="mt-5 text-xl sm:text-[23px] text-[#6e6e73] leading-snug">{item.subtitle}</p>
        </div>

        <div className="max-w-5xl mx-auto mt-10">
          <img src={item.image} alt={item.imageAlt} className="w-full aspect-[16/9] object-cover rounded-[28px] bg-[#f5f5f7]" />
        </div>

        <div className="max-w-3xl mx-auto mt-12 space-y-10">
          {item.highlights.map(h => (
            <section key={h.title}>
              <h2 className="text-[24px] sm:text-[28px] font-semibold tracking-tight">{h.title}</h2>
              <p className="mt-3 text-[17px] sm:text-[19px] leading-relaxed text-[#1d1d1f]/85">{h.note}</p>
            </section>
          ))}

          {item.ctas.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-2">
              {item.ctas.map(c => {
                const cls = c.secondary
                  ? 'h-11 px-6 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] text-[15px] font-medium inline-flex items-center'
                  : 'h-11 px-6 rounded-full bg-red-600 hover:bg-red-700 text-white text-[15px] font-medium inline-flex items-center';
                return c.external ? (
                  <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" className={cls}>{c.label}</a>
                ) : (
                  <Link key={c.label} to={c.href} className={cls}>{c.label}</Link>
                );
              })}
            </div>
          )}

          {/* Share */}
          <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-black/[0.06]">
            <span className="text-[13px] text-[#6e6e73] mr-1">Share</span>
            <a href={`https://wa.me/?text=${shareText}`} target="_blank" rel="noopener noreferrer" className="h-9 px-4 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[13px] inline-flex items-center">WhatsApp</a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" className="h-9 px-4 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[13px] inline-flex items-center">LinkedIn</a>
            <a href={`https://x.com/intent/tweet?text=${shareText}`} target="_blank" rel="noopener noreferrer" className="h-9 px-4 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[13px] inline-flex items-center">X</a>
            <button onClick={copyLink} className="h-9 px-4 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[13px] inline-flex items-center gap-1.5">
              {copied ? <><Check className="w-3.5 h-3.5 text-red-600" /> Copied</> : <><Link2 className="w-3.5 h-3.5" /> Copy link</>}
            </button>
          </div>
        </div>
      </article>

      <section className="px-4 sm:px-6 pt-16 pb-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[28px] sm:text-[32px] font-semibold tracking-tight mb-6">More news.</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {more.map(n => <NewsCard key={n.id} item={n} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
