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
import BriefNotesOnHomoDeusContent from "./posts/2016-12-12-brief-notes-on-homo-deus.mdx";
import briefNotesOnHomoDeusRaw from "./posts/2016-12-12-brief-notes-on-homo-deus.mdx?raw";
import CmdotpGoogleAuthenticatorContent from "./posts/2016-12-22-cmdotp-google-authenticator-for-the-command-line.mdx";
import cmdotpGoogleAuthenticatorRaw from "./posts/2016-12-22-cmdotp-google-authenticator-for-the-command-line.mdx?raw";
import ThoughtsOnEUnibusPluramContent from "./posts/2016-12-26-thoughts-on-e-unibus-pluram.mdx";
import thoughtsOnEUnibusPluramRaw from "./posts/2016-12-26-thoughts-on-e-unibus-pluram.mdx?raw";
import OnMindcrimeContent from "./posts/2017-01-16-on-mindcrime.mdx";
import onMindcrimeRaw from "./posts/2017-01-16-on-mindcrime.mdx?raw";
import ReversingDomainsContent from "./posts/2017-02-12-reversing-domains.mdx";
import reversingDomainsRaw from "./posts/2017-02-12-reversing-domains.mdx?raw";
import SoftwareEngineeringInternshipTipsContent from "./posts/2017-03-19-software-engineering-internship-tips.mdx";
import softwareEngineeringInternshipTipsRaw from "./posts/2017-03-19-software-engineering-internship-tips.mdx?raw";
import FunctionSignatureContent from "./posts/2017-03-25-function-signature.mdx";
import functionSignatureRaw from "./posts/2017-03-25-function-signature.mdx?raw";
import GoTableTestTipsContent from "./posts/2017-04-13-go-table-test-tips.mdx";
import goTableTestTipsRaw from "./posts/2017-04-13-go-table-test-tips.mdx?raw";
import GoBetterProgrammerContent from "./posts/2017-06-06-go-better-programmer.mdx";
import goBetterProgrammerRaw from "./posts/2017-06-06-go-better-programmer.mdx?raw";
import IntegerOverflowContent from "./posts/2017-07-03-integer-overflow.mdx";
import integerOverflowRaw from "./posts/2017-07-03-integer-overflow.mdx?raw";
import UnittestNondeterminismContent from "./posts/2017-08-02-unittest-nondeterminism.mdx";
import unittestNondeterminismRaw from "./posts/2017-08-02-unittest-nondeterminism.mdx?raw";
import WeightedSamplingContent from "./posts/2018-08-26-weighted-sampling.mdx";
import weightedSamplingRaw from "./posts/2018-08-26-weighted-sampling.mdx?raw";
import JekyllToHugoContent from "./posts/2020-05-28-jekyll-to-hugo.mdx";
import jekyllToHugoRaw from "./posts/2020-05-28-jekyll-to-hugo.mdx?raw";
import UniformRandomSelectionFromChannelContent from "./posts/2020-06-29-uniform-random-selection-from-channel.mdx";
import uniformRandomSelectionFromChannelRaw from "./posts/2020-06-29-uniform-random-selection-from-channel.mdx?raw";
import WhatILearntDataScienceToolingContent from "./posts/2020-08-09-what-i-learnt-data-science-tooling.mdx";
import whatILearntDataScienceToolingRaw from "./posts/2020-08-09-what-i-learnt-data-science-tooling.mdx?raw";
import ApproachForSystemDesignInterviewsContent from "./posts/2020-08-12-approach-for-system-design-interviews.mdx";
import approachForSystemDesignInterviewsRaw from "./posts/2020-08-12-approach-for-system-design-interviews.mdx?raw";
import RecordFrictionToBuildQualitySoftwareContent from "./posts/2020-08-31-record-friction-to-build-quality-software.mdx";
import recordFrictionToBuildQualitySoftwareRaw from "./posts/2020-08-31-record-friction-to-build-quality-software.mdx?raw";
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
    slug: "2016-12-12-brief-notes-on-homo-deus",
    attributes: fm<PostAttributes>(briefNotesOnHomoDeusRaw).attributes,
    Content: BriefNotesOnHomoDeusContent,
  },
  {
    slug: "2016-12-22-cmdotp-google-authenticator-for-the-command-line",
    attributes: fm<PostAttributes>(cmdotpGoogleAuthenticatorRaw).attributes,
    Content: CmdotpGoogleAuthenticatorContent,
  },
  {
    slug: "2016-12-26-thoughts-on-e-unibus-pluram",
    attributes: fm<PostAttributes>(thoughtsOnEUnibusPluramRaw).attributes,
    Content: ThoughtsOnEUnibusPluramContent,
  },
  {
    slug: "2017-01-16-on-mindcrime",
    attributes: fm<PostAttributes>(onMindcrimeRaw).attributes,
    Content: OnMindcrimeContent,
  },
  {
    slug: "2017-02-12-reversing-domains",
    attributes: fm<PostAttributes>(reversingDomainsRaw).attributes,
    Content: ReversingDomainsContent,
  },
  {
    slug: "2017-03-19-software-engineering-internship-tips",
    attributes: fm<PostAttributes>(softwareEngineeringInternshipTipsRaw).attributes,
    Content: SoftwareEngineeringInternshipTipsContent,
  },
  {
    slug: "2017-03-25-function-signature",
    attributes: fm<PostAttributes>(functionSignatureRaw).attributes,
    Content: FunctionSignatureContent,
  },
  {
    slug: "2017-04-13-go-table-test-tips",
    attributes: fm<PostAttributes>(goTableTestTipsRaw).attributes,
    Content: GoTableTestTipsContent,
  },
  {
    slug: "2017-06-06-go-better-programmer",
    attributes: fm<PostAttributes>(goBetterProgrammerRaw).attributes,
    Content: GoBetterProgrammerContent,
  },
  {
    slug: "2017-07-03-integer-overflow",
    attributes: fm<PostAttributes>(integerOverflowRaw).attributes,
    Content: IntegerOverflowContent,
  },
  {
    slug: "2017-08-02-unittest-nondeterminism",
    attributes: fm<PostAttributes>(unittestNondeterminismRaw).attributes,
    Content: UnittestNondeterminismContent,
  },
  {
    slug: "2018-08-26-weighted-sampling",
    attributes: fm<PostAttributes>(weightedSamplingRaw).attributes,
    Content: WeightedSamplingContent,
  },
  {
    slug: "2020-05-28-jekyll-to-hugo",
    attributes: fm<PostAttributes>(jekyllToHugoRaw).attributes,
    Content: JekyllToHugoContent,
  },
  {
    slug: "2020-06-29-uniform-random-selection-from-channel",
    attributes: fm<PostAttributes>(uniformRandomSelectionFromChannelRaw).attributes,
    Content: UniformRandomSelectionFromChannelContent,
  },
  {
    slug: "2020-08-09-what-i-learnt-data-science-tooling",
    attributes: fm<PostAttributes>(whatILearntDataScienceToolingRaw).attributes,
    Content: WhatILearntDataScienceToolingContent,
  },
  {
    slug: "2020-08-12-approach-for-system-design-interviews",
    attributes: fm<PostAttributes>(approachForSystemDesignInterviewsRaw).attributes,
    Content: ApproachForSystemDesignInterviewsContent,
  },
  {
    slug: "2020-08-31-record-friction-to-build-quality-software",
    attributes: fm<PostAttributes>(recordFrictionToBuildQualitySoftwareRaw).attributes,
    Content: RecordFrictionToBuildQualitySoftwareContent,
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
