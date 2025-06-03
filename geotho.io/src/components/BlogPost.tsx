import React from 'react';

interface BlogPostProps {
  title: string;
  date: string;
  children: React.ReactNode;
}

const BlogPost: React.FC<BlogPostProps> = ({ title, date, children }) => {
  return (
    <article className="prose lg:prose-xl mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        <p className="text-gray-600 text-sm">{date}</p>
      </header>
      <section>{children}</section>
    </article>
  );
};

export default BlogPost;
