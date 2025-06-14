import { Theme } from "@mui/material";

export const styles = {
    presetCard: (theme: Theme, isSelected: boolean) => ({
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: isSelected ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[4],
        },
    }),
    selectedPresetIndicator: (theme: Theme) => ({
        position: 'absolute',
        top: 8,
        right: 8,
        bgcolor: theme.palette.primary.main,
        color: 'white',
        width: 24,
        height: 24,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    })
}