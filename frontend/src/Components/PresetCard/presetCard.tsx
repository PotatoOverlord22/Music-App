import { Box, Card, CardContent, Typography, useTheme } from "@mui/material";
import { Check } from "lucide-react";
import { styles } from "./presetCard.styles";
import { PresetCardProps } from "./presetCard.types";

export const PresetCard = ({ preset, isSelected, onSelect }: PresetCardProps) => {
    const theme = useTheme();

    return (
        <Card
            elevation={isSelected ? 4 : 2}
            sx={styles.presetCard(theme, isSelected)}
            onClick={() => onSelect(preset.genre)}
        >
            <CardContent sx={{ position: 'relative', pb: '16px !important' }}>
                {isSelected && (
                    <Box sx={styles.selectedPresetIndicator(theme)}>
                        <Check size={14} />
                    </Box>
                )}
                <Typography variant="h6" component="h3" gutterBottom sx={{ mb: 3 }}>
                    {preset.name}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', height: 60 }}>
                    {preset.bands.map((gain, index) => (
                        <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box
                                sx={{
                                    width: 8,
                                    height: Math.abs(gain) * 6 + 10,
                                    bgcolor: gain >= 0 ? theme.palette.primary.main : theme.palette.error.main,
                                    borderRadius: 1,
                                    mb: 0.5,
                                    opacity: 0.7,
                                }}
                            />
                            <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>
                                {gain > 0 ? '+' : ''}{gain}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
};