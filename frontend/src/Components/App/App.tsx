import { useAuth0 } from "@auth0/auth0-react";
import { Box, ThemeProvider } from "@mui/material";
import React, { JSX } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { ServicesProvider } from "../../Library/Contexts/ServicesContext/servicesContext";
import { InternalRoutes } from "../../Library/Enums/InternalRoutes";
import { setupInterceptors } from "../../Library/setupInterceptors";
import { AuthenticationGuard } from "../AuthenticationGuard/authenticationGuard";
import { Home } from "../Home/home";
import { TopBar } from "../TopBar/topBar";
import { backgroudProps, darkTheme } from "./App.styles";


const App: React.FC = (): JSX.Element => {
    const { getAccessTokenSilently } = useAuth0();

    React.useEffect((): void => {
        setupInterceptors(getAccessTokenSilently);
    }, [getAccessTokenSilently]);

    return (
        <ThemeProvider theme={darkTheme} noSsr>
            <ServicesProvider>
                <BrowserRouter>
                    <Box sx={backgroudProps}>
                        <TopBar />
                        <Routes>
                            <Route path={InternalRoutes.Home} element={<AuthenticationGuard component={Home} />} />
                        </Routes>
                    </Box>
                </BrowserRouter>
            </ServicesProvider>
        </ThemeProvider>
    );
};

export default App;