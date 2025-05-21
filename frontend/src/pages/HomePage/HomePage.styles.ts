import { Theme } from '@mui/material/styles';

export const styles = {
    container: {
        py: { xs: 6, md: 8 },
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        mb: 3,
    },
    logoIcon: () => ({
        filter: 'drop-shadow(0 0 8px rgba(156, 39, 176, 0.3))',
        animation: 'pulse 2s infinite',
    }),
    title: (theme: Theme) => ({
        ml: 2,
        fontWeight: 700,
        color: theme.palette.primary.main,
        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }),
    subtitle: {
        mb: 4,
    },
    buttonContainer: {
        display: 'flex',
        gap: 2,
        flexWrap: 'wrap',
    },
    primaryButton: (theme: Theme) => ({
        px: 4,
        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        transition: 'transform 0.2s',
        '&:hover': {
            transform: 'translateY(-2px)',
        },
    }),
    secondaryButton: {
        borderWidth: 2,
        '&:hover': {
            borderWidth: 2,
        },
    },
    visualizationContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    animatedPaper: (theme: Theme) => ({
        width: '100%',
        height: 400,
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
            transform: 'scale(1.02) rotate(1deg)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        },
    }),
    iconContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
    },
    floatingIcons: {
        display: 'flex',
        gap: 4,
        animation: 'float 6s ease-in-out infinite',
    },
    icon: {
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
    },
    equalizerContainer: {
        display: 'flex',
        gap: 1,
        mt: 4,
    },
    equalizerBar: () => ({
        width: 8,
        height: 40,
        bgcolor: 'rgba(255,255,255,0.8)',
        borderRadius: 4,
        animation: `equalizer ${1 + Math.random()}s ease-in-out infinite`,
    }),
    featuresSection: {
        mt: 10,
    },
    featureCard: (theme: Theme) => ({
        p: 3,
        height: '100%',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: theme.shadows[8],
        },
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: 4,
            height: '100%',
            background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        },
    }),
    globalStyles: {
        '@keyframes pulse': {
            '0%': {
                opacity: 0.6,
                transform: 'scale(0.9)',
            },
            '50%': {
                opacity: 1,
                transform: 'scale(1.1)',
            },
            '100%': {
                opacity: 0.6,
                transform: 'scale(0.9)',
            }
        },
        '@keyframes float': {
            '0%': {
                transform: 'translateY(0px)',
            },
            '50%': {
                transform: 'translateY(-15px)',
            },
            '100%': {
                transform: 'translateY(0px)',
            }
        },
        '@keyframes equalizer': {
            '0%': {
                height: '20%',
            },
            '50%': {
                height: '70%',
            },
            '100%': {
                height: '20%',
            }
        }
    }
};