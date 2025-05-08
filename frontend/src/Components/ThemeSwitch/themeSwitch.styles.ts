import { makeStyles } from "@mui/styles";
import { Variants } from "framer-motion";
import { CSSProperties } from "react";

export const sunColor: string = "#f9a825";
export const moonColor: string = "#5e81ac";

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

export const useThemeSwitchStyles = makeStyles((mode) => ({
    themeSwitchContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    iconButton: {
        position: "relative",
        padding: 1.25,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        borderRadius: "50%",
        transition: "background-color 0.3s ease",
        "&:hover": {
            backgroundColor: mode === "light"
                ? "rgba(255, 215, 0, 0.1)"
                : "rgba(100, 100, 200, 0.1)",
        }
    },
    hiddenButton: {
        visibility: "hidden", 
        display: "flex"
    }
}));

export const sunMotionDivStyle: CSSProperties = {
    display: "flex",
    position: "absolute",
    color: sunColor
};

export const moonMotionDivStyle: CSSProperties = {
    display: "flex",
    position: "absolute",
    color: moonColor
};