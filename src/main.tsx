import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import "./index.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import { BrowserRouter } from "react-router-dom";

const root = document.documentElement;
const style = getComputedStyle(root);
const secondary = style.getPropertyValue("--secondary");

console.log(secondary)

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
