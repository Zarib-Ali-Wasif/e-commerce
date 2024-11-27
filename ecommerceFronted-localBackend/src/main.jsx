import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "../lib/redux/store.js";

const Providers = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

createRoot(document.getElementById("root")).render(
  <Providers>
    <App />
  </Providers>
);
