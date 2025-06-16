import React from "react";
import posts from "../posts";
import BlogPost from "./BlogPost";

const BlogFeed: React.FC = () => {
  if (posts.length === 0) {
    return <p className="text-center p-4 text-gray-600">No blog posts found.</p>;
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.slug} className="backdrop-blur-sm bg-white/40 border border-white/20 rounded-lg p-6 shadow-xl hover:bg-white/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/20">
          <BlogPost
            title={post.attributes.title}
            date={post.attributes.date}
          >
            <post.Content />
          </BlogPost>
        </div>
      ))}
    </div>
  );
};

export default BlogFeed;
