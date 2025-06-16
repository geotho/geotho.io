import { Link, Outlet } from "react-router-dom";
import GitHubIcon from "./GitHubIcon";
import LinkedInIcon from "./LinkedInIcon";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100">
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-black/10 backdrop-blur-sm bg-white/20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-baseline space-x-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              <Link
                to="/"
                className="hover:text-indigo-600 transition-colors duration-200"
              >
                George Thomas
              </Link>
            </h1>
            <nav className="hidden sm:flex space-x-6 text-base sm:text-lg">
              <Link
                to="/about"
                className="text-gray-700 font-medium hover:text-indigo-600 transition-colors duration-200"
              >
                About
              </Link>
              <Link
                to="/tools"
                className="text-gray-700 font-medium hover:text-indigo-600 transition-colors duration-200"
              >
                Tools
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/geotho"
              className="text-gray-600 hover:text-indigo-600 transition-all duration-200 hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <GitHubIcon className="w-6 h-6" />
            </a>
            <a
              href="https://linkedin.com/in/geotho"
              className="text-gray-600 hover:text-indigo-600 transition-all duration-200 hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <LinkedInIcon className="w-6 h-6" />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
