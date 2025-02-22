export type FileDropZoneProps = {
    onUpload: (file: File) => void;
    isOpen?: boolean;
};