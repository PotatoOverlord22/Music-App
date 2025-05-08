import { Box } from "@mui/material";
import { JSX } from "react";
import { usePageContentStyles } from "./pageContent.styles";

export const PageContent = (props: React.PropsWithChildren): JSX.Element => {
    const styles = usePageContentStyles();

    return (
        <Box className={styles.pageContentWrapper}>
            {props.children}
        </Box>
    );
};