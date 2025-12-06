import type { FC } from "react";

const AboutPage: FC = () => {
  return (
    <div className="backdrop-blur-sm bg-white/40 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-lg p-8 shadow-xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">About</h1>
      <div className="prose prose-lg text-gray-700 dark:text-gray-300 space-y-4">
        <p>
          My name is George. This is where I put fun things on the internet. I
          am a co-founder of{" "}
          <a
            href="https://clusterfudge.com"
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline transition-colors duration-200"
          >
            Clusterfudge
          </a>
          . Before that I was a Senior Software Engineer at Google DeepMind.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
