import { useAuth0 } from '@auth0/auth0-react';
import LogoutIcon from '@mui/icons-material/Logout';
import { AppBar, Avatar, Box, Popover, Typography } from '@mui/material';
import React, { JSX, useEffect } from 'react';
import { useServices } from '../../Library/Contexts/ServicesContext/servicesContext';
import { useFetchQuery } from '../../Library/Hooks/hooks';
import { UserStats } from '../../Models/UserStats';
import { ThemeSwitch } from '../ThemeSwitch/themeSwitch';
import { StyledToolbar } from './topBar.styles';
import { LoadingIndicator } from '../PageContent/pageContent.styles';

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

    const handlePopoverOpen = async (e: React.MouseEvent<HTMLElement>) => {
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

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = (): void => {
        logout({
            logoutParams: {
                returnTo: window.location.origin
            }
        });
    };

    const open = Boolean(anchorEl);

    return (
        <AppBar position="static">
            <StyledToolbar>
                <ThemeSwitch />

                <Box
                    onClick={handleLogout}
                    sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                    <LogoutIcon />
                </Box>

                <Box
                    onMouseEnter={handlePopoverOpen}
                    onMouseLeave={handlePopoverClose}
                >
                    <Avatar src={user?.picture ?? ""} alt={user?.name ?? ""} />
                </Box>

                <Popover
                    id="mouse-over-popover"
                    sx={{
                        pointerEvents: 'none',
                    }}
                    open={open}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    onClose={handlePopoverClose}
                    disableRestoreFocus
                >
                    {isLoading ? <LoadingIndicator /> :
                        <Box>
                            <Typography variant="h6" sx={{ padding: 2 }} gutterBottom>
                                {`Transformed songs: ${userStats?.transformedSongs}`}
                            </Typography>
                            <Typography variant="h6" sx={{ padding: 2 }} gutterBottom>
                                {`Transformed songs with context: ${userStats?.transformedSongsWithContext}`}
                            </Typography>
                        </Box>
                    }
                </Popover>
            </StyledToolbar>
        </AppBar >
    );
};