import { Genre } from "../models/Genre";

export const UNDEFINED_CONTEXT_ERROR_MESSAGE: string = "Context is undefined.";
export const BACKEND_URL: string = import.meta.env.VITE_API_URL ?? "https://localhost:7018";
export const GENERAL_DATA_CONTROLLER: string = "GeneralData";

export const DEFAULT_PRESETS: Record<Genre, number[]> = {
    'blues': [-1, 0, 2, 2, 1, 0, -1, 0, 1, 1],
    'classical': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'country': [0, 1, 1, 2, 1, 0, 0, 0, 0, 0],
    'disco': [2, 3, 2, 1, 0, 0, 1, 2, 3, 2],
    'hiphop': [3, 4, 2, 0, -1, -1, 0, 1, 1, 0],
    'jazz': [0, 1, 1, 2, 2, 1, 0, 0, 1, 0],
    'metal': [2, 3, 0, -3, -4, -3, 0, 3, 3, 2],
    'pop': [0, 1, 2, 2, 1, 0, 1, 1, 2, 2],
    'reggae': [0, 1, 0, 0, -1, -1, 0, 0, 1, 0],
    'rock': [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
};

export const FREQUENCY_BANDS_LABELS = ['20Hz', '44Hz', '94Hz', '207Hz', '450Hz', '980Hz', '2.1khz', '4.6kHz', '10kHz', '22.05kHz'];