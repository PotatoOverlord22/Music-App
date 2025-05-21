import { Theme } from '@mui/material/styles';

export const styles = {
    pageContainer: {
        py: { xs: 4, md: 6 },
    },
    pageTitle: (theme: Theme) => ({
        mb: 4,
        color: theme.palette.primary.main,
    }),
    card: {
        mb: 4,
        height: '100%',
    },
    audioPlayerBox: {
        mt: 3,
    },
    audioPlayerBoxProcessed: {
        mt: 4,
    },
    downloadButton: {
        mt: 2,
    },
    subtitle: {
        mb: 3,
    },
    divider: {
        my: 3,
    },
    processButton: {
        mt: 2,
        py: 1.5,
    },
};