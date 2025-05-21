import { PaletteMode, Theme, createTheme } from '@mui/material/styles';

export const createCustomTheme = (mode: PaletteMode | undefined): Theme => {
    return createTheme({
        palette: {
            mode,
            primary: {
                main: '#AB47BC', // lighter purple
            },
            secondary: {
                main: '#00796B', // teal
            },
            error: {
                main: '#D32F2F',
            },
            warning: {
                main: '#FF9800',
            },
            success: {
                main: '#2E7D32',
            },
            background: {
                default: mode === 'light' ? '#F5F5F7' : '#121212',
                paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
            },
        },
        typography: {
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            h1: {
                fontWeight: 700,
                fontSize: '2.5rem',
            },
            h2: {
                fontWeight: 700,
                fontSize: '2rem',
            },
            h3: {
                fontWeight: 600,
                fontSize: '1.5rem',
            },
            h4: {
                fontWeight: 600,
                fontSize: '1.25rem',
            },
            h5: {
                fontWeight: 500,
                fontSize: '1.1rem',
            },
            h6: {
                fontWeight: 500,
                fontSize: '1rem',
            },
            body1: {
                lineHeight: 1.5,
            },
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        borderRadius: 8,
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                        boxShadow: mode === 'light'
                            ? '0 4px 12px rgba(0, 0, 0, 0.05)'
                            : '0 4px 12px rgba(0, 0, 0, 0.2)',
                    },
                },
            },
        },
    })
}