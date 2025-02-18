import { UseMutationOptions } from "@tanstack/react-query";
import { BaseService } from "./baseService";
import { Song } from "../../Models/Song";

export class MusicService extends BaseService {
    constructor() {
        super("api/Music");
    };

    public TransformSong = (): UseMutationOptions<Blob, unknown, FormData> => {
        return this.CreateFilePostQuery<Blob, FormData>("TransformSong");
    };
};