import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
import PostPage from "./pages/PostPage";
import ToolsIndexPage from "./pages/ToolsIndexPage";
import GradientGenerator from "./tools/GradientGenerator";
import HelloWorld from "./tools/HelloWorld";

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
