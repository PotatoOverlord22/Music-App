import { AppBar } from '@mui/material';
import { JSX } from 'react';
import { NameAvatar } from '../NameAvatar/nameAvatar';
import { ThemeSwitch } from '../ThemeSwitch/themeSwitch';
import { StyledToolbar } from './topBar.styles';

export const TopBar = (): JSX.Element => {
    return (
        <AppBar position="static">
            <StyledToolbar>
                <ThemeSwitch />
                <NameAvatar name="Tiron Raul" />
            </StyledToolbar>
        </AppBar>
    );
};