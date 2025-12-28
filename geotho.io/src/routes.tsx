import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
import PostPage from "./pages/PostPage";
import ToolsIndexPage from "./pages/ToolsIndexPage";
import GradientGenerator from "./tools/GradientGenerator";
import HelloWorld from "./tools/HelloWorld";
import MujiShelfConfigurator from "./tools/MujiShelfConfigurator";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "tools",
        children: [
          {
            index: true,
            element: <ToolsIndexPage />,
          },
          {
            path: "hello-world",
            element: <HelloWorld />,
          },
          {
            path: "gradient-generator",
            element: <GradientGenerator />,
          },
          {
            path: "muji-shelf-configurator",
            element: <MujiShelfConfigurator />,
          },
        ],
      },
      {
        path: "post",
        children: [
          {
            path: ":slug",
            element: <PostPage />,
          },
          {
            path: ":slug/",
            element: <PostPage />,
          },
        ],
      },
    ],
  },
]);
