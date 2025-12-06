import React from "react";

interface BlogPostProps {
  title: string;
  date: string;
  children: React.ReactNode;
}

const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMinutes < 1) {
    return "now";
  } else if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else if (diffWeeks < 4) {
    return `${diffWeeks}w ago`;
  } else if (diffMonths < 12) {
    return `${diffMonths}mo ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
};

const BlogPost: React.FC<BlogPostProps> = ({ title, date, children }) => {
  return (
    <article className="relative">
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h1>
      <time
        className="text-gray-600 dark:text-gray-300 text-xs font-mono bg-white/70 dark:bg-gray-800/70 px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700"
        dateTime={date}
      >
        {getRelativeTime(date)}
      </time>
      <section className="prose lg:prose-lg max-w-none pt-6 dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-headings:font-semibold prose-p:text-gray-800 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:text-indigo-500 dark:hover:prose-a:text-indigo-300 prose-li:text-gray-800 dark:prose-li:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-code:text-rose-600 dark:prose-code:text-rose-400 prose-code:bg-amber-50 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded prose-pre:bg-gray-50 dark:prose-pre:bg-gray-900 prose-pre:text-gray-900 dark:prose-pre:text-gray-100 prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-700 prose-img:rounded-lg prose-img:shadow-sm">
        {children}
      </section>
    </article>
  );
};

export default BlogPost;
