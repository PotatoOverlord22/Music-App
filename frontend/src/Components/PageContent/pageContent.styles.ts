import { Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";

export const usePageContentStyles = makeStyles((theme: Theme) => ({
    pageContentWrapper: {
        flex: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    }
}));