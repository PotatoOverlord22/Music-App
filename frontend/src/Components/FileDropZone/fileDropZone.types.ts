export type FileDropZoneProps = {
    onUpload: (file: File) => void;
    isButtonDisabled?: boolean;
    isOpen?: boolean;
};