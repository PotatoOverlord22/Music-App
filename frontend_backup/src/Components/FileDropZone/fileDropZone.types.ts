export type FileDropZoneProps = {
    onUpload: (file: File) => void;
    isButtonDisabled?: boolean;
    isLoading?: boolean;
    isOpen?: boolean;
    buttonText?: string;
    loadingIndicator?: string;
};