import BlogFeed from "./components/BlogFeed";
import GitHubIcon from "./components/GitHubIcon";
import LinkedInIcon from "./components/LinkedInIcon";

function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Compact header */}
      <header className="border-b border-zinc-100 py-8 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-light tracking-tight text-zinc-900 leading-none mb-1">
                George Thomas
              </h1>
              <div className="text-zinc-600 font-light">
                Cofounder of{" "}
                <a 
                  href="https://clusterfudge.com" 
                  className="text-zinc-900 font-medium underline decoration-zinc-200 hover:decoration-zinc-900 transition-all duration-200"
                >
                  Clusterfudge
                </a>
              </div>
            </div>

            {/* Social icons */}
            <div className="flex space-x-4">
              <a
                href="https://github.com/geotho"
                className="text-zinc-400 hover:text-zinc-900 transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <GitHubIcon />
              </a>
              <a
                href="https://linkedin.com/in/geotho"
                className="text-zinc-400 hover:text-zinc-900 transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <BlogFeed />
        </div>
      </main>
    </div>
  );
}

export default App;
