import { AppBar, Toolbar } from "@mui/material";
import { JSX } from "react";
import { useTopBarStyles } from "./topBar.styles";
import { NameAvatar } from "../NameAvatar/nameAvatar";
import { ThemeSwitch } from "../ThemeSwitch/themeSwitch";

export const TopBar = (): JSX.Element => {
    const styles = useTopBarStyles();

    return (
        <AppBar position="static">
            <Toolbar className={styles.topBar}>
                <ThemeSwitch />
                <NameAvatar name="John Doe" />
            </Toolbar>
        </AppBar>
    );
};