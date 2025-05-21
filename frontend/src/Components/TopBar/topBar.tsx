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
import { Menu as MenuIcon, Moon, Music, Sun } from 'lucide-react';
import { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router';
import { InternalRoutes } from '../../library/Enums/InternalRoutes';
import UserMenu from '../UserMenu';
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

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'How It Works', path: '/how-it-works' },
        { name: 'Transform Music', path: '/transform-music' },
    ];

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={styles.drawerContainer}>
            <Typography variant="h6" sx={styles.drawerTitle}>
                <Music size={24} className="logo-icon" />
                MusicMania
            </Typography>
            <Divider />
            <List>
                {navItems.map((item) => (
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
            <AppBar position="static" color="default" elevation={1}>
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
                            {navItems.map((item) => (
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

                    <IconButton onClick={props.toggleColorMode} color="inherit" sx={{ ml: 1 }}>
                        {props.colorMode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </IconButton>

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