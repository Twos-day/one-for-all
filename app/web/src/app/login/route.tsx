import { RouteObject } from "react-router-dom";
import { loadPage } from "../_lib/loadPage";

export const loginRoute: RouteObject[] = [
  {
    path: "/login",
    lazy: () => loadPage(import("./page")),
  },
  {
    path: "/login/email",
    lazy: () => loadPage(import("./email/page")),
  },
];
