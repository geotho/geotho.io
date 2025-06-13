import React from "react";
import posts from "../posts";
import BlogPost from "./BlogPost";

const BlogFeed: React.FC = () => {
  if (posts.length === 0) {
    return <p className="text-center p-4">No blog posts found.</p>;
  }

  return (
    <div className="space-y-12">
      {posts.map((post) => (
        <BlogPost
          key={post.slug}
          title={post.attributes.title}
          date={post.attributes.date}
        >
          <post.Content />
        </BlogPost>
      ))}
    </div>
  );
};

export default BlogFeed;
