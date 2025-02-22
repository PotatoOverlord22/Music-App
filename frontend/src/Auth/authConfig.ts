import { AccountInfo, Configuration, IPublicClientApplication, LogLevel } from "@azure/msal-browser";

const clientId: string = import.meta.env.VITE_AUTH_CLIENTID;
const msalAuthorityURL: string = 'https://login.microsoftonline.com/common';
const currentUrl: string = window.location.origin;

export const msalConfig: Configuration = {
    auth: {
        clientId: clientId,
        authority: msalAuthorityURL,
        redirectUri: currentUrl,
        postLogoutRedirectUri: window.location.href,
        navigateToLoginRequestUrl: true // Add this to ensure proper navigation
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: false,
    },
    system: {
        loggerOptions: {
            // loggerCallback: (level, message, containsPii) => {
            //     console.log(message);
            // },
            piiLoggingEnabled: false,
            logLevel: LogLevel.Verbose
        }
    }
};

export const msalTokenScopes: string[] = [`api://${clientId}/access_as_user`];

export const onSignOut = (msalInstance: IPublicClientApplication, accountinfo: AccountInfo): void => {
    const logoutRequest = {
        account: accountinfo,
        postLogoutRedirectUri: msalConfig.auth.postLogoutRedirectUri,
    };
    msalInstance.logoutRedirect(logoutRequest);
};