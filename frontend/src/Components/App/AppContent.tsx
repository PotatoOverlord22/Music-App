import { useAuth0 } from "@auth0/auth0-react";
import { Box, CircularProgress, CssBaseline, PaletteMode, ThemeProvider } from "@mui/material";
import React from "react";
import { Route, Routes } from "react-router";
import { ServicesProvider } from "../../library/Contexts/ServicesContext/servicesContext";
import { InternalRoutes } from "../../library/Enums/InternalRoutes";
import { setupInterceptors } from "../../library/setupInterceptors";
import { UserSyncHandler } from "../../library/userSyncHandler";
import { HomePage } from "../../pages/HomePage/HomePage";
import { HowItWorksPage } from "../../pages/HowItWorksPage/HowItWorksPage";
import { TransformMusicPage } from "../../pages/TransformMusicPage/TransformMusicPage";
import { ProtectedRoute } from "../ProtectedRoute/ProtectedRoute";
import { styles } from "../ProtectedRoute/ProtectedRoute.styles";
import { TopBar } from "../TopBar/TopBar";
import { createCustomTheme } from "./Theme";
import { GlobalDataProvider } from "../../library/Contexts/GlobalContext/globalContext";

export const AppContent = () => {
    const { isLoading, getAccessTokenSilently } = useAuth0();
    const [mode, setMode] = React.useState<PaletteMode>(() => {
        const savedMode = localStorage.getItem('themeMode');
        return (savedMode === 'light' || savedMode === 'dark') ? savedMode : 'dark';
    });

    React.useEffect(() => {
        localStorage.setItem('themeMode', mode);
    }, [mode]);

    React.useEffect((): void => {
        setupInterceptors(getAccessTokenSilently);
    }, [getAccessTokenSilently]);

    const theme = React.useMemo(
        () => createCustomTheme(mode),
        [mode]);

    const toggleColorMode = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <UserSyncHandler />
            <ServicesProvider>
                <GlobalDataProvider>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                            <TopBar colorMode={mode} toggleColorMode={toggleColorMode} />
                            {isLoading ? (
                                <Box sx={styles.loadingContainer}>
                                    <CircularProgress />
                                </Box>
                            ) :
                                <Box component="main" sx={{ flexGrow: 1 }}>
                                    <Routes>
                                        <Route path={InternalRoutes.Home} element={<HomePage />} />
                                        <Route path={InternalRoutes.HowItworks} element={<HowItWorksPage />} />
                                        <Route path={InternalRoutes.TransformMusic}
                                            element={
                                                <ProtectedRoute>
                                                    <TransformMusicPage />
                                                </ProtectedRoute>
                                            }
                                        />
                                    </Routes>
                                </Box>
                            }
                        </Box>
                    </ThemeProvider >
                </GlobalDataProvider>
            </ServicesProvider>
        </>
    )
};