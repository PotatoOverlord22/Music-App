import { CircularProgress, Typography } from '@mui/material';
import axios from 'axios';
import React, { JSX } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { BACKEND_URL, GENERAL_DATA_CONTROLLER } from '../../Library/constants';
import { GlobalContextProvider } from '../../Library/Contexts/GlobalContext/globalContext';
import { GlobalData } from '../../Library/Contexts/GlobalContext/globalContext.types';
import { LoadingIndicator, PageContentBackground, PageContentContainer } from './pageContent.styles';

export const PageContent = (props: React.PropsWithChildren): JSX.Element => {
    const [moods, setMoods] = React.useState<string[]>([]);
    const [timesOfDay, setTimesOfDay] = React.useState<string[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [isError, setIsError] = React.useState<boolean>(false);

    const fetchGlobalData = async () => {
        try {
            const [moodsRes, timesRes] = await Promise.all([
                axios.get<string[]>(
                    `${BACKEND_URL}/api/${GENERAL_DATA_CONTROLLER}/Moods`
                ),
                axios.get<string[]>(
                    `${BACKEND_URL}/api/${GENERAL_DATA_CONTROLLER}/TimesOfDay`
                )
            ]);

            setMoods(moodsRes.data ?? []);
            setTimesOfDay(timesRes.data ?? []);
        } catch {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchGlobalData();
    }, []);

    const globalData: GlobalData = React.useMemo(
        () => ({
            moods,
            timesOfDay
        }),
        [moods, timesOfDay]
    );

    if (isError) {
        return (
            <PageContentBackground>
                <Typography color="textPrimary">
                    Failed to load data. Please try again later.
                </Typography>
            </PageContentBackground>
        );
    }

    return (
        <PageContentBackground>
            {isLoading ? (
                <LoadingIndicator>
                    <CircularProgress />
                </LoadingIndicator>
            ) : (
                <ErrorBoundary fallback={<div>Something went wrong</div>}>
                    <GlobalContextProvider globalData={globalData}>
                        <PageContentContainer>{props.children}</PageContentContainer>
                    </GlobalContextProvider> 
                </ErrorBoundary>
            )}
        </PageContentBackground>
    );
};