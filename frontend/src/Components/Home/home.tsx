import { Alert, InputLabel, MenuItem, Select, SelectChangeEvent, Slider, Typography } from '@mui/material';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { saveAs } from 'file-saver';
import React, { JSX } from 'react';
import { useGlobalData } from '../../Library/Contexts/GlobalContext/globalContext';
import { useServicesContext } from '../../Library/Contexts/ServicesContext/servicesContext';
import { Services } from '../../Library/Contexts/ServicesContext/servicesContext.types';
import { INTENSITIY_LABEL, MOOD_LABEL, SELECTION_EMPTY_VALUE, TIME_OF_DAY_LABEL, TRANSFORM_FILE_TEXT, TRANSFORM_LOADING_INDICATOR } from '../../Library/resources';
import { getTimeOfDay } from '../../Library/Utils/dateUtils';
import { FileDropZone } from '../FileDropZone/fileDropZone';
import { HomeContainer, StyledBox, StyledFormControl } from './home.styles';

const intensityStep: number = 0.1;
const intensityWarningThreshold: number = 5;
const minIntensity: number = 0;
const maxIntensity: number = 10;

export const Home = (): JSX.Element => {
    const services: Services = useServicesContext();
    const { moods, timesOfDay } = useGlobalData();

    const [selectedMood, setSelectedMood] = React.useState<string>("");
    const [selectedTimeOfDay, setSelectedTimeOfDay] = React.useState<string>(getTimeOfDay(new Date()));
    const [intensity, setIntensity] = React.useState<number>(50);

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
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        if (selectedMood === '' || selectedTimeOfDay === '') {
            transformSongMutation.mutate(formData);
        } else {
            formData.append('mood', selectedMood);
            formData.append('timeOfDay', selectedTimeOfDay);
            formData.append('intensity', intensity.toString());
            transformSongWithContextMutation.mutate(formData);
        }
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
        <HomeContainer>
            <StyledFormControl variant="standard">
                <InputLabel id="mood-select-label">{MOOD_LABEL}</InputLabel>
                <Select
                    id="mood-select"
                    labelId="mood-select-label"
                    label={MOOD_LABEL}
                    value={selectedMood}
                    onChange={handleMoodChange}
                >
                    <MenuItem value="">
                        <em>{SELECTION_EMPTY_VALUE}</em>
                    </MenuItem>
                    {moods.map((mood) => (
                        <MenuItem key={mood} value={mood}>
                            {mood}
                        </MenuItem>
                    ))}
                </Select>
            </StyledFormControl>

            <StyledFormControl variant="standard">
                <InputLabel id="tod-select-label">
                    {TIME_OF_DAY_LABEL}
                </InputLabel>
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
                    {timesOfDay.map((tod) => (
                        <MenuItem key={tod} value={tod}>
                            {tod}
                        </MenuItem>
                    ))}
                </Select>
            </StyledFormControl>

            <StyledBox>
                <Typography gutterBottom color="text.secondary">
                    {INTENSITIY_LABEL}
                </Typography>
                <Slider
                    size="medium"
                    min={minIntensity}
                    max={maxIntensity}
                    step={intensityStep}
                    value={intensity}
                    onChange={handleChangeIntensity}
                    valueLabelDisplay="auto"
                    aria-label="Controlled slider"
                />
            </StyledBox>

            <FileDropZone
                onUpload={onUpload}
                isLoading={
                    transformSongMutation.isPending ||
                    transformSongWithContextMutation.isPending
                }
                buttonText={TRANSFORM_FILE_TEXT}
                loadingIndicator={TRANSFORM_LOADING_INDICATOR}
            />

            {!isContextEnabled && (
                <Alert severity="info" sx={{ width: '100%' }}>
                    <strong>Note:</strong> Context is not enabled. Please select a
                    mood and time of day to use context.
                </Alert>
            )}

            {intensity > intensityWarningThreshold && (
                <Alert severity="warning">
                    <strong>Warning:</strong> High intensity may cause distortion.
                </Alert>
            )}
        </HomeContainer>
    );
};
