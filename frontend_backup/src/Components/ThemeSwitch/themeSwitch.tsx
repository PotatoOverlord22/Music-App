import Brightness7Icon from '@mui/icons-material/Brightness7';
import NightlightIcon from '@mui/icons-material/Nightlight';
import { useColorScheme } from '@mui/material/styles';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import {
    HiddenButton,
    moonMotionDivStyle,
    moonVariants,
    StyledIconButton,
    sunMotionDivStyle,
    sunVariants,
    ThemeSwitchContainer,
    transition,
} from './themeSwitch.styles';

export const ThemeSwitch: React.FC = () => {
    const { mode, setMode } = useColorScheme();

    const handleToggle = () => {
        setMode(mode === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeSwitchContainer>
            <StyledIconButton onClick={handleToggle} aria-label="toggle theme" themeMode={mode}>
                <AnimatePresence mode="wait" initial={false}>
                    {mode === 'light' ? (
                        <motion.div
                            key="sun"
                            variants={sunVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={transition}
                            style={sunMotionDivStyle}
                        >
                            <Brightness7Icon />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="moon"
                            variants={moonVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={transition}
                            style={moonMotionDivStyle}
                        >
                            <NightlightIcon />
                        </motion.div>
                    )}
                </AnimatePresence>
                <HiddenButton>
                    <Brightness7Icon />
                </HiddenButton>
            </StyledIconButton>
        </ThemeSwitchContainer>
    );
};
