import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { JSX } from "react";
import { useServicesContext } from "../../Services/ServicesContext/servicesContext";
import { IServices } from "../../Services/ServicesContext/servicesContext.types";
import { FileDropZone } from '../FileDropZone/fileDropZone';

export const Home = (): JSX.Element => {
    const services: IServices = useServicesContext();
    const transformSongMutation: UseMutationResult<Blob, unknown, FormData> = useMutation(services.MusicService.TransformSong());

    const onUpload = (file: File): void => {
        const formData: FormData = new FormData();
        formData.append('file', file);
        transformSongMutation.mutate(formData);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', justifyContent: 'center' }}>
            <FileDropZone onUpload={onUpload} />
        </div>
    );
};