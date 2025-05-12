import React from "react";
import { createRoot, Root } from "react-dom/client";
import App from "./App";

const rootElement: HTMLElement | null = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

const root: Root = createRoot(rootElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);