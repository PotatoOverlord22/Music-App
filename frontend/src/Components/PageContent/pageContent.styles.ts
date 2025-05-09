import { Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";

export const usePageContentStyles = makeStyles((theme: Theme) => ({
    pageContentBackground: {
        flex: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    loadingIndicator: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    },
    pageContentContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    }
}));