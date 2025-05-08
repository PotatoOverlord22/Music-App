import Brightness7Icon from "@mui/icons-material/Brightness7";
import NightlightIcon from '@mui/icons-material/Nightlight';
import { Box, IconButton } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { moonMotionDivStyle, moonVariants, sunMotionDivStyle, sunVariants, transition, useThemeSwitchStyles } from "./themeSwitch.styles";

export const ThemeSwitch: React.FC = () => {
    const { mode, setMode } = useColorScheme();
    const styles = useThemeSwitchStyles(mode);

    const handleToggle = () => {
        const next = mode === "light" ? "dark" : "light";
        setMode(next);
    };

    return (
        <Box className={styles.themeSwitchContainer}>
            <IconButton
                onClick={handleToggle}
                aria-label="toggle theme"
                className={styles.iconButton}
            >
                <AnimatePresence mode="wait" initial={false}>
                    {mode === "light" ? (
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
                <Box className={styles.hiddenButton}>
                    <Brightness7Icon />
                </Box>
            </IconButton>
        </Box>
    );
};