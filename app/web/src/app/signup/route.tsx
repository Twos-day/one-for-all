import { RouteObject } from "react-router-dom";
import { loadPage } from "../_lib/loadPage";

const signupRoutes: RouteObject[] = [
  {
    path: "/signup",
    lazy: () => loadPage(import("./page")),
  },
  {
    path: "/signup/register",
    lazy: () => loadPage(import("./register/page")),
  },
];

export default signupRoutes;
