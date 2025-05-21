import { withAuthenticationRequired } from '@auth0/auth0-react';
import { Box, CircularProgress } from '@mui/material';
import { styles } from './ProtectedRoute.styles';

export const ProtectedRoute = (props: Readonly<React.PropsWithChildren>) => {
    const Component = withAuthenticationRequired(() => (
        <>{props.children}</>
    ), {
        onRedirecting: () => (
            <Box sx={styles.loadingContainer}>
                <CircularProgress />
            </Box>
        )
    });

    return <Component />;
}