import { useAuth0 } from '@auth0/auth0-react';
import LogoutIcon from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { Music, MusicIcon } from 'lucide-react';
import { useState } from 'react';

import { CircularProgress } from '@mui/material';
import React from 'react';
import { useGlobalData } from '../../library/Contexts/GlobalContext/globalContext';
import { useServices } from '../../library/Contexts/ServicesContext/servicesContext';
import { useFetchQuery } from '../../library/Hooks/hooks';
import { LOGOUT_BUTTON_TEXT, STATISTICS_SECTION_TITLE, USER_ALT_TEXT, WITH_CONTEXT_TEXT, WITHOUT_CONTEXT_TEXT } from '../../library/resources';
import { UserStats } from '../../models/UserStats';
import { styles } from './UserMenu.styles';

function UserMenu() {
    const services = useServices();
    const { setUserStats } = useGlobalData();
    const { user, logout } = useAuth0();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { data: userStats, isLoading: userStatsLoading, isSuccess } = useFetchQuery<UserStats>(services.UserService.GetUserStats());

    React.useEffect(() => {
        if (!isSuccess || !userStats) {
            return;
        }

        setUserStats(userStats);
    }, [isSuccess, userStats, setUserStats]);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        logout({ logoutParams: { returnTo: window.location.origin } });
    };

    return (
        <>
            <IconButton
                onClick={handleMenu}
                color="inherit"
                sx={styles.iconButton}
                aria-controls="user-menu"
                aria-haspopup="true"
            >
                <Avatar
                    alt={user?.name ?? USER_ALT_TEXT}
                    src={user?.picture ?? ''}
                    sx={styles.avatar}
                />
            </IconButton>
            <Menu
                id="user-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    sx: styles.menuPaper,
                }}
            >
                <MenuItem sx={styles.menuItemUserInfo}>
                    <Typography variant="subtitle1" sx={styles.userName}>
                        {user?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {user?.email}
                    </Typography>
                </MenuItem>
                <Divider />
                <MenuItem sx={styles.menuItemStatistics}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {STATISTICS_SECTION_TITLE}
                    </Typography>
                    {
                        userStatsLoading ? (
                            <CircularProgress size={24} />
                        ) : (
                            <Box sx={styles.statisticsBox}>
                                <Box sx={styles.statisticItem}>
                                    <Music size={16} style={styles.statisticIcon} />
                                    <Typography variant="body2">
                                        {WITH_CONTEXT_TEXT}: {userStats?.transformedWithContext ?? 0}
                                    </Typography>
                                </Box>
                                <Box sx={styles.statisticItem}>
                                    <MusicIcon size={16} style={styles.statisticIcon} />
                                    <Typography variant="body2">
                                        {WITHOUT_CONTEXT_TEXT}: {userStats?.transformedWithoutContext ?? 0}
                                    </Typography>
                                </Box>
                            </Box>
                        )
                    }
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                    <>
                        <LogoutIcon sx={{ mr: 2 }} />
                        {LOGOUT_BUTTON_TEXT}
                    </>
                </MenuItem>
            </Menu>
        </>
    );
}

export default UserMenu;