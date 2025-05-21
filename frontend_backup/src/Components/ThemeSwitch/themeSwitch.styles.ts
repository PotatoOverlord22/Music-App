import { Box, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Variants } from 'framer-motion';
import { CSSProperties } from 'react';

export const sunColor: string = "#f9a825";
export const moonColor: string = "#5e81ac";

export type ThemeMode = "light" | "dark" | "system" | undefined;

export const sunVariants: Variants = {
    initial: { opacity: 0, rotate: -90, scale: 0.5 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    exit: { opacity: 0, rotate: 90, scale: 0.5 }
};

export const moonVariants: Variants = {
    initial: { opacity: 0, rotate: 90, scale: 0.5 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    exit: { opacity: 0, rotate: -90, scale: 0.5 }
};

export const transition = {
    duration: 0.2,
    ease: [0.4, 0.0, 0.2, 1]
};

export const ThemeSwitchContainer = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}));

export const StyledIconButton = styled(IconButton, { shouldForwardProp: (prop) => prop !== 'themeMode' })<{ themeMode: ThemeMode }>(({ themeMode }) => ({
    position: 'relative',
    padding: 1.25,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: '50%',
    transition: 'background-color 0.3s ease',
    '&:hover': {
        backgroundColor:
            themeMode === 'light'
                ? 'rgba(255, 215, 0, 0.1)'
                : 'rgba(100, 100, 200, 0.1)',
    }
}));

export const HiddenButton = styled(Box)(() => ({
    visibility: 'hidden',
    display: 'flex'
}));

export const sunMotionDivStyle: CSSProperties = {
    display: 'flex',
    position: 'absolute',
    color: sunColor
};

export const moonMotionDivStyle: CSSProperties = {
    display: 'flex',
    position: 'absolute',
    color: moonColor
};