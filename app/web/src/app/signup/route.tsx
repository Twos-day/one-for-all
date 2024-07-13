import { RouteObject } from "react-router-dom";
import { loadPage } from "../_lib/loadPage";

export const signupRoute: RouteObject[] = [
  {
    path: "/signup",
    lazy: () => loadPage(import("./page")),
  },
  {
    path: "/signup/register",
    lazy: () => loadPage(import("./register/page")),
    errorElement: <div>error</div>,
  },
];
