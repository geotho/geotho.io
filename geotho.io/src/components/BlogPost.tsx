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
      <h1 className="text-l font-bold">{title}</h1>
      <time
        className="absolute top-0 right-0 text-gray-500 text-xs font-mono bg-white/60 px-2 py-1 rounded-md backdrop-blur-sm border border-gray-200"
        dateTime={date}
      >
        {getRelativeTime(date)}
      </time>
      <section className="prose lg:prose-xl max-w-none pt-8 prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight prose-p:text-gray-800 prose-p:leading-relaxed prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:text-indigo-500 prose-a:transition-colors prose-li:text-gray-800 prose-strong:text-gray-900 prose-code:text-pink-600 prose-code:bg-white/60 prose-code:px-1 prose-code:rounded">
        {children}
      </section>
    </article>
  );
};

export default BlogPost;
