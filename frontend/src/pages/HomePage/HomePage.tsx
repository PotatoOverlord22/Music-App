import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Headphones, Info, Mic2, Music, Radio, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { InternalRoutes } from '../../library/Enums/InternalRoutes';
import { styles } from './HomePage.styles';

function HomePage() {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Container maxWidth="lg">
            <Box sx={styles.container}>
                <Grid container spacing={4} alignItems="center">
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={styles.logo}>
                            <Music
                                size={40}
                                color={theme.palette.primary.main}
                                style={styles.logoIcon()}
                            />
                            <Typography
                                variant="h2"
                                component="h1"
                                sx={styles.title(theme)}
                            >
                                MusicMania
                            </Typography>
                        </Box>
                        <Typography variant="h5" color="textSecondary" sx={styles.subtitle}>
                            Transform your music with AI-powered analysis and enhancement. Experience your
                            favorite tracks in a whole new way with context-aware recommendations.
                        </Typography>
                        <Box sx={styles.buttonContainer}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                startIcon={<Wand2 />}
                                onClick={() => navigate(InternalRoutes.TransformMusic)}
                                sx={styles.primaryButton(theme)}
                            >
                                Transform Music
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="large"
                                startIcon={<Info />}
                                onClick={() => navigate(InternalRoutes.HowItworks)}
                                sx={styles.secondaryButton}
                            >
                                How It Works
                            </Button>
                        </Box>
                    </Grid>
                    <Grid
                        size={{ xs: 12, md: 6 }}
                        sx={styles.visualizationContainer}
                    >
                        <Paper
                            elevation={4}
                            sx={styles.animatedPaper(theme)}
                        >
                            <Box sx={styles.iconContainer}>
                                <Box sx={styles.floatingIcons}>
                                    <Headphones size={64} color="white" style={styles.icon} />
                                    <Radio size={64} color="white" style={styles.icon} />
                                    <Mic2 size={64} color="white" style={styles.icon} />
                                </Box>
                                <Box sx={styles.equalizerContainer}>
                                    {Array.from({ length: 12 }).map((_, i) => (
                                        <Box
                                            key={i}
                                            sx={{
                                                ...styles.equalizerBar(),
                                                animationDelay: `${i * 0.1}s`,
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                <Box sx={styles.featuresSection}>
                    <Typography variant="h3" gutterBottom textAlign="center" sx={{ mb: 5 }}>
                        Features
                    </Typography>
                    <Grid container spacing={4}>
                        {[
                            {
                                title: 'Genre Prediction',
                                description:
                                    'Our CNN model analyzes mel-spectrograms to predict musical genres with high accuracy.',
                            },
                            {
                                title: 'Context-Aware Recommendations',
                                description:
                                    'Get music recommendations based on time of day, mood, and audio features like danceability and energy.',
                            },
                            {
                                title: 'Audio Enhancement',
                                description:
                                    'Apply genre-specific EQ profiles to enhance your music for the perfect listening experience.',
                            },
                        ].map((feature, index) => (
                            <Grid size={{ xs: 12, md: 4 }} key={index}>
                                <Paper
                                    elevation={2}
                                    sx={styles.featureCard(theme)}
                                >
                                    <Typography variant="h5" component="h3" gutterBottom>
                                        {feature.title}
                                    </Typography>
                                    <Typography color="textSecondary">{feature.description}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}

export default HomePage;