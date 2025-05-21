import { createTheme, SxProps } from "@mui/material";

export const darkTheme = createTheme({
    colorSchemes: {
        dark: true
    },
});

export const backgroudProps: SxProps = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
};