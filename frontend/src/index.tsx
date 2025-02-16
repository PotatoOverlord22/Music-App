import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { createRoot, Root } from "react-dom/client";
import { msalConfig } from "./Auth/authConfig";
import App from "./Components/App/App";

const msalInstance = new PublicClientApplication(msalConfig);

async function initializeMsal() {
    await msalInstance.initialize();
    return msalInstance.handleRedirectPromise().then((tokenResponse) => {
        if (tokenResponse) {
            msalInstance.setActiveAccount(tokenResponse.account);
        } else {
            const accounts = msalInstance.getAllAccounts();
            if (accounts.length > 0) {
                msalInstance.setActiveAccount(accounts[0]);
            }
        }
    }).catch((error) => {
        console.error("Error msal:", error);
    });
}

// Ensure MSAL is ready before rendering
initializeMsal().then(() => {
    const rootElement: HTMLElement | null = document.getElementById("root");
    if (!rootElement) throw new Error("Root element not found");

    const root: Root = createRoot(rootElement);
    root.render(
        <MsalProvider instance={msalInstance}>
            <App />
        </MsalProvider>
    );
});