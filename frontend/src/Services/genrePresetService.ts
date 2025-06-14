import { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import { BaseService } from "./baseService";
import { EQPreset } from "../models/EQPreset";
import { AxiosError } from "axios";

export class GenrePresetService extends BaseService {
    constructor() {
        super("api/GenrePreset");
    }

    public GetGenrePresets = (): UseQueryOptions<EQPreset[], AxiosError<string, unknown>> => {
        return this.CreateGetQuery<EQPreset[], AxiosError<string, unknown>>("Presets");
    }

    public UpdatePresets = (): UseMutationOptions<undefined, unknown, EQPreset[]> => {
        return this.CreatePostQuery<undefined, EQPreset[]>("UpdatePresets");
    }
};