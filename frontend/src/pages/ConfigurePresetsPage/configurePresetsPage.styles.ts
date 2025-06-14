import { Theme } from '@mui/material/styles';

export const styles = {
    pageContainer: {
        py: { xs: 4, md: 6 },
    },
    pageTitle: (theme: Theme) => ({
        mb: 4,
        color: theme.palette.primary.main,
    }),
    presetGrid: {
        mb: 4,
    },
    equalizerSection: {
        mb: 4,
    },
    equalizerCard: {
        p: 3,
    },
    bandContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: 200,
    },
    bandSlider: {
        height: 120,
        mb: 1,
    },
    bandLabel: {
        fontSize: '0.75rem',
        textAlign: 'center',
        minWidth: 40,
    },
    bandValue: (theme: Theme) => ({
        fontSize: '0.7rem',
        color: theme.palette.text.secondary,
        textAlign: 'center',
        minWidth: 30,
        mb: 2
    }),
    resetButton: {
        mr: 2,
    },
    saveButton: (theme: Theme) => ({
        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    }),
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 400,
    },
};