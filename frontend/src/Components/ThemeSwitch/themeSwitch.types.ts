import { PaletteMode } from "@mui/material";

export type ThemeSwitchProps = {
    colorMode: PaletteMode;
    toggleColorMode: () => void;
}