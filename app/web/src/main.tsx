import React from "react";
import ReactDOM from "react-dom/client";
import Config from "@/app/_component/Config.tsx";
import Router from "@/app/Router";
// import "@/style/global.css.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Config>
      <div>asdasd</div>
      <Router />
    </Config>
  </React.StrictMode>,
);
