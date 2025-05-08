import { UseMutationOptions } from "@tanstack/react-query";
import { BaseService } from "./baseService";

export class MusicService extends BaseService {
    constructor() {
        super("api/Music");
    }

    public TransformSong = (): UseMutationOptions<Blob, unknown, FormData> => {
        return this.CreateFilePostQuery<Blob, FormData>("TransformSong");
    }

    public TransformSongWithContext = (): UseMutationOptions<Blob, unknown, FormData> => {
        return this.CreateFilePostQuery<Blob, FormData>("TransformSongWithContext");
    }
};