import { Toolbar } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledToolbar = styled(Toolbar)(() => ({
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'right',
    gap: '26px',
    marginLeft: '26px',
}));