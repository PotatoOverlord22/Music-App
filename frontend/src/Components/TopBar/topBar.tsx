import { useAuth0 } from '@auth0/auth0-react';
import { AppBar, Avatar, Button } from '@mui/material';
import { JSX } from 'react';
import { ThemeSwitch } from '../ThemeSwitch/themeSwitch';
import { StyledToolbar } from './topBar.styles';

export const TopBar = (): JSX.Element => {
    const { logout, user } = useAuth0();

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
                <Avatar src={user?.picture ?? ""} alt={user?.name ?? ""} />
            </StyledToolbar>
        </AppBar>
    );
};