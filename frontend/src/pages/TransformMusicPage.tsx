import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { DownloadCloud, Sparkles } from 'lucide-react';
import { useState } from 'react';

import AudioPlayer from '../components/AudioPlayer';
import AudioUploader from '../components/AudioUploader';

// Types
type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening' | 'Night';
type Mood = 'Angry' | 'Dreamy' | 'Emotional' | 'Energetic' | 'Happy' | 'Intense' | 'Peaceful' | 'Relaxed' | 'Romantic' | 'Sad';

function TransformMusicPage() {
    const theme = useTheme();

    // State for audio files
    const [originalAudio, setOriginalAudio] = useState<File | null>(null);
    const [processedAudio, setProcessedAudio] = useState<string | null>(null);

    // State for processing status
    const [isProcessing, setIsProcessing] = useState(false);

    // State for transformation settings
    const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('Afternoon');
    const [mood, setMood] = useState<Mood>('Happy');
    const [intensity, setIntensity] = useState<number>(8);
    const [segmentLength, setSegmentLength] = useState<number>(20);
    const [contextBias, setContextBias] = useState<number>(0.5);
    const [overlapLength, setOverlapLength] = useState<number>(2.5);

    // Handle file upload
    const handleFileUpload = (file: File) => {
        setOriginalAudio(file);
        // Reset processed audio when new file is uploaded
        setProcessedAudio(null);
    };

    // Handle processing
    const handleProcessAudio = () => {
        if (!originalAudio) return;

        setIsProcessing(true);

        // Mock API call - in actual implementation, this would call your .NET backend
        setTimeout(() => {
            // Create a mock processed file URL
            // In a real implementation, this would be the URL to the processed file from your backend
            setProcessedAudio(URL.createObjectURL(originalAudio));
            setIsProcessing(false);
        }, 3000);
    };

    // Handle download
    const handleDownload = () => {
        if (processedAudio) {
            const a = document.createElement('a');
            a.href = processedAudio;
            a.download = `enhanced_${originalAudio?.name ?? 'audio.mp3'}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ py: { xs: 4, md: 6 } }}>
                <Typography
                    variant="h3"
                    component="h1"
                    align="center"
                    gutterBottom
                    sx={{ mb: 4, color: theme.palette.primary.main }}
                >
                    Transform Your Music
                </Typography>

                <Grid container spacing={4}>
                    {/* Audio Upload and Preview Section */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card elevation={3} sx={{ mb: 4, height: '100%' }}>
                            <CardContent>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    Upload Audio
                                </Typography>

                                <AudioUploader onFileUpload={handleFileUpload} currentFile={originalAudio} />

                                {originalAudio && (
                                    <Box sx={{ mt: 3 }}>
                                        <Typography variant="h6" gutterBottom>
                                            Original Audio
                                        </Typography>
                                        <AudioPlayer audioFile={originalAudio} />
                                    </Box>
                                )}

                                {processedAudio && (
                                    <Box sx={{ mt: 4 }}>
                                        <Typography variant="h6" gutterBottom>
                                            Processed Audio
                                        </Typography>
                                        <AudioPlayer audioSrc={processedAudio} />

                                        <Button
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            onClick={handleDownload}
                                            startIcon={<DownloadCloud />}
                                            sx={{ mt: 2 }}
                                        >
                                            Download Enhanced Track
                                        </Button>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Controls Section */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card elevation={3}>
                            <CardContent>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    Transformation Settings
                                </Typography>
                                <Typography color="textSecondary" sx={{ mb: 3 }}>
                                    Customize how your music will be transformed
                                </Typography>

                                <Grid container spacing={3}>
                                    {/* Context Controls */}
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <FormControl fullWidth>
                                            <InputLabel id="time-of-day-label">Time of Day</InputLabel>
                                            <Select
                                                labelId="time-of-day-label"
                                                value={timeOfDay}
                                                label="Time of Day"
                                                onChange={(e) => setTimeOfDay(e.target.value as TimeOfDay)}
                                            >
                                                <MenuItem value="Morning">Morning</MenuItem>
                                                <MenuItem value="Afternoon">Afternoon</MenuItem>
                                                <MenuItem value="Evening">Evening</MenuItem>
                                                <MenuItem value="Night">Night</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <FormControl fullWidth>
                                            <InputLabel id="mood-label">Mood</InputLabel>
                                            <Select
                                                labelId="mood-label"
                                                value={mood}
                                                label="Mood"
                                                onChange={(e) => setMood(e.target.value as Mood)}
                                            >
                                                <MenuItem value="Angry">Angry</MenuItem>
                                                <MenuItem value="Dreamy">Dreamy</MenuItem>
                                                <MenuItem value="Emotional">Emotional</MenuItem>
                                                <MenuItem value="Energetic">Energetic</MenuItem>
                                                <MenuItem value="Happy">Happy</MenuItem>
                                                <MenuItem value="Intense">Intense</MenuItem>
                                                <MenuItem value="Peaceful">Peaceful</MenuItem>
                                                <MenuItem value="Relaxed">Relaxed</MenuItem>
                                                <MenuItem value="Romantic">Romantic</MenuItem>
                                                <MenuItem value="Sad">Sad</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {/* Sliders */}
                                    <Grid size={{ xs: 12 }}>
                                        <Typography id="intensity-slider" gutterBottom>
                                            Intensity: {intensity}
                                        </Typography>
                                        <Slider
                                            value={intensity}
                                            onChange={(_, value) => setIntensity(value)}
                                            aria-labelledby="intensity-slider"
                                            valueLabelDisplay="auto"
                                            step={1}
                                            marks
                                            min={1}
                                            max={15}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <Typography id="segment-length-slider" gutterBottom>
                                            Segment Length: {segmentLength} s
                                        </Typography>
                                        <Slider
                                            value={segmentLength}
                                            onChange={(_, value) => setSegmentLength(value)}
                                            aria-labelledby="segment-length-slider"
                                            valueLabelDisplay="auto"
                                            step={1}
                                            marks
                                            min={10}
                                            max={30}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <Typography id="context-bias-slider" gutterBottom>
                                            Context Bias: {contextBias.toFixed(1)}
                                        </Typography>
                                        <Slider
                                            value={contextBias}
                                            onChange={(_, value) => setContextBias(value)}
                                            aria-labelledby="context-bias-slider"
                                            valueLabelDisplay="auto"
                                            step={0.1}
                                            marks
                                            min={0}
                                            max={1}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <Typography id="overlap-length-slider" gutterBottom>
                                            Overlap Length: {overlapLength.toFixed(1)} s
                                        </Typography>
                                        <Slider
                                            value={overlapLength}
                                            onChange={(_, value) => setOverlapLength(value)}
                                            aria-labelledby="overlap-length-slider"
                                            valueLabelDisplay="auto"
                                            step={0.5}
                                            marks
                                            min={0}
                                            max={5}
                                        />
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 3 }} />

                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    size="large"
                                    disabled={!originalAudio || isProcessing}
                                    onClick={handleProcessAudio}
                                    startIcon={isProcessing ? <CircularProgress size={24} color="inherit" /> : <Sparkles />}
                                    sx={{ mt: 2, py: 1.5 }}
                                >
                                    {isProcessing ? 'Processing...' : 'Transform Music'}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

export default TransformMusicPage;