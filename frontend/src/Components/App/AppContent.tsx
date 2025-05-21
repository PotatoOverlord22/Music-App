import { useAuth0 } from "@auth0/auth0-react";
import { Box, CircularProgress, CssBaseline, PaletteMode, ThemeProvider } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Route, Routes } from "react-router";
import { InternalRoutes } from "../../library/Enums/InternalRoutes";
import { UserSyncHandler } from "../../library/userSyncHandler";
import HomePage from "../../pages/HomePage/HomePage";
import HowItWorksPage from "../../pages/HowItWorksPage/HowItWorksPage";
import TransformMusicPage from "../../pages/TransformMusicPage";
import { ProtectedRoute } from "../ProtectedRoute/ProtectedRoute";
import { styles } from "../ProtectedRoute/ProtectedRoute.styles";
import { TopBar } from "../TopBar/TopBar";
import { createCustomTheme } from "./Theme";

export const AppContent = () => {
    const { isLoading } = useAuth0();
    const [mode, setMode] = useState<PaletteMode>(() => {
        const savedMode = localStorage.getItem('themeMode');
        return (savedMode === 'light' || savedMode === 'dark') ? savedMode : 'dark';
    });

    useEffect(() => {
        localStorage.setItem('themeMode', mode);
    }, [mode]);

    const theme = useMemo(
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
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '5vh' }}>
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
            </ThemeProvider>
        </>
    )
};