import { Box, CircularProgress } from "@mui/material";
import axios from "axios";
import React, { JSX } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { BACKEND_URL, GENERAL_DATA_CONTROLLER } from "../../Library/constants";
import { GlobalContextProvider } from "../../Library/Contexts/GlobalContext/globalContext";
import { GlobalData } from "../../Library/Contexts/GlobalContext/globalContext.types";
import { usePageContentStyles } from "./pageContent.styles";

export const PageContent = (props: React.PropsWithChildren): JSX.Element => {
    const styles = usePageContentStyles();
    const [moods, setMoods] = React.useState<string[]>([]);
    const [timesOfDay, setTimesOfDay] = React.useState<string[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

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
            throw error;
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

    return (
        <Box className={styles.pageContentBackground}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                {isLoading ? (
                    <Box className={styles.loadingIndicator}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <GlobalContextProvider globalData={globalData}>
                        {props.children}
                    </GlobalContextProvider>
                )}
            </ErrorBoundary>
        </Box>
    );
};