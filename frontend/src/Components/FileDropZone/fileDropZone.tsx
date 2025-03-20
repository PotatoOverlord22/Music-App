import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SendIcon from '@mui/icons-material/Send';
import { Button, CardContent, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { DRAG_AND_DROP_FILE_TEXT } from "../../Library/resources";
import { CardActionsContainer, CardContentContainer, DropZoneCard, UploadFileText } from "./fileDropZone.styles";
import { FileDropZoneProps } from "./fileDropZone.types";

export const FileDropZone: React.FC<FileDropZoneProps> = (props: FileDropZoneProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]): void => {
        if (acceptedFiles.length > 0) {
            setSelectedFile(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'audio/mpeg': [] }
    });

    const onUploadClick = (): void => {
        if (!selectedFile) {
            return;
        }

        props.onUpload(selectedFile);
    };

    const isButtonDisabled: boolean = !selectedFile || (props.isButtonDisabled ?? false);

    return (
        <DropZoneCard>
            <CardContent>
                <CardContentContainer {...getRootProps()}>
                    <input {...getInputProps()} />
                    <CloudUploadIcon color="primary" fontSize="large" />
                    <UploadFileText variant="body1">
                        {selectedFile ? selectedFile.name : DRAG_AND_DROP_FILE_TEXT}
                    </UploadFileText>
                </CardContentContainer>
            </CardContent>
            <CardActionsContainer>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={isButtonDisabled}
                    startIcon={<SendIcon />}
                    loading={props.isLoading}
                    loadingPosition="start"
                    onClick={onUploadClick}
                >
                    <Typography variant="body1">
                        {props.buttonText ?? ""}
                    </Typography>
                </Button>
            </CardActionsContainer>
        </DropZoneCard>
    );
};