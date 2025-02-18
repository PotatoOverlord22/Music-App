import { InteractionType } from "@azure/msal-browser";
import { useMsalAuthentication } from "@azure/msal-react";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { BrowserRouter, Route, Routes } from "react-router";
import { InternalRoutes } from "../../Library/Enums/InternalRoutes";
import { Home } from "../Home/home";
import { ServicesProvider } from "../Services/ServicesContext/servicesContext";

const App: React.FC = (): JSX.Element => {
    useMsalAuthentication(InteractionType.Redirect);
    return (
        <FluentProvider theme={webLightTheme}>
            <ServicesProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path={InternalRoutes.Home} element={<Home />} />
                    </Routes>
                </BrowserRouter>
            </ServicesProvider>
        </FluentProvider>
    );
};

export default App;