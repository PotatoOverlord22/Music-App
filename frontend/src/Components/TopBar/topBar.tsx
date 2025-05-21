import { useAuth0 } from '@auth0/auth0-react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Menu as MenuIcon, Music } from 'lucide-react';
import { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router';
import { InternalRoutes, InternalRoutesDict } from '../../library/Enums/InternalRoutes';
import { ThemeSwitch } from '../ThemeSwitch/themeSwitch';
import UserMenu from '../UserMenu/UserMenu';
import { styles } from './TopBar.styles';
import { TopBarProps } from './TopBar.types';

export const TopBar = (props: TopBarProps): JSX.Element => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const { isAuthenticated, loginWithRedirect } = useAuth0();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawerNavItems = Object.values(InternalRoutes).map(path => ({
        name: InternalRoutesDict[path],
        path: path
    }));

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={styles.drawerContainer}>
            <Typography variant="h6" sx={styles.drawerTitle}>
                <Music size={24} className="logo-icon" />
                MusicMania
            </Typography>
            <Divider />
            <List>
                {drawerNavItems.map((item) => (
                    <ListItem key={item.name} disablePadding>
                        <ListItemButton
                            sx={styles.drawerListItemButton}
                            component={RouterLink}
                            to={item.path}
                            selected={location.pathname === item.path}
                        >
                            <ListItemText primary={item.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={styles.container}>
            <AppBar position="fixed" color="default" elevation={1}>
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}

                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to={InternalRoutes.Home}
                        sx={styles.logoLink()}
                    >
                        <Music size={28} className="logo-icon" />
                        <span style={styles.logoText(theme)}>
                            MusicMania
                        </span>
                    </Typography>

                    {!isMobile && (
                        <Box sx={styles.navItemsContainer}>
                            {drawerNavItems.map((item) => (
                                <Button
                                    key={item.name}
                                    component={RouterLink}
                                    to={item.path}
                                    color={location.pathname === item.path ? 'primary' : 'inherit'}
                                    sx={{ my: 2 }}
                                >
                                    {item.name}
                                </Button>
                            ))}
                        </Box>
                    )}

                    <ThemeSwitch colorMode={props.colorMode} toggleColorMode={props.toggleColorMode} />

                    {isAuthenticated ? (
                        <UserMenu />
                    ) : (
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={() => loginWithRedirect()}
                            sx={{ ml: 1 }}
                        >
                            Login
                        </Button>
                    )}
                </Toolbar>
            </AppBar>

            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': styles.drawerPaper,
                }}
            >
                {drawer}
            </Drawer>
        </Box>
    );
};