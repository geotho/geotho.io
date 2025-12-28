import { Link } from "react-router-dom";

const tools = [
  {
    name: "Hello World",
    path: "hello-world",
    description: "A simple example tool.",
  },
  {
    name: "Tailwind CSS Gradient Generator",
    path: "tailwind-css-gradient-generator",
    description: "Create beautiful gradients with Tailwind CSS.",
  },
  {
    name: "Muji Shelf Configurator",
    path: "muji-shelf-configurator",
    description: "Visualise and configure Muji shelves to scale.",
  },
];

const ToolsIndexPage = () => {
  return (
    <div className="bg-white/50 dark:bg-black/40 backdrop-blur-sm border border-black/10 dark:border-white/10 rounded-lg p-8">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-6">
        Tools
      </h2>
      <div className="space-y-4">
        {tools.map((tool) => (
          <Link
            key={tool.path}
            to={`/tools/${tool.path}`}
            className="block p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50/30 dark:hover:bg-gray-800/30 transition-colors duration-200"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{tool.name}</h3>
            <p className="text-gray-700 dark:text-gray-300 mt-2">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ToolsIndexPage;
