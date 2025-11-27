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
    <div className="max-w-3xl mx-auto">
      <BlogPost title={post.attributes.title} date={post.attributes.date}>
        <post.Content />
      </BlogPost>
    </div>
  );
};

export default PostPage;
