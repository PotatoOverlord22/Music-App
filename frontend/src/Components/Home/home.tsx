import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { saveAs } from 'file-saver';
import { JSX } from "react";
import { TRANSFORM_FILE_TEXT, TRANSFORM_LOADING_INDICATOR } from '../../Library/resources';
import { useServicesContext } from "../../Services/ServicesContext/servicesContext";
import { IServices } from "../../Services/ServicesContext/servicesContext.types";
import { FileDropZone } from '../FileDropZone/fileDropZone';
import { PageContent } from '../PageContent/pageContent';
import { useHomeStyles } from './home.styles';

export const Home = (): JSX.Element => {
    const services: IServices = useServicesContext();
    const transformSongMutation: UseMutationResult<Blob, unknown, FormData> = useMutation({
        ...services.MusicService.TransformSong(),
        onSuccess: (data: Blob) => {
            saveAs(data, 'transformedSong.mp3');
        }
    });

    const styles = useHomeStyles();

    const onUpload = (file: File): void => {
        const formData: FormData = new FormData();
        formData.append('file', file);
        transformSongMutation.mutate(formData);
    };

    return (
        <PageContent>
            <div className={styles.fileDropZoneContainerStyles}>
                <FileDropZone
                    onUpload={onUpload}
                    isLoading={transformSongMutation.isPending}
                    buttonText={TRANSFORM_FILE_TEXT}
                    loadingIndicator={TRANSFORM_LOADING_INDICATOR}
                />
            </div>
        </PageContent>
    );
};