import { Link } from "react-router-dom";

const tools = [
  {
    name: "Hello World",
    path: "hello-world",
    description: "A simple example tool.",
  },
];

const ToolsIndexPage = () => {
  return (
    <div className="bg-white/50 backdrop-blur-sm border border-black/10 rounded-lg p-8">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
        Tools
      </h2>
      <div className="space-y-4">
        {tools.map((tool) => (
          <Link
            key={tool.path}
            to={`/tools/${tool.path}`}
            className="block p-6 border border-gray-200 rounded-lg hover:bg-gray-50/50 transition-colors duration-200"
          >
            <h3 className="text-xl font-bold text-gray-900">{tool.name}</h3>
            <p className="text-gray-600 mt-2">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ToolsIndexPage;
