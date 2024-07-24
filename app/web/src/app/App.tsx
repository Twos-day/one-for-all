import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Notfound from "./notFound/page";
import { signupRoute } from "./signup/route";
import { loadPage } from "@/app/_lib/loadPage";
import RootLayout from "./RootLayout";
import { loginRoute } from "./login/route";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          index: true,
          lazy: () => loadPage(import("./home/page")),
        },
        ...loginRoute,
        ...signupRoute,
        {
          path: "*", // 404 Not Found
          element: <Notfound />,
        },
      ],
    },
  ],
  {
    hydrationData: {},
  },
);

export default function App() {
  return <RouterProvider router={router} />;
}
