import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const PageContentBackground = styled(Box)(({ theme }) => ({
    flex: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper
}));

export const LoadingIndicator = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
}));

export const PageContentContainer = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
}));