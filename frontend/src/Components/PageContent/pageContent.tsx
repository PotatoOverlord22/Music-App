import { Box, CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import React, { JSX } from "react";
import { BACKEND_URL, GENERAL_DATA_CONTROLLER } from "../../Library/constants";
import { GlobalContextProvider } from "../../Library/Contexts/GlobalContext/globalContext";
import { GlobalData } from "../../Library/Contexts/GlobalContext/globalContext.types";
import { usePageContentStyles } from "./pageContent.styles";
import { ErrorBoundary } from "react-error-boundary";

export const PageContent = (props: React.PropsWithChildren): JSX.Element => {
    const styles = usePageContentStyles();
    const [moods, setMoods] = React.useState<string[]>([]);
    const [timesOfDay, setTimesOfDay] = React.useState<string[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [isError, setIsError] = React.useState<boolean>(false);

    const fetchGlobalData = async () => {
        try {
            const [moodsRes, timesRes] = await Promise.all([
                axios.get<string[]>(`${BACKEND_URL}/api/${GENERAL_DATA_CONTROLLER}/Moods`),
                axios.get<string[]>(`${BACKEND_URL}/api/${GENERAL_DATA_CONTROLLER}/TimesOfDay`),
            ]);

            setMoods(moodsRes.data ?? []);
            setTimesOfDay(timesRes.data ?? []);
        } catch (error) {
            console.error("Error fetching global data:", error);
            // setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchGlobalData();
    }, []);

    const globalData: GlobalData = React.useMemo((): GlobalData => {
        return {
            moods: moods,
            timesOfDay: timesOfDay,
        };
    }, [moods, timesOfDay]);

    if (isError) {
        return (
            <Box className={styles.pageContentBackground}>
                <Typography color="textPrimary">Failed to load data. Please try again later.</Typography>
            </Box>
        );
    }

    return (
        <Box className={styles.pageContentBackground}>
            {isLoading ?
                <Box className={styles.loadingIndicator}>
                    <CircularProgress />
                </Box>
                :
                <ErrorBoundary fallback={<div>Something went wrong</div>}>
                    <GlobalContextProvider globalData={globalData}>
                        <Box className={styles.pageContentContainer}>
                            {props.children}
                        </Box>
                    </GlobalContextProvider>
                </ErrorBoundary>
            }
        </Box>
    );
};