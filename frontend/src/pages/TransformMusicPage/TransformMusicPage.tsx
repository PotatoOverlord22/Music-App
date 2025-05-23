import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import { useTheme } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useMutation } from '@tanstack/react-query';
import { saveAs } from 'file-saver';
import { DownloadCloud, HelpCircle, Sparkles } from 'lucide-react';
import { useState } from 'react';

import AudioPlayer from '../../components/AudioPlayer';
import AudioUploader from '../../components/AudioUploader';
import { useServices } from '../../library/Contexts/ServicesContext/servicesContext';
import { Services } from '../../library/Contexts/ServicesContext/servicesContext.types';
import { useFetchQuery } from '../../library/Hooks/hooks';
import { AUDIO_UPLOAD_SECTION_TITLE, CONTEXT_BIAS_LABEL, CUSTOMIZE_TRANSFORMATION_TEXT, DOWNLOAD_ENHANCED_TRACK_BUTTON_TEXT, HAPPY, INTENSITY_LABEL, MOOD_LABEL, ORIGINAL_AUDIO_SECTION_TITLE, OVERLAP_LENGTH_LABEL, PROCESSED_AUDIO_SECTION_TITLE, PROCESSING_BUTTON_TEXT, SEGMENT_LENGTH_LABEL, TIME_OF_DAY_LABEL, TRANSFORM_MUSIC_BUTTON_TEXT, TRANSFORM_MUSIC_PAGE_TITLE, TRANSFORMATION_SETTINGS_SECTION_TITLE } from '../../library/resources';
import { getTimeOfDay } from '../../library/Utils/dateUtils';
import { Mood } from '../../models/Mood';
import { TimeOfDay } from '../../models/TimeOfDay';
import { styles } from './TransformMusicPage.styles';

export const TransformMusicPage = (): JSX.Element => {
    const theme = useTheme();
    const services: Services = useServices();

    const [originalAudio, setOriginalAudio] = useState<File | null>(null);
    const [processedAudio, setProcessedAudio] = useState<string | null>(null);
    const [useContext, setUseContext] = useState<boolean>(true);

    const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(getTimeOfDay(new Date()) as TimeOfDay);
    const [mood, setMood] = useState<Mood>(HAPPY);
    const [intensity, setIntensity] = useState<number>(8);
    const [segmentLength, setSegmentLength] = useState<number>(20);
    const [contextBias, setContextBias] = useState<number>(0.5);
    const [overlapLength, setOverlapLength] = useState<number>(2.5);

    const { data: moods, isLoading: areMoodsLoading } = useFetchQuery(services.DataService.GetMoods());
    const { data: timesOfDay, isLoading: areTimesOfDayLoading } = useFetchQuery(services.DataService.GetTimesOfDay());

    const transformSongMutation = useMutation({
        ...services.MusicService.TransformSong(),
        onSuccess: (data: Blob) => {
            setProcessedAudio(URL.createObjectURL(data));
        }
    });

    const transformSongWithContextMutation = useMutation({
        ...services.MusicService.TransformSongWithContext(),
        onSuccess: (data: Blob) => {
            setProcessedAudio(URL.createObjectURL(data));
        }
    });

    const isProcessing = transformSongMutation.isPending || transformSongWithContextMutation.isPending;

    const handleFileUpload = (file: File) => {
        setOriginalAudio(file);
        setProcessedAudio(null);
    };

    const handleProcessAudio = () => {
        if (!originalAudio) return;

        const formData = new FormData();
        formData.append('file', originalAudio);

        if (useContext) {
            formData.append('mood', mood);
            formData.append('timeOfDay', timeOfDay);
            formData.append('intensity', intensity.toString());
            formData.append('segmentLength', segmentLength.toString());
            formData.append('contextBias', contextBias.toString());
            formData.append('overlapLength', overlapLength.toString());
            transformSongWithContextMutation.mutate(formData);
        } else {
            transformSongMutation.mutate(formData);
        }
    };

    const handleDownload = () => {
        if (processedAudio && originalAudio?.name) {
            saveAs(processedAudio, `enhanced_${originalAudio.name}`);
        } else if (processedAudio) {
            saveAs(processedAudio, 'enhanced_audio.mp3');
        }
    };

    const renderTooltip = (label: string, description: string) => (
        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
            {label}
            <Tooltip title={description} arrow>
                <IconButton size="small" sx={{ ml: 0.5 }}>
                    <HelpCircle size={16} />
                </IconButton>
            </Tooltip>
        </Box>
    );

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

                                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                                    <Switch
                                        checked={useContext}
                                        onChange={(e) => setUseContext(e.target.checked)}
                                        color="primary"
                                    />
                                    {renderTooltip(
                                        "Use Context",
                                        "Enhance song transformation by considering time of day and mood. When enabled, you can customize these contextual parameters."
                                    )}
                                </Box>

                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        {
                                            areTimesOfDayLoading ? (
                                                <CircularProgress size={24} />
                                            )
                                                : (
                                                    <FormControl fullWidth disabled={!useContext}>
                                                        <InputLabel id="time-of-day-label">{TIME_OF_DAY_LABEL}</InputLabel>
                                                        <Select
                                                            labelId="time-of-day-label"
                                                            value={timeOfDay}
                                                            label={TIME_OF_DAY_LABEL}
                                                            onChange={(e) => setTimeOfDay(e.target.value as TimeOfDay)}
                                                        >
                                                            {timesOfDay?.map((time) => (
                                                                <MenuItem key={time} value={time}>
                                                                    {time}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                )}
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        {areMoodsLoading ? (
                                            <CircularProgress size={24} />
                                        ) : (
                                            <FormControl fullWidth disabled={!useContext}>
                                                <InputLabel id="mood-label">{MOOD_LABEL}</InputLabel>
                                                <Select
                                                    labelId="mood-label"
                                                    value={mood}
                                                    label={MOOD_LABEL}
                                                    onChange={(e) => setMood(e.target.value as Mood)}
                                                >
                                                    {moods?.map((m) => (
                                                        <MenuItem key={m} value={m}>
                                                            {m}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <Typography gutterBottom component={"div"}>
                                            {renderTooltip(
                                                `${INTENSITY_LABEL}: ${intensity}`,
                                                "Controls how strongly the transformations are applied to your music (1-15)"
                                            )}
                                        </Typography>
                                        <Slider
                                            value={intensity}
                                            onChange={(_, value) => setIntensity(value)}
                                            valueLabelDisplay="auto"
                                            step={1}
                                            marks
                                            min={1}
                                            max={15}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <Typography gutterBottom component={"div"}>
                                            {renderTooltip(
                                                `${SEGMENT_LENGTH_LABEL}: ${segmentLength} s`,
                                                "Determines the length of each analyzed segment in seconds (10-30)"
                                            )}
                                        </Typography>
                                        <Slider
                                            value={segmentLength}
                                            onChange={(_, value) => setSegmentLength(value)}
                                            valueLabelDisplay="auto"
                                            step={1}
                                            marks
                                            min={10}
                                            max={30}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <Typography gutterBottom component={"div"}>
                                            {renderTooltip(
                                                `${CONTEXT_BIAS_LABEL}: ${contextBias.toFixed(1)}`,
                                                "Adjusts how much the context (time and mood) influences the transformation (0-1)"
                                            )}
                                        </Typography>
                                        <Slider
                                            value={contextBias}
                                            onChange={(_, value) => setContextBias(value)}
                                            valueLabelDisplay="auto"
                                            step={0.1}
                                            marks
                                            min={0}
                                            max={1}
                                            disabled={!useContext}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <Typography gutterBottom component={"div"}>
                                            {renderTooltip(
                                                `${OVERLAP_LENGTH_LABEL}: ${overlapLength.toFixed(1)} s`,
                                                "Controls how segments blend together for smoother transitions (0-5 seconds)"
                                            )}
                                        </Typography>
                                        <Slider
                                            value={overlapLength}
                                            onChange={(_, value) => setOverlapLength(value)}
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