import { Link, Outlet } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import GitHubIcon from "./GitHubIcon";
import LinkedInIcon from "./LinkedInIcon";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      )}
    </button>
  );
};

const MainLayout = () => {
  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100">
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-gray-800 bg-white/40 dark:bg-black/20 backdrop-blur-md sticky top-0 z-10 transition-colors duration-300">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-baseline space-x-8">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
              <Link
                to="/"
                className="hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors duration-150"
              >
                George Thomas
              </Link>
            </h1>
            <nav className="hidden sm:flex space-x-6 text-base sm:text-lg">
              <Link
                to="/about"
                className="text-gray-700 dark:text-gray-300 font-medium hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors duration-150"
              >
                About
              </Link>
              <Link
                to="/tools"
                className="text-gray-700 dark:text-gray-300 font-medium hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors duration-150"
              >
                Tools
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <a
              href="https://github.com/geotho"
              className="text-gray-600 dark:text-gray-400 hover:text-indigo-700 dark:hover:text-indigo-400 transition-all duration-150 hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <GitHubIcon className="w-6 h-6" />
            </a>
            <a
              href="https://linkedin.com/in/geotho"
              className="text-gray-600 dark:text-gray-400 hover:text-indigo-700 dark:hover:text-indigo-400 transition-all duration-150 hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <LinkedInIcon className="w-6 h-6" />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
