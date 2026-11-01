import newsData from '@/data/news.json';

export interface NewsCta {
  label: string;
  href: string;
  external?: boolean;
  secondary?: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  subtitle: string;
  /** ISO date, for search engines */
  date: string;
  /** Shown instead of the full date when only the year is known */
  dateLabel?: string;
  category: string;
  /** At least 1,200px wide, so Google Discover can show it large */
  image: string;
  imageAlt: string;
  /** Optional line under the image, e.g. who is in the photo */
  imageCaption?: string;
  /** Set on the one story the home page should point to, as its short line */
  homeLine?: string;
  /** Shorter version of homeLine for phones */
  homeLineShort?: string;
  highlights: { title: string; note: string }[];
  ctas: NewsCta[];
}

const SITE = 'https://www.slim-file.com';

// Newest first
export const NEWS: NewsItem[] = [...(newsData as NewsItem[])].sort((a, b) => b.date.localeCompare(a.date));

export const findNews = (id?: string) => NEWS.find(n => n.id === id);

/** The story the home page points to: the one with a homeLine, else the newest. */
export const homeNews = () => NEWS.find(n => n.homeLine) ?? NEWS[0];

export const absoluteUrl = (src: string) => (src.startsWith('http') ? src : `${SITE}${src}`);

export const newsUrl = (item: NewsItem) => `${SITE}/news/${item.id}`;

export const formatNewsDate = (item: NewsItem) =>
  item.dateLabel ||
  new Date(`${item.date}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

/** Article details Google reads for Search and Discover. */
export const newsArticleSchema = (item: NewsItem) => ({
  '@context': 'https://schema.org',
  '@type': 'NewsArticle',
  headline: item.title,
  description: item.subtitle,
  image: [absoluteUrl(item.image)],
  datePublished: item.date,
  dateModified: item.date,
  author: { '@type': 'Organization', name: 'SlimFile', url: SITE },
  publisher: {
    '@type': 'Organization',
    name: 'SlimFile',
    logo: { '@type': 'ImageObject', url: `${SITE}/favicon.png` },
  },
  mainEntityOfPage: { '@type': 'WebPage', '@id': newsUrl(item) },
});
