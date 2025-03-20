import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { JSX } from "react";
import { useServicesContext } from "../../Services/ServicesContext/servicesContext";
import { IServices } from "../../Services/ServicesContext/servicesContext.types";
import { FileDropZone } from '../FileDropZone/fileDropZone';
import { saveAs } from 'file-saver';
import { fileDropZoneContainerStyles } from './home.styles';

export const Home = (): JSX.Element => {
    const services: IServices = useServicesContext();
    const transformSongMutation: UseMutationResult<Blob, unknown, FormData> = useMutation({
        ...services.MusicService.TransformSong(),
         onSuccess: (data: Blob) => {
            saveAs(data, 'transformedSong.mp3');
         }
    });

    const onUpload = (file: File): void => {
        const formData: FormData = new FormData();
        formData.append('file', file);
        transformSongMutation.mutate(formData);
    };

    return (
        <div style={fileDropZoneContainerStyles}>
            <FileDropZone onUpload={onUpload} isButtonDisabled={transformSongMutation.isPending}/>
        </div>
    );
};