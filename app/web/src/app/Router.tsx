import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Notfound from "./notFound/page";
import signupRoutes from "./signup/route";
import { loadPage } from "@/app/_lib/loadPage";

const router = createBrowserRouter([
  {
    path: "/",
    lazy: () => loadPage(import("./home/page")),
  },
  {
    path: "/login",
    lazy: () => loadPage(import("./login/page")),
  },
  ...signupRoutes,
  {
    path: "*", // 404 Not Found
    element: <Notfound />,
  },
]);

export default function Router() {
  return (
    <>
      <div>asdasd</div>
      <RouterProvider router={router} />
    </>
  );
}
