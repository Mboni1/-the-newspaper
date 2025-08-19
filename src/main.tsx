import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Get the root element and assert it's not null
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

// Create the React root and render
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
