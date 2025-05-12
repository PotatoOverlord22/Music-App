import { styled } from '@mui/material/styles';
import { Toolbar } from '@mui/material';

export const StyledToolbar = styled(Toolbar)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignContent: 'center',
  justifyContent: 'right',
  gap: '26px',
  marginLeft: '26px',
}));
