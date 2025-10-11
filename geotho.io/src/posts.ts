import fm from "front-matter";
import React from "react";

// When you add a new post, you need to import its component and raw content.
import RejectUnrecognisedParametersContent from "./posts/2016-02-22-reject-unrecognised-parameters.mdx";
import rejectUnrecognisedParametersRaw from "./posts/2016-02-22-reject-unrecognised-parameters.mdx?raw";
import KakuroSolvingContent from "./posts/2016-07-07-kakuro-solving.mdx";
import kakuroSolvingRaw from "./posts/2016-07-07-kakuro-solving.mdx?raw";
import HelloWorldContent from "./posts/hello-world.mdx";
import helloWorldRaw from "./posts/hello-world.mdx?raw";
import SoyToryContent from "./posts/soy-tory.mdx";
import soyToryRaw from "./posts/soy-tory.mdx?raw";

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
    slug: "2016-02-22-reject-unrecognised-parameters",
    attributes: fm<PostAttributes>(rejectUnrecognisedParametersRaw).attributes,
    Content: RejectUnrecognisedParametersContent,
  },
  {
    slug: "2016-07-07-kakuro-solving",
    attributes: fm<PostAttributes>(kakuroSolvingRaw).attributes,
    Content: KakuroSolvingContent,
  },
  {
    slug: "hello-world",
    attributes: fm<PostAttributes>(helloWorldRaw).attributes,
    Content: HelloWorldContent,
  },
  {
    slug: "soy-tory",
    attributes: fm<PostAttributes>(soyToryRaw).attributes,
    Content: SoyToryContent,
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
