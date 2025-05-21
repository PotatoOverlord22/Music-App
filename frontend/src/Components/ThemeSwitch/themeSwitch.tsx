import Brightness7Icon from '@mui/icons-material/Brightness7';
import { AnimatePresence, motion } from 'framer-motion';
import { Moon } from 'lucide-react';
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
import { ThemeSwitchProps } from './themeSwitch.types';

export const ThemeSwitch: React.FC<ThemeSwitchProps> = (props: ThemeSwitchProps) => {

    return (
        <ThemeSwitchContainer>
            <StyledIconButton onClick={props.toggleColorMode} aria-label="toggle theme" themeMode={props.colorMode}>
                <AnimatePresence mode="wait" initial={false}>
                    {props.colorMode === 'light' ? (
                        <motion.div
                            key="moon"
                            variants={moonVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={transition}
                            style={moonMotionDivStyle}
                        >
                            <Moon />
                        </motion.div>
                    ) :
                        (
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
                        )
                    }
                </AnimatePresence>
                <HiddenButton>
                    <Brightness7Icon />
                </HiddenButton>
            </StyledIconButton>
        </ThemeSwitchContainer>
    );
};
