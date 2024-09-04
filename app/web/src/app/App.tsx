import { lazyHelper } from "@/app/_lib/lazyHelper";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { mobileRoute } from "./(mobile)/route";
import Notfound from "./not-found";
import RootLayout from "./RootLayout";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <div>400: error</div>,
      children: [
        {
          index: true,
          lazy: () => lazyHelper(import("./home/page")),
        },
        ...mobileRoute,
        {
          path: "/typing",
          lazy: () => lazyHelper(import("./typing/page")),
        },
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
