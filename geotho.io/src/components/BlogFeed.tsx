import React from "react";
import { Link } from "react-router-dom";
import posts from "../posts";

const BlogFeed: React.FC = () => {
  if (posts.length === 0) {
    return <p className="text-center p-4 text-gray-600 dark:text-gray-400">No blog posts found.</p>;
  }

  const grouped = posts.reduce<Record<string, typeof posts>>((acc, post) => {
    const year = new Date(post.attributes.date).getFullYear().toString();
    acc[year] = acc[year] || [];
    acc[year].push(post);
    return acc;
  }, {});

  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="space-y-6">
      {years.map((year) => (
        <section key={year}>
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-px flex-1 bg-gray-700 dark:bg-gray-300" />
            <span className="text-xs font-semibold tracking-wide text-gray-900 dark:text-gray-100">
              {year}
            </span>
            <div className="h-px flex-1 bg-gray-700 dark:bg-gray-300" />
          </div>
          <div className="space-y-0">
            {grouped[year].map((post) => (
              <Link
                key={post.slug}
                to={`/post/${post.slug}`}
                className="flex items-baseline justify-between rounded-md border border-transparent px-3 py-2 transition-colors duration-75 hover:border-gray-200 dark:hover:border-gray-700 hover:bg-white/50 dark:hover:bg-gray-800/50"
              >
                <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {post.attributes.title}
                </span>
                <time
                  className="text-xs text-gray-600 dark:text-gray-300 font-mono ml-4 whitespace-nowrap"
                  dateTime={post.attributes.date}
                >
                  {new Date(post.attributes.date).toLocaleDateString(
                    undefined,
                    {
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </time>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default BlogFeed;
