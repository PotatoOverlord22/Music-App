import { useAuth0 } from '@auth0/auth0-react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { Music, MusicIcon } from 'lucide-react';
import { useState } from 'react';

function UserMenu() {
    const { user, logout } = useAuth0();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    // Mock statistics - in a real app, these would come from your backend
    const stats = {
        transformedWithContext: 15,
        transformedWithoutContext: 8
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        logout({ logoutParams: { returnTo: window.location.origin } });
    };

    return (
        <>
            <IconButton
                onClick={handleMenu}
                color="inherit"
                sx={{ ml: 1 }}
                aria-controls="user-menu"
                aria-haspopup="true"
            >
                <Avatar
                    alt={user?.name || 'User'}
                    src={user?.picture || ''}
                    sx={{ width: 32, height: 32 }}
                />
            </IconButton>
            <Menu
                id="user-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    sx: { width: 320, maxWidth: '100%' }
                }}
            >
                <MenuItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {user?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {user?.email}
                    </Typography>
                </MenuItem>
                <Divider />
                <MenuItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Your Statistics
                    </Typography>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Music size={16} style={{ marginRight: 8 }} />
                            <Typography variant="body2">
                                With Context: {stats.transformedWithContext}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <MusicIcon size={16} style={{ marginRight: 8 }} />
                            <Typography variant="body2">
                                Without Context: {stats.transformedWithoutContext}
                            </Typography>
                        </Box>
                    </Box>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </>
    );
}

export default UserMenu;