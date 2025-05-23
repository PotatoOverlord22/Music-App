import { UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { BaseService } from "./baseService";

export class DataService extends BaseService {
    constructor() {
        super("api/GeneralData");
    }

    public GetMoods = (): UseQueryOptions<string[], AxiosError<string, unknown>> => {
        return this.CreateGetQuery<string[], AxiosError<string, unknown>>("Moods");
    }

    public GetTimesOfDay = (): UseQueryOptions<string[], AxiosError<string, unknown>> => {
        return this.CreateGetQuery<string[], AxiosError<string, unknown>>("TimesOfDay");
    }
};