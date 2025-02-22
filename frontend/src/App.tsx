import { InteractionType } from "@azure/msal-browser";
import { useMsalAuthentication } from "@azure/msal-react";
import { JSX } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "./Components/Home/home";
import { InternalRoutes } from "./Library/Enums/InternalRoutes";
import { ServicesProvider } from "./Services/ServicesContext/servicesContext";

const App: React.FC = (): JSX.Element => {
    useMsalAuthentication(InteractionType.Redirect);
    return (
        <ServicesProvider>
            <BrowserRouter>
                <Routes>
                    <Route path={InternalRoutes.Home} element={<Home />} />
                </Routes>
            </BrowserRouter>
        </ServicesProvider>
    );
};

export default App;