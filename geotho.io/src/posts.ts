import fm from "front-matter";
import React from "react";

// When you add a new post, you need to import its component and raw content.
import HelloWorldContent from "./posts/hello-world.mdx";
import helloWorldRaw from "./posts/hello-world.mdx?raw";

interface PostAttributes {
  title: string;
  date: string;
}

interface Post {
  slug: string;
  attributes: PostAttributes;
  Content: React.ComponentType;
}

const allPosts: Post[] = [
  {
    slug: "hello-world",
    attributes: fm<PostAttributes>(helloWorldRaw).attributes,
    Content: HelloWorldContent,
  },
  // Add other posts here, following the same pattern.
];

// Sort posts by date in descending order
const sortedPosts = allPosts.sort(
  (a, b) =>
    new Date(b.attributes.date).getTime() -
    new Date(a.attributes.date).getTime()
);

export default sortedPosts;
