import { InteractionType } from "@azure/msal-browser";
import { useMsalAuthentication } from "@azure/msal-react";
import { createTheme, ThemeProvider } from "@mui/material";
import { JSX } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "./Components/Home/home";
import { InternalRoutes } from "./Library/Enums/InternalRoutes";
import { ServicesProvider } from "./Services/ServicesContext/servicesContext";
import { TopBar } from "./Components/TopBar/topBar";

const darkTheme = createTheme({
    colorSchemes: {
        dark: true
    },
});

const App: React.FC = (): JSX.Element => {
    useMsalAuthentication(InteractionType.Redirect);
    return (
        <ThemeProvider theme={darkTheme} noSsr>
            <ServicesProvider>
                <BrowserRouter>
                    <TopBar />
                    <Routes>
                        <Route path={InternalRoutes.Home} element={<Home />} />
                    </Routes>
                </BrowserRouter>
            </ServicesProvider>
        </ThemeProvider>
    );
};

export default App;