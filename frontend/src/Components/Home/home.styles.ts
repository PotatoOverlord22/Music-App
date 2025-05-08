import { Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";

export const useHomeStyles = makeStyles((theme: Theme) => ({
    homeContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: theme.spacing(2),
        gap: theme.spacing(3),
    },
    moodSelectStyles: {
        width: '420px',
    }
}));