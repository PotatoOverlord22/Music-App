import { MusicService } from "../musicService";

export interface IServices {
    MusicService: MusicService
};

export interface IServicesProviderProps {
    children: JSX.Element;
};