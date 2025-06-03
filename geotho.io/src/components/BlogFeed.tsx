import React, { useEffect, useState } from 'react';
import fm from 'front-matter';
import BlogPost from './BlogPost'; // Assuming BlogPost is in the same directory

interface PostAttributes {
  title: string;
  date: string;
  // Add other frontmatter attributes here if needed
}

interface Post {
  slug: string;
  attributes: PostAttributes;
  Content: React.ComponentType; // The MDX content
}

const BlogFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Use import.meta.glob to get all .mdx files from the posts directory
        // The ?raw suffix is important to load the raw content for front-matter
        const modules = import.meta.glob('/src/posts/**/*.mdx', { eager: false, as: 'raw' });

        const loadedPosts: Post[] = [];
        for (const path in modules) {
          try {
            const rawContent = await (modules[path] as () => Promise<string>)();
            const { attributes, body } = fm<PostAttributes>(rawContent);

            // Dynamically import the actual MDX component for rendering
            const mdxModule = await import(/* @vite-ignore */ path);
            const MdxContent = mdxModule.default;

            // Create a slug from the path (e.g., /src/posts/my-post.mdx -> my-post)
            const slug = path
              .split('/')
              .pop()
              ?.replace(/\.mdx$/, '') || '';

            if (attributes && attributes.title && attributes.date && MdxContent) {
              loadedPosts.push({
                slug,
                attributes,
                Content: MdxContent,
              });
            } else {
              console.warn(`Missing frontmatter or default export for ${path}`);
            }
          } catch (e) {
            console.error(`Error processing post ${path}:`, e);
            // Optionally skip this post or handle error differently
          }
        }

        // Sort posts by date in descending order
        loadedPosts.sort((a, b) => new Date(b.attributes.date).getTime() - new Date(a.attributes.date).getTime());
        setPosts(loadedPosts);
      } catch (err) {
        console.error('Failed to load posts:', err);
        setError('Failed to load posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <p className="text-center p-4">Loading posts...</p>;
  }

  if (error) {
    return <p className="text-center p-4 text-red-500">{error}</p>;
  }

  if (posts.length === 0) {
    return <p className="text-center p-4">No blog posts found.</p>;
  }

  return (
    <div className="space-y-12">
      {posts.map((post) => (
        <BlogPost key={post.slug} title={post.attributes.title} date={post.attributes.date}>
          <post.Content />
        </BlogPost>
      ))}
    </div>
  );
};

export default BlogFeed;
