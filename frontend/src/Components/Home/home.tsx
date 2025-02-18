import { Button, Label } from "@fluentui/react-components";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { saveAs } from 'file-saver';
import { useEffect, useRef, useState } from "react";
import { useServicesContext } from "../Services/ServicesContext/servicesContext";
import { IServices } from "../Services/ServicesContext/servicesContext.types";

export const Home = (): JSX.Element => {
    const services: IServices = useServicesContext();
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const transformSongMutation: UseMutationResult<Blob, unknown, FormData> = useMutation(services.MusicService.TransformSong());

    useEffect(() => {
        console.log("song mutation data: ", transformSongMutation.data);
        if (transformSongMutation.data) {
            saveAs(new Blob([transformSongMutation.data]), "transformedSong.mp3");
        }
    }, [transformSongMutation.data]);

    const onUploadFile = (): void => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFile(event.target.files ? event.target.files[0] : null);
    };

    const transformSong = (): void => {
        if (file) {
            const formData: FormData = new FormData();
            formData.append("file", file);
            formData.append("fileName", file.name);
            transformSongMutation.mutate(formData);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', justifyContent: 'center' }}>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="audio/*"
                onChange={handleFileChange}
            >
            </input>
            <Button onClick={onUploadFile} appearance="primary">
                Upload file
            </Button>
            <Label>{file ? file.name : "Choose a file"}</Label>
            <Button onClick={transformSong} appearance="primary" disabled={!file}>
                Transform song
            </Button>
        </div>
    );
};