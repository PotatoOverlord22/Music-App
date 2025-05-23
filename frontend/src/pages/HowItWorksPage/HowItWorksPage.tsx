import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Calculator, Clock, Music, AudioWaveformIcon as WaveformIcon } from 'lucide-react';

import mfccSpectrogram from '../../assets/images/mfcc.jpg';

export const HowItWorksPage = (): JSX.Element => {
    const theme = useTheme();

    return (
        <Container maxWidth="md">
            <Box sx={{ pt: 6, pb: 8 }}>
                <Typography
                    variant="h2"
                    component="h1"
                    align="center"
                    gutterBottom
                    sx={{ mb: 4, mt: 6, color: theme.palette.primary.main }}
                >
                    How It Works
                </Typography>

                <Paper elevation={2} sx={{ p: 4, mb: 6, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <WaveformIcon size={28} color={theme.palette.primary.main} />
                        <Typography variant="h4" component="h2" sx={{ ml: 2 }}>
                            MFCC Spectrograms
                        </Typography>
                    </Box>
                    <Typography gutterBottom sx={{ mb: 2 }}>
                        We transform audio files into <b>Mel-frequency cepstral coefficient (MFCC) spectrograms</b>, which are visual representations of
                        the spectral characteristics of sound, highlighting features crucial for human perception. These help our AI recognize different genres.
                    </Typography>
                    <img
                        src={mfccSpectrogram}
                        alt="MFCC Spectrogram Visualization"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 2 }}>
                        Example of an MFCC spectrogram visualization
                    </Typography>
                </Paper>

                <Paper elevation={2} sx={{ p: 4, mb: 6, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Calculator size={28} color={theme.palette.primary.main} />
                        <Typography variant="h4" component="h2" sx={{ ml: 2 }}>
                            Segment-Based Genre Prediction
                        </Typography>
                    </Box>
                    <Typography>
                        Our CNN (Convolutional Neural Network) model analyzes each segment of your audio
                        file separately. This approach allows us to identify genre changes within a single
                        track, recognizing when a song shifts from one style to another.
                    </Typography>
                    <Typography>
                        The model was trained on thousands of labeled audio examples across various genres,
                        allowing it to recognize patterns specific to each musical style.
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Key Audio Features:
                        </Typography>
                        <Grid container spacing={2}>
                            {[
                                {
                                    name: 'Danceability',
                                    description:
                                        'How suitable a track is for dancing based on tempo, rhythm stability, beat strength, and regularity',
                                },
                                {
                                    name: 'Energy',
                                    description:
                                        'A perceptual measure of intensity and activity throughout the track',
                                },
                                {
                                    name: 'Valence',
                                    description:
                                        'The musical positiveness conveyed by a track, from sad to happy',
                                },
                            ].map((feature, index) => (
                                <Grid size={{ xs: 12, md: 4 }} key={index}>
                                    <Box
                                        sx={{
                                            p: 2,
                                            height: '100%',
                                            bgcolor: 'background.default',
                                            borderRadius: 1,
                                            border: `1px solid ${theme.palette.divider}`,
                                        }}
                                    >
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {feature.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {feature.description}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Paper>

                <Paper elevation={2} sx={{ p: 4, mb: 6, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Clock size={28} color={theme.palette.primary.main} />
                        <Typography variant="h4" component="h2" sx={{ ml: 2 }}>
                            Context-Aware Recommender
                        </Typography>
                    </Box>
                    <Typography>
                        Our context-aware recommender system takes into account:
                    </Typography>
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    bgcolor: 'background.default',
                                    border: `1px solid ${theme.palette.divider}`,
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    Time of Day
                                </Typography>
                                <Typography variant="body2">
                                    Different music genres work better at different times:
                                </Typography>
                                <Box component="ul" sx={{ pl: 2 }}>
                                    <Typography component="li" variant="body2">
                                        Morning: Energetic, positive tracks to start your day
                                    </Typography>
                                    <Typography component="li" variant="body2">
                                        Afternoon: Balanced, focus-enhancing music
                                    </Typography>
                                    <Typography component="li" variant="body2">
                                        Evening: Relaxing, wind-down genres
                                    </Typography>
                                    <Typography component="li" variant="body2">
                                        Night: Atmospheric, deep genres or high-energy dance music
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    bgcolor: 'background.default',
                                    border: `1px solid ${theme.palette.divider}`,
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    Mood
                                </Typography>
                                <Typography variant="body2">
                                    Your selected mood significantly influences recommendations:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {[
                                        'Angry',
                                        'Dreamy',
                                        'Emotional',
                                        'Energetic',
                                        'Happy',
                                        'Intense',
                                        'Peaceful',
                                        'Relaxed',
                                        'Romantic',
                                        'Sad',
                                    ].map((mood) => (
                                        <Box
                                            key={mood}
                                            sx={{
                                                px: 1.5,
                                                py: 0.5,
                                                borderRadius: 10,
                                                bgcolor: theme.palette.primary.light + '33',
                                                color: theme.palette.primary.dark,
                                            }}
                                        >
                                            <Typography variant="body2">{mood}</Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                    <Typography>
                        By combining these contextual factors with the audio features, we can recommend
                        the most appropriate genre enhancements for your music.
                    </Typography>
                </Paper>

                <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Music size={28} color={theme.palette.primary.main} />
                        <Typography variant="h4" component="h2" sx={{ ml: 2 }}>
                            Audio Enhancement
                        </Typography>
                    </Box>
                    <Typography>
                        Once we've analyzed your audio and identified the genres, we apply genre-specific EQ
                        profiles to each segment of your music. These profiles enhance the characteristic
                        frequencies of each genre, making them sound more authentic and engaging.
                    </Typography>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" gutterBottom>
                        Customization Controls
                    </Typography>
                    <Typography>
                        In the Transform Music page, you can fine-tune the enhancement process with several
                        controls:
                    </Typography>
                    <Grid container spacing={2}>
                        {[
                            {
                                name: 'Intensity',
                                description:
                                    'Controls how strongly the genre-specific enhancements are applied (1-15)',
                            },
                            {
                                name: 'Segment Length',
                                description:
                                    'Adjusts how long each analyzed segment should be (10-30 seconds)',
                            },
                            {
                                name: 'Context Bias',
                                description:
                                    'Determines how much your selected mood and time of day influence the recommendations (0-1)',
                            },
                            {
                                name: 'Overlap Length',
                                description:
                                    'Controls how segments blend together for smoother transitions (0-5 seconds)',
                            },
                        ].map((control, index) => (
                            <Grid size={{ xs: 12, sm: 6 }} key={index}>
                                <Box
                                    sx={{
                                        p: 2,
                                        height: '100%',
                                        bgcolor: 'background.default',
                                        borderRadius: 1,
                                        border: `1px solid ${theme.palette.divider}`,
                                    }}
                                >
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {control.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {control.description}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </Box>
        </Container>
    );
}