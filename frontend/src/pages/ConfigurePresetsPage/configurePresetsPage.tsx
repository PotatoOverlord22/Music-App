import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useMutation } from '@tanstack/react-query';
import { RotateCcw, Save, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PresetCard } from '../../components/PresetCard/presetCard';
import { useServices } from '../../library/Contexts/ServicesContext/servicesContext';
import { Services } from '../../library/Contexts/ServicesContext/servicesContext.types';
import { useFetchQuery } from '../../library/Hooks/hooks';
import { DEFAULT_PRESETS, FREQUENCY_BANDS_LABELS } from '../../library/constants';
import { EQPreset } from '../../models/EQPreset';
import { Genre } from '../../models/Genre';
import { styles } from './configurePresetsPage.styles';

export const ConfigurePresetsPage = () => {
    const theme = useTheme();
    const services: Services = useServices();
    const [presets, setPresets] = useState<EQPreset[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<Genre>('pop');
    const [hasChanges, setHasChanges] = useState(false);
    const { data: fetchedPresets, isLoading } = useFetchQuery(services.GenrePresetService.GetGenrePresets())

    const savePresetsMutation = useMutation({
        ...services.GenrePresetService.UpdatePresets(),
        onSuccess: () => {
            setHasChanges(false);
        },
    });

    useEffect(() => {
        if (fetchedPresets) {
            setPresets(fetchedPresets);
        }
    }, [fetchedPresets]);

    const selectedPreset = presets.find(p => p.genre === selectedGenre);

    const handleBandChange = (bandIndex: number, gain: number) => {
        setPresets(prev => prev.map(preset =>
            preset.genre === selectedGenre
                ? { ...preset, bands: preset.bands.map((b, i) => i === bandIndex ? gain : b) }
                : preset
        ));
        setHasChanges(true);
    };

    const handleResetPreset = () => {
        const defaultBands = DEFAULT_PRESETS[selectedGenre];
        setPresets(prev => prev.map(preset =>
            preset.genre === selectedGenre
                ? { ...preset, bands: [...defaultBands] }
                : preset
        ));
        setHasChanges(true);
    };

    const handleSavePresets = () => {
        savePresetsMutation.mutate(presets);
    };

    if (isLoading) {
        return (
            <Container maxWidth="lg">
                <Box sx={styles.loadingContainer}>
                    <CircularProgress size={60} />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Box sx={styles.pageContainer}>
                <Typography
                    variant="h3"
                    component="h1"
                    align="center"
                    gutterBottom
                    sx={styles.pageTitle(theme)}
                >
                    Configure EQ Presets
                </Typography>

                <Typography variant="body1" align="center" color="textSecondary" sx={{ mb: 4 }}>
                    Customize equalizer settings for each music genre to enhance your listening experience
                </Typography>

                {/* Preset Selection Grid */}
                <Box sx={styles.presetGrid}>
                    <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                        Select Genre Preset
                    </Typography>
                    <Grid container spacing={2}>
                        {presets.map((preset) => (
                            <Grid size={{ xs: 6, sm: 4, md: 2.4 }} key={preset.genre}>
                                <PresetCard
                                    preset={preset}
                                    isSelected={selectedGenre === preset.genre}
                                    onSelect={setSelectedGenre}
                                    onBandChange={handleBandChange}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Equalizer Section */}
                {selectedPreset && (
                    <Box sx={styles.equalizerSection}>
                        <Paper elevation={3} sx={styles.equalizerCard}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Settings size={24} color={theme.palette.primary.main} />
                                <Typography variant="h5" sx={{ ml: 1 }}>
                                    {selectedPreset.name} Equalizer
                                </Typography>
                            </Box>

                            <Grid container spacing={1} sx={{ mb: 3 }}>
                                {selectedPreset.bands.map((gain, index) => (
                                    <Grid size={{ xs: 1.2 }} key={index}>
                                        <Box sx={styles.bandContainer}>
                                            <Typography variant="body2" sx={styles.bandValue(theme)}>
                                                {gain > 0 ? '+' : ''}{gain}dB
                                            </Typography>
                                            <Slider
                                                orientation="vertical"
                                                value={gain}
                                                onChange={(_, value) => handleBandChange(index, value as number)}
                                                min={-9}
                                                max={9}
                                                step={1}
                                                marks
                                                sx={styles.bandSlider}
                                                color="primary"
                                            />
                                            <Typography variant="caption" sx={styles.bandLabel}>
                                                {FREQUENCY_BANDS_LABELS[index]}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<RotateCcw />}
                                    onClick={handleResetPreset}
                                    sx={styles.resetButton}
                                >
                                    Reset to Default
                                </Button>

                                <Button
                                    variant="contained"
                                    startIcon={savePresetsMutation.isPending ? <CircularProgress size={20} color="inherit" /> : <Save />}
                                    onClick={handleSavePresets}
                                    disabled={!hasChanges || savePresetsMutation.isPending}
                                    sx={styles.saveButton(theme)}
                                >
                                    {savePresetsMutation.isPending ? 'Saving...' : 'Save All Presets'}
                                </Button>
                            </Box>
                        </Paper>
                    </Box>
                )}
            </Box>
        </Container>
    );
};