import React from "react";

interface BlogPostProps {
  title: string;
  date: string;
  children: React.ReactNode;
}

const BlogPost: React.FC<BlogPostProps> = ({ title, date, children }) => {
  return (
    <article className="prose prose-zinc lg:prose-xl mx-auto px-6 py-8 max-w-4xl">
      <header className="mb-12 border-b border-zinc-200 pb-8">
        <h1 className="text-5xl font-bold mb-4 text-zinc-900 leading-tight">
          {title}
        </h1>
        <time className="text-zinc-500 text-lg font-medium" dateTime={date}>
          {new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </header>
      <section className="prose-headings:text-zinc-900 prose-headings:font-semibold prose-p:text-zinc-700 prose-p:leading-relaxed prose-li:text-zinc-700 prose-strong:text-zinc-900">
        {children}
      </section>
    </article>
  );
};

export default BlogPost;
