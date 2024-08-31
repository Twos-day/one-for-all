import { RouteObject } from "react-router-dom";
import { lazyHelper } from "../_lib/lazyHelper";
import MobileLayout from "./_component/MobileLayout";

export const mobileRoute: RouteObject[] = [
  {
    path: "login",
    element: <MobileLayout />,
    children: [
      {
        index: true,
        lazy: () => lazyHelper(import("./login/page")),
      },
      {
        path: "email",
        lazy: () => lazyHelper(import("./login/email/page")),
      },
    ],
  },
  {
    path: "signup",
    element: <MobileLayout />,
    children: [
      {
        index: true,
        lazy: () => lazyHelper(import("./signup/page")),
      },
      {
        path: "register",
        lazy: () => lazyHelper(import("./signup/register/page")),
      },
    ],
  },
];
