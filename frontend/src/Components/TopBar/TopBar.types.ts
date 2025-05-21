import { PaletteMode } from "@mui/material";

export interface TopBarProps {
    colorMode: PaletteMode;
    toggleColorMode: () => void;
}