import fm from "front-matter";
import React from "react";

// When you add a new post, you need to import its component and raw content.
import RejectUnrecognisedParametersContent from "./posts/2016-02-22-reject-unrecognised-parameters.mdx";
import rejectUnrecognisedParametersRaw from "./posts/2016-02-22-reject-unrecognised-parameters.mdx?raw";
import KakuroSolvingContent from "./posts/2016-07-07-kakuro-solving.mdx";
import kakuroSolvingRaw from "./posts/2016-07-07-kakuro-solving.mdx?raw";
import ForestForTheTreesContent from "./posts/2016-07-28-forest-for-the-trees.mdx";
import forestForTheTreesRaw from "./posts/2016-07-28-forest-for-the-trees.mdx?raw";
import AnalysingRuntimeAlgorithmsContent from "./posts/2016-07-31-analysing-runtime-algorithms.mdx";
import analysingRuntimeAlgorithmsRaw from "./posts/2016-07-31-analysing-runtime-algorithms.mdx?raw";
import EmailUnsubscriptionUxContent from "./posts/2016-08-03-email-unsubscription-ux.mdx";
import emailUnsubscriptionUxRaw from "./posts/2016-08-03-email-unsubscription-ux.mdx?raw";
import WhiteboardCodingInterviewsContent from "./posts/2016-08-09-whiteboard-coding-interviews.mdx";
import whiteboardCodingInterviewsRaw from "./posts/2016-08-09-whiteboard-coding-interviews.mdx?raw";
import DisplayLessStuffContent from "./posts/2016-08-20-display-less-stuff.mdx";
import displayLessStuffRaw from "./posts/2016-08-20-display-less-stuff.mdx?raw";
import RecoveringPrivacyZonesStravaContent from "./posts/2016-09-04-recovering-privacy-zones-strava.mdx";
import recoveringPrivacyZonesStravaRaw from "./posts/2016-09-04-recovering-privacy-zones-strava.mdx?raw";
import LifeWithoutAPhoneContent from "./posts/2016-11-20-life-without-a-phone.mdx";
import lifeWithoutAPhoneRaw from "./posts/2016-11-20-life-without-a-phone.mdx?raw";
import AddJsonTagsToGoStructsContent from "./posts/2016-12-05-add-json-tags-to-go-structs.mdx";
import addJsonTagsToGoStructsRaw from "./posts/2016-12-05-add-json-tags-to-go-structs.mdx?raw";
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
    slug: "2016-07-28-forest-for-the-trees",
    attributes: fm<PostAttributes>(forestForTheTreesRaw).attributes,
    Content: ForestForTheTreesContent,
  },
  {
    slug: "2016-07-31-analysing-runtime-algorithms",
    attributes: fm<PostAttributes>(analysingRuntimeAlgorithmsRaw).attributes,
    Content: AnalysingRuntimeAlgorithmsContent,
  },
  {
    slug: "2016-08-03-email-unsubscription-ux",
    attributes: fm<PostAttributes>(emailUnsubscriptionUxRaw).attributes,
    Content: EmailUnsubscriptionUxContent,
  },
  {
    slug: "2016-08-09-whiteboard-coding-interviews",
    attributes: fm<PostAttributes>(whiteboardCodingInterviewsRaw).attributes,
    Content: WhiteboardCodingInterviewsContent,
  },
  {
    slug: "2016-08-20-display-less-stuff",
    attributes: fm<PostAttributes>(displayLessStuffRaw).attributes,
    Content: DisplayLessStuffContent,
  },
  {
    slug: "2016-09-04-recovering-privacy-zones-strava",
    attributes: fm<PostAttributes>(recoveringPrivacyZonesStravaRaw).attributes,
    Content: RecoveringPrivacyZonesStravaContent,
  },
  {
    slug: "2016-11-20-life-without-a-phone",
    attributes: fm<PostAttributes>(lifeWithoutAPhoneRaw).attributes,
    Content: LifeWithoutAPhoneContent,
  },
  {
    slug: "2016-12-05-add-json-tags-to-go-structs",
    attributes: fm<PostAttributes>(addJsonTagsToGoStructsRaw).attributes,
    Content: AddJsonTagsToGoStructsContent,
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
