import { InteractionType } from "@azure/msal-browser";
import { useMsalAuthentication } from "@azure/msal-react";
import { BrowserRouter, Route, Routes } from "react-router";
import { msalTokenScopes } from "../../Auth/authConfig";
import { InternalRoutes } from "../../Library/Enums/InternalRoutes";
import { Home } from "../Home/home";

const App = (): JSX.Element => {
    useMsalAuthentication(InteractionType.Redirect, { scopes: msalTokenScopes });
    return (
        <BrowserRouter>
            <Routes>
                <Route path={InternalRoutes.Home} element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;