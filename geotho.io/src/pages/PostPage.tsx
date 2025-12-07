import { Navigate, useParams } from "react-router-dom";
import BlogPost from "../components/BlogPost";
import posts from "../posts";

const PostPage = () => {
  const { slug } = useParams();

  if (!slug) {
    return <Navigate to="/" replace />;
  }

  // Normalise trailing slashes and match the slug exactly.
  const normalizedSlug = slug.replace(/\/+$/, "");
  const post = posts.find((p) => p.slug === normalizedSlug);

  if (!post) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="w-full bg-white/80 dark:bg-gray-900/70 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 backdrop-blur">
      <BlogPost title={post.attributes.title} date={post.attributes.date}>
        <post.Content />
      </BlogPost>
    </div>
  );
};

export default PostPage;
