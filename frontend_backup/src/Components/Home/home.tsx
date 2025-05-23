import { Alert, Slider, Typography } from '@mui/material';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { saveAs } from 'file-saver';
import React, { JSX } from 'react';
import { useGlobalData } from '../../Library/Contexts/GlobalContext/globalContext';
import { useServices } from '../../Library/Contexts/ServicesContext/servicesContext';
import { Services } from '../../Library/Contexts/ServicesContext/servicesContext.types';
import { INTENSITIY_LABEL, MOOD_LABEL, TIME_OF_DAY_LABEL, TRANSFORM_FILE_TEXT, TRANSFORM_LOADING_INDICATOR, TRANSFORM_MUSIC_TEXT } from '../../Library/resources';
import { getTimeOfDay } from '../../Library/Utils/dateUtils';
import { FileDropZone } from '../FileDropZone/fileDropZone';
import { SingleChoiceDropdown } from '../SingleChoiceDropdown/singleChoiceDropdown';
import { HomeContainer, StyledBox } from './home.styles';

const intensityStep: number = 0.1;
const intensityWarningThreshold: number = 5;
const minIntensity: number = 1;
const maxIntensity: number = 20;

export const Home = (): JSX.Element => {
    const services: Services = useServices();
    const { moods, timesOfDay } = useGlobalData();

    const [mood, setMood] = React.useState<string>("");
    const [timeOfDay, setTimeOfDay] = React.useState<string>(getTimeOfDay(new Date()));
    const [intensity, setIntensity] = React.useState<number>(5);

    const transformSongMutation: UseMutationResult<Blob, unknown, FormData> = useMutation({
        ...services.MusicService.TransformSong()
    });

    const transformSongWithContextMutation: UseMutationResult<Blob, unknown, FormData> = useMutation({
        ...services.MusicService.TransformSongWithContext()
    });

    const onUpload = (file: File): void => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        if (mood === '' || timeOfDay === '') {
            transformSongMutation.mutate(formData);
        } else {
            formData.append('mood', mood);
            formData.append('timeOfDay', timeOfDay);
            formData.append('intensity', intensity.toString());
            transformSongWithContextMutation.mutate(formData);
        }
    };

    const handleMoodChange = (newValue: string): void => {
        setMood(newValue);
    };

    const handleTimeOfDayChange = (newValue: string): void => {
        setTimeOfDay(newValue);
    };

    const handleChangeIntensity = (_: Event, newValue: number | number[]): void => {
        setIntensity(newValue as number);
    };

    const isContextEnabled: boolean = mood !== "" && timeOfDay !== "";

    return (
        <HomeContainer>
            <Typography variant="h4" gutterBottom color='text.secondary'>
                {TRANSFORM_MUSIC_TEXT}
            </Typography>

            <FileDropZone
                onUpload={onUpload}
                isLoading={
                    transformSongMutation.isPending ||
                    transformSongWithContextMutation.isPending
                }
                buttonText={TRANSFORM_FILE_TEXT}
                loadingIndicator={TRANSFORM_LOADING_INDICATOR}
            />

            <SingleChoiceDropdown
                label={MOOD_LABEL}
                values={moods}
                onValueChange={handleMoodChange}
            />

            <SingleChoiceDropdown
                label={TIME_OF_DAY_LABEL}
                values={timesOfDay}
                onValueChange={handleTimeOfDayChange}
                defaultValue={timeOfDay}
            />

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
