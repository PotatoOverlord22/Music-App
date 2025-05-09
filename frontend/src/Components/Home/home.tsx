import { Alert, Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Slider, Typography } from '@mui/material';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { saveAs } from 'file-saver';
import React, { JSX } from "react";
import { INTENISITY_MAX, INTENISITY_MIN } from '../../Library/constants';
import { useGlobalData } from '../../Library/Contexts/GlobalContext/globalContext';
import { useServicesContext } from "../../Library/Contexts/ServicesContext/servicesContext";
import { Services } from "../../Library/Contexts/ServicesContext/servicesContext.types";
import { INTENSITIY_LABEL, MOOD_LABEL, SELECTION_EMPTY_VALUE, TIME_OF_DAY_LABEL, TRANSFORM_FILE_TEXT, TRANSFORM_LOADING_INDICATOR } from '../../Library/resources';
import { getTimeOfDay } from '../../Library/Utils/dateUtils';
import { FileDropZone } from '../FileDropZone/fileDropZone';
import { useHomeStyles } from './home.styles';

export const Home = (): JSX.Element => {
    const services: Services = useServicesContext();
    const { moods, timesOfDay } = useGlobalData();

    const styles = useHomeStyles();
    const [selectedMood, setSelectedMood] = React.useState<string>("");
    const [selectedTimeOfDay, setSelectedTimeOfDay] = React.useState<string>(getTimeOfDay(new Date()));
    const [intensity, setIntensity] = React.useState<number>(1);

    const transformSongMutation: UseMutationResult<Blob, unknown, FormData> = useMutation({
        ...services.MusicService.TransformSong(),
        onSuccess: (data: Blob) => {
            saveAs(data, 'transformedSong.mp3');
        }
    });

    const transformSongWithContextMutation: UseMutationResult<Blob, unknown, FormData> = useMutation({
        ...services.MusicService.TransformSongWithContext(),
        onSuccess: (data: Blob) => {
            saveAs(data, 'transformedSongWithContext.mp3');
        }
    });

    const onUpload = (file: File): void => {
        if (!file) {
            return;
        }
        if (selectedMood === "" || selectedTimeOfDay === "") {
            const formData: FormData = new FormData();
            formData.append('file', file);
            transformSongMutation.mutate(formData);
            return;
        }

        const formData: FormData = new FormData();
        formData.append('file', file);
        formData.append('mood', selectedMood);
        formData.append('timeOfDay', selectedTimeOfDay);
        formData.append('intensity', intensity.toString());
        transformSongWithContextMutation.mutate(formData);
    };

    const handleMoodChange = (event: SelectChangeEvent<typeof selectedMood>): void => {
        setSelectedMood(event.target.value);
    };

    const handleTimeOfDayChange = (event: SelectChangeEvent<typeof selectedTimeOfDay>): void => {
        setSelectedTimeOfDay(event.target.value);
    };

    const handleChangeIntensity = (_: Event, newValue: number | number[]): void => {
        setIntensity(newValue as number);
    };

    const isContextEnabled: boolean = selectedMood !== "" && selectedTimeOfDay !== "";

    return (
        <div className={styles.homeContainer}>
            <FormControl variant="standard" className={styles.selectStyles}>
                <InputLabel id="mood-select-label">{MOOD_LABEL}</InputLabel>
                <Select
                    id="mood-select"
                    labelId='mood-select-label'
                    label={MOOD_LABEL}
                    value={selectedMood}
                    onChange={handleMoodChange}
                >
                    <MenuItem value="">
                        <em>{SELECTION_EMPTY_VALUE}</em>
                    </MenuItem>
                    {moods.map((mood: string): JSX.Element => (
                        <MenuItem key={mood} value={mood}>
                            {mood}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl variant="standard" className={styles.selectStyles}>
                <InputLabel id="tod-select-label">{TIME_OF_DAY_LABEL}</InputLabel>
                <Select
                    id="tod-select"
                    labelId="tod-select-label"
                    label={TIME_OF_DAY_LABEL}
                    value={selectedTimeOfDay}
                    onChange={handleTimeOfDayChange}
                >
                    <MenuItem value="">
                        <em>{SELECTION_EMPTY_VALUE}</em>
                    </MenuItem>
                    {timesOfDay.map((tod: string): JSX.Element => (
                        <MenuItem key={tod} value={tod}>
                            {tod}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Box className={styles.selectStyles}>
                <Typography gutterBottom color='text.secondary'>
                    {INTENSITIY_LABEL}
                </Typography>
                <Slider
                    size="medium"
                    min={INTENISITY_MIN}
                    max={INTENISITY_MAX}
                    step={0.1}
                    value={intensity}
                    onChange={handleChangeIntensity}
                    valueLabelDisplay='auto'
                    aria-label='Controlled slider'
                />
            </Box>
            <FileDropZone
                onUpload={onUpload}
                isLoading={transformSongMutation.isPending}
                buttonText={TRANSFORM_FILE_TEXT}
                loadingIndicator={TRANSFORM_LOADING_INDICATOR}
            />
            {!isContextEnabled &&
                <Alert severity="info">
                    <strong>Note:</strong> Context is not enabled. Please select a mood and time of day to use context.
                </Alert>
            }
            {intensity > 3 &&
                <Alert severity="warning">
                    <strong>Warning:</strong> High intensity may cause distortion.
                </Alert>}
        </div>
    );
};