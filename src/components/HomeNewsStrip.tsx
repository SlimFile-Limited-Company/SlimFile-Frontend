import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { homeNews } from '@/lib/news';

/** A one-line pointer to a news story at the top of the home page, like apple.com's. */
export default function HomeNewsStrip() {
  const story = homeNews();
  return (
    <Link
      to={`/news/${story.id}`}
      className="group mx-auto mb-8 sm:mb-10 flex w-full sm:w-fit max-w-full items-center justify-center gap-2 rounded-full bg-[#f5f5f7] px-4 py-2 text-[13px] sm:text-[14px] text-[#1d1d1f] hover:bg-[#e8e8ed] transition-colors"
    >
      <span className="shrink-0 font-semibold text-red-600">New</span>
      <span className="truncate sm:hidden">{story.homeLineShort ?? story.homeLine ?? story.title}</span>
      <span className="truncate hidden sm:inline">{story.homeLine ?? story.title}</span>
      <span className="hidden sm:inline-flex shrink-0 items-center text-red-600">
        Learn more <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
      </span>
      <ChevronRight className="sm:hidden w-4 h-4 shrink-0 text-red-600" />
    </Link>
  );
}
