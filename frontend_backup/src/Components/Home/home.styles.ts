import { Box, FormControl } from '@mui/material';
import { styled } from '@mui/material/styles';

export const HomeContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(2),
    gap: theme.spacing(3),
    maxWidth: '550px'
}));

export const StyledFormControl = styled(FormControl)(() => ({
    width: '550px'
}));

export const StyledBox = styled(Box)(() => ({
    width: '550px'
}));