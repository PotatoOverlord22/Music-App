import { SxProps, Theme } from '@mui/material';

export const styles = {
    container: {
        flexGrow: 1,
    } satisfies SxProps,

    logoLink: (): SxProps => ({
        flexGrow: 1,
        textDecoration: 'none',
        color: 'inherit',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
    }),

    logoText: (theme: Theme): React.CSSProperties => ({
        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 600,
    }),

    navItemsContainer: {
        display: 'flex',
        gap: 2,
    } satisfies SxProps,

    drawerPaper: {
        boxSizing: 'border-box',
        width: 240,
    } satisfies SxProps,

    drawerContainer: {
        textAlign: 'center',
    } satisfies SxProps,

    drawerTitle: {
        my: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
    } satisfies SxProps,

    drawerListItemButton: {
        textAlign: 'center',
    } satisfies SxProps,
};