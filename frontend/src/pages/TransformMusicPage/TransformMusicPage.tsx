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

import AudioPlayer from '../../components/AudioPlayer';
import AudioUploader from '../../components/AudioUploader';
import { AFTERNOON, ANGRY, AUDIO_UPLOAD_SECTION_TITLE, CONTEXT_BIAS_LABEL, CUSTOMIZE_TRANSFORMATION_TEXT, DOWNLOAD_ENHANCED_TRACK_BUTTON_TEXT, DREAMY, EMOTIONAL, ENERGETIC, EVENING, HAPPY, INTENSE, INTENSITY_LABEL, MOOD_LABEL, MORNING, NIGHT, ORIGINAL_AUDIO_SECTION_TITLE, OVERLAP_LENGTH_LABEL, PEACEFUL, PROCESSED_AUDIO_SECTION_TITLE, PROCESSING_BUTTON_TEXT, RELAXED, ROMANTIC, SAD, SEGMENT_LENGTH_LABEL, TIME_OF_DAY_LABEL, TRANSFORM_MUSIC_BUTTON_TEXT, TRANSFORM_MUSIC_PAGE_TITLE, TRANSFORMATION_SETTINGS_SECTION_TITLE } from '../../library/resources';
import { Mood } from '../../models/Mood';
import { TimeOfDay } from '../../models/TimeOfDay';
import { styles } from './TransformMusicPage.styles';

export const TransformMusicPage = (): JSX.Element => {
    const theme = useTheme();

    const [originalAudio, setOriginalAudio] = useState<File | null>(null);
    const [processedAudio, setProcessedAudio] = useState<string | null>(null);

    const [isProcessing, setIsProcessing] = useState(false);

    const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(AFTERNOON);
    const [mood, setMood] = useState<Mood>(HAPPY);
    const [intensity, setIntensity] = useState<number>(8);
    const [segmentLength, setSegmentLength] = useState<number>(20);
    const [contextBias, setContextBias] = useState<number>(0.5);
    const [overlapLength, setOverlapLength] = useState<number>(2.5);

    const handleFileUpload = (file: File) => {
        setOriginalAudio(file);
        setProcessedAudio(null);
    };

    const handleProcessAudio = () => {
        if (!originalAudio) return;

        setIsProcessing(true);

        setTimeout(() => {
            setProcessedAudio(URL.createObjectURL(originalAudio));
            setIsProcessing(false);
        }, 3000);
    };

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
            <Box sx={styles.pageContainer}>
                <Typography
                    variant="h3"
                    component="h1"
                    align="center"
                    gutterBottom
                    sx={styles.pageTitle(theme)}
                >
                    {TRANSFORM_MUSIC_PAGE_TITLE}
                </Typography>

                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card elevation={3} sx={styles.card}>
                            <CardContent>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    {AUDIO_UPLOAD_SECTION_TITLE}
                                </Typography>

                                <AudioUploader onFileUpload={handleFileUpload} currentFile={originalAudio} />

                                {originalAudio && (
                                    <Box sx={styles.audioPlayerBox}>
                                        <Typography variant="h6" gutterBottom>
                                            {ORIGINAL_AUDIO_SECTION_TITLE}
                                        </Typography>
                                        <AudioPlayer audioFile={originalAudio} />
                                    </Box>
                                )}

                                {processedAudio && (
                                    <Box sx={styles.audioPlayerBoxProcessed}>
                                        <Typography variant="h6" gutterBottom>
                                            {PROCESSED_AUDIO_SECTION_TITLE}
                                        </Typography>
                                        <AudioPlayer audioSrc={processedAudio} />

                                        <Button
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            onClick={handleDownload}
                                            startIcon={<DownloadCloud />}
                                            sx={styles.downloadButton}
                                        >
                                            {DOWNLOAD_ENHANCED_TRACK_BUTTON_TEXT}
                                        </Button>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card elevation={3}>
                            <CardContent>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    {TRANSFORMATION_SETTINGS_SECTION_TITLE}
                                </Typography>
                                <Typography color="textSecondary" sx={styles.subtitle}>
                                    {CUSTOMIZE_TRANSFORMATION_TEXT}
                                </Typography>

                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <FormControl fullWidth>
                                            <InputLabel id="time-of-day-label">{TIME_OF_DAY_LABEL}</InputLabel>
                                            <Select
                                                labelId="time-of-day-label"
                                                value={timeOfDay}
                                                label={TIME_OF_DAY_LABEL}
                                                onChange={(e) => setTimeOfDay(e.target.value as TimeOfDay)}
                                            >
                                                <MenuItem value="Morning">{MORNING}</MenuItem>
                                                <MenuItem value="Afternoon">{AFTERNOON}</MenuItem>
                                                <MenuItem value="Evening">{EVENING}</MenuItem>
                                                <MenuItem value="Night">{NIGHT}</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <FormControl fullWidth>
                                            <InputLabel id="mood-label">{MOOD_LABEL}</InputLabel>
                                            <Select
                                                labelId="mood-label"
                                                value={mood}
                                                label={MOOD_LABEL}
                                                onChange={(e) => setMood(e.target.value as Mood)}
                                            >
                                                <MenuItem value="Angry">{ANGRY}</MenuItem>
                                                <MenuItem value="Dreamy">{DREAMY}</MenuItem>
                                                <MenuItem value="Emotional">{EMOTIONAL}</MenuItem>
                                                <MenuItem value="Energetic">{ENERGETIC}</MenuItem>
                                                <MenuItem value="Happy">{HAPPY}</MenuItem>
                                                <MenuItem value="Intense">{INTENSE}</MenuItem>
                                                <MenuItem value="Peaceful">{PEACEFUL}</MenuItem>
                                                <MenuItem value="Relaxed">{RELAXED}</MenuItem>
                                                <MenuItem value="Romantic">{ROMANTIC}</MenuItem>
                                                <MenuItem value="Sad">{SAD}</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <Typography id="intensity-slider" gutterBottom>
                                            {INTENSITY_LABEL}: {intensity}
                                        </Typography>
                                        <Slider
                                            value={intensity}
                                            onChange={(_, value) => setIntensity(value as number)}
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
                                            {SEGMENT_LENGTH_LABEL}: {segmentLength} s
                                        </Typography>
                                        <Slider
                                            value={segmentLength}
                                            onChange={(_, value) => setSegmentLength(value as number)}
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
                                            {CONTEXT_BIAS_LABEL}: {contextBias.toFixed(1)}
                                        </Typography>
                                        <Slider
                                            value={contextBias}
                                            onChange={(_, value) => setContextBias(value as number)}
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
                                            {OVERLAP_LENGTH_LABEL}: {overlapLength.toFixed(1)} s
                                        </Typography>
                                        <Slider
                                            value={overlapLength}
                                            onChange={(_, value) => setOverlapLength(value as number)}
                                            aria-labelledby="overlap-length-slider"
                                            valueLabelDisplay="auto"
                                            step={0.5}
                                            marks
                                            min={0}
                                            max={5}
                                        />
                                    </Grid>
                                </Grid>

                                <Divider sx={styles.divider} />

                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    size="large"
                                    disabled={!originalAudio || isProcessing}
                                    onClick={handleProcessAudio}
                                    startIcon={isProcessing ? <CircularProgress size={24} color="inherit" /> : <Sparkles />}
                                    sx={styles.processButton}
                                >
                                    {isProcessing ? PROCESSING_BUTTON_TEXT : TRANSFORM_MUSIC_BUTTON_TEXT}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};