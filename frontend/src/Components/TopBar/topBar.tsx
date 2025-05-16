import { useAuth0 } from '@auth0/auth0-react';
import { AppBar, Avatar, Box, Button, CircularProgress, Popover, Typography } from '@mui/material';
import React, { JSX, useEffect } from 'react';
import { useServices } from '../../Library/Contexts/ServicesContext/servicesContext';
import { useFetchQuery } from '../../Library/Hooks/hooks';
import { UserStats } from '../../Models/UserStats';
import { ThemeSwitch } from '../ThemeSwitch/themeSwitch';
import { StyledToolbar } from './topBar.styles';

export const TopBar = (): JSX.Element => {
    const { logout, user, getAccessTokenSilently, isAuthenticated } = useAuth0();
    const services = useServices();

    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const { data: userStats, isLoading, refetch } = useFetchQuery<UserStats>(
        {
            ...services.UserService.GetUserStats(),
            enabled: false
        }
    );

    useEffect(() => {
        const fetchStatsWithToken = async () => {
            if (isAuthenticated) {
                try {
                    await getAccessTokenSilently();
                    refetch();
                } catch (error) {
                    console.error("Error fetching auth token:", error);
                }
            }
        };

        fetchStatsWithToken();
    }, [isAuthenticated, getAccessTokenSilently, refetch]);

    const open = Boolean(anchorEl);

    const handleAvatarEnter = async (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);
        if (isAuthenticated) {
            try {
                await getAccessTokenSilently();
                refetch();
            } catch (error) {
                console.error("Error fetching auth token:", error);
            }
        }
    };

    const handleAvatarLeave = () => {
        setAnchorEl(null);
    };

    const handleLogout = (): void => {
        logout({
            logoutParams: {
                returnTo: window.location.origin
            }
        });
    };

    return (
        <AppBar position="static">
            <StyledToolbar>
                <ThemeSwitch />

                <Button onClick={handleLogout}>
                    Log Out
                </Button>

                <Box
                    onMouseEnter={handleAvatarEnter}
                    onMouseLeave={handleAvatarLeave}
                    sx={{ display: 'inline-block' }}
                >
                    <Avatar src={user?.picture ?? ""} alt={user?.name ?? ""} />

                    <Popover
                        open={open}
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center'
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center'
                        }}
                        PaperProps={{
                            onMouseEnter: handleAvatarEnter,
                            onMouseLeave: handleAvatarLeave,
                            sx: { p: 2, pointerEvents: 'auto' }
                        }}
                    >
                        {isLoading ? (
                            <CircularProgress size={24} />
                        ) : userStats ? (
                            <Box>
                                <Typography variant="subtitle2">
                                    Transformed Songs:
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    {userStats.transformedSongs}
                                </Typography>
                                <Typography variant="subtitle2">
                                    Transformed Songs With Context:
                                </Typography>
                                <Typography variant="body2">
                                    {userStats.transformedSongsWithContext}
                                </Typography>
                            </Box>
                        ) : (
                            <Typography variant="body2">
                                No stats available.
                            </Typography>
                        )}
                    </Popover>
                </Box>
            </StyledToolbar>
        </AppBar>
    );
};