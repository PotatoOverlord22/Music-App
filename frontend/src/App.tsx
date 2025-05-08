import { InteractionType } from "@azure/msal-browser";
import { useMsalAuthentication } from "@azure/msal-react";
import { Box, createTheme, SxProps, ThemeProvider } from "@mui/material";
import { JSX } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "./Components/Home/home";
import { PageContent } from "./Components/PageContent/pageContent";
import { TopBar } from "./Components/TopBar/topBar";
import { ServicesProvider } from "./Library/Contexts/ServicesContext/servicesContext";
import { InternalRoutes } from "./Library/Enums/InternalRoutes";

const darkTheme = createTheme({
    colorSchemes: {
        dark: true
    },
});

const backgroudProps: SxProps = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
};

const App: React.FC = (): JSX.Element => {
    useMsalAuthentication(InteractionType.Redirect);
    return (
        <ThemeProvider theme={darkTheme} noSsr>
            <ServicesProvider>
                <BrowserRouter>
                    <Box sx={backgroudProps}>
                        <TopBar />
                        <PageContent>
                            <Routes>
                                <Route path={InternalRoutes.Home} element={<Home />} />
                            </Routes>
                        </PageContent>
                    </Box>
                </BrowserRouter>
            </ServicesProvider>
        </ThemeProvider>
    );
};

export default App;