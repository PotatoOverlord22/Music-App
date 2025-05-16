import { UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { UserStats } from "../Models/UserStats";
import { BaseService } from "./baseService";

export class UserService extends BaseService {
    constructor() {
        super("api/User");
    }

    public GetUserStats = (): UseQueryOptions<UserStats, AxiosError<string, unknown>> => {
        return this.CreateGetQuery<UserStats, AxiosError<string, unknown>>("Stats");
    }
};