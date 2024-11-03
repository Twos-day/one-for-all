import "@/styles/global.css";
import "@/styles/globalTheme.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/app/App";

ReactDOM.hydrateRoot(
  document.getElementById("root")!,
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
