import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Check, RotateCcw, Save, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { EQPreset } from '../../models/EQPreset';
import { Genre } from '../../models/Genre';
import { styles } from './configurePresetsPage.styles';
import { PresetCardProps } from './configurePresetsPage.types';

const DEFAULT_PRESETS: Record<Genre, number[]> = {
    'blues': [-1, 0, 2, 2, 1, 0, -1, 0, 1, 1],
    'classical': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'country': [0, 1, 1, 2, 1, 0, 0, 0, 0, 0],
    'disco': [2, 3, 2, 1, 0, 0, 1, 2, 3, 2],
    'hiphop': [3, 4, 2, 0, -1, -1, 0, 1, 1, 0],
    'jazz': [0, 1, 1, 2, 2, 1, 0, 0, 1, 0],
    'metal': [2, 3, 0, -3, -4, -3, 0, 3, 3, 2],
    'pop': [0, 1, 2, 2, 1, 0, 1, 1, 2, 2],
    'reggae': [0, 1, 0, 0, -1, -1, 0, 0, 1, 0],
    'rock': [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
};

const FREQUENCY_BANDS_LABELS = ['20Hz', '44Hz', '94Hz', '207Hz', '450Hz', '980Hz', '2.1khz', '4.6kHz', '10kHz', '22.05kHz'];

// Mock API functions (replace with actual API calls)
const fetchPresets = async (): Promise<EQPreset[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return Object.entries(DEFAULT_PRESETS).map(([genre, bands]) => ({
        genre: genre as Genre,
        name: genre.charAt(0).toUpperCase() + genre.slice(1),
        bands,
    }));
};

const savePresets = async (presets: EQPreset[]): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Saving presets:', presets);
};

const PresetCard = ({ preset, isSelected, onSelect }: PresetCardProps) => {
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
                <Typography variant="h6" component="h3" gutterBottom>
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

const ConfigurePresetsPage = () => {
    const theme = useTheme();
    const [presets, setPresets] = useState<EQPreset[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<Genre>('pop');
    const [hasChanges, setHasChanges] = useState(false);

    // Fetch presets from backend
    const { data: fetchedPresets, isLoading } = useQuery({
        queryKey: ['eq-presets'],
        queryFn: fetchPresets,
    });

    // Save presets mutation
    const savePresetsMutation = useMutation({
        mutationFn: savePresets,
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
        <Container maxWidth="lg">
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

export default ConfigurePresetsPage;