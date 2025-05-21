import { Auth0Provider } from '@auth0/auth0-react';
import React from "react";
import { createRoot, Root } from "react-dom/client";
import App from "./Components/App/App";

const rootElement: HTMLElement | null = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

const root: Root = createRoot(rootElement);
root.render(
    <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
        authorizationParams={{
            redirect_uri: window.location.origin,
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        }}
    >
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </Auth0Provider>
);