import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface RelatedPost {
  title: string;
  description: string;
  href: string;
  category?: string;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
  title?: string;
}

export function RelatedPosts({ posts, title = "Related Articles" }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post, index) => (
            <Link
              key={index}
              to={post.href}
              className="group bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-red-300 hover:shadow-md transition-all"
            >
              {post.category && (
                <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">
                  {post.category}
                </span>
              )}
              <h3 className="text-lg font-semibold text-gray-900 mt-2 mb-2 group-hover:text-red-600 transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.description}</p>
              <div className="flex items-center text-red-600 text-sm font-medium">
                Read more
                <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
