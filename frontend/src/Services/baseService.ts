import { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { HttpVerbs } from "../library/Enums/HttpVerbs";
import { BACKEND_URL } from "../library/constants";

export class BaseService {
    private readonly serverUrl: string = BACKEND_URL;
    private readonly serviceUrl: string;

    constructor(serviceUrl: string) {
        this.serviceUrl = serviceUrl;
    }

    protected CreateGetQuery = <T, E = AxiosError<string, unknown>>(methodUrl: string): UseQueryOptions<T, E> => {
        const url: string = `${this.serverUrl}/${this.serviceUrl}/${methodUrl}`;

        return {
            queryKey: [this.createHashKey(url)],
            queryFn: (): Promise<T> => this.ExecuteRequest<T>(url, HttpVerbs.GET)
        };
    }

    protected CreatePostQuery = <T, U>(methodUrl: string): UseMutationOptions<T, unknown, U> => {
        return this.CreateMutationQuery<T, U>(methodUrl, HttpVerbs.POST);
    }

    protected CreateFilePostQuery = <T, U>(methodUrl: string): UseMutationOptions<T, unknown, U> => {
        return this.CreateMutationQuery<T, U>(methodUrl, HttpVerbs.POST, true);
    }

    protected CreatePutQuery = <T, U>(methodUrl: string): UseMutationOptions<T, unknown, U> => {
        return this.CreateMutationQuery<T, U>(methodUrl, HttpVerbs.PUT);
    }

    protected CreateDeleteQuery = <T, U>(methodUrl: string): UseMutationOptions<T, unknown, U> => {
        const deleteEndpoint: string = methodUrl === "" ? methodUrl : `/${methodUrl}`;
        const url: string = `${this.serverUrl}/${this.serviceUrl}${deleteEndpoint}`;

        return {
            mutationFn: (data: U) => {
                return this.ExecuteRequest<T>(`${url}/${data}`, HttpVerbs.DELETE, data);
            }
        };
    }

    protected CreateBulkDeleteQuery = <T, U>(methodUrl: string): UseMutationOptions<T, unknown, U> => {
        return this.CreateMutationQuery<T, U>(methodUrl, HttpVerbs.POST);
    }

    protected CreateBulkUpdateQuery = <T, U>(methodUrl: string): UseMutationOptions<T, unknown, U> => {
        return this.CreateMutationQuery<T, U>(methodUrl, HttpVerbs.POST);
    }

    private readonly CreateMutationQuery = <T, U>(methodUrl: string, verb: HttpVerbs, isFile?: boolean): UseMutationOptions<T, unknown, U> => {
        const url: string = `${this.serverUrl}/${this.serviceUrl}/${methodUrl}`;

        return {
            mutationFn: (data: U) => {
                return this.ExecuteRequest(url, verb, data, isFile);
            }
        };
    }

    private readonly createHashKey = (url: string, data?: unknown): string => {
        const dataString: string = data ? JSON.stringify(data) : '';
        const combinedString: string = `${url}:${dataString}`;
        const hash: number = this.hashStringToNumber(combinedString);

        return hash.toString();
    }

    private readonly hashStringToNumber = (str: string): number => {
        let hash: number = 5381;
        for (let i = 0; i < str.length; i++) {
            hash = (hash * 33) ^ str.charCodeAt(i);
        }

        return hash >>> 0;
    }

    private readonly ExecuteRequest = async <T>(url: string, httpVerb: HttpVerbs, data?: unknown, isFile?: boolean): Promise<T> => {
        const config: AxiosRequestConfig = {
            url: url,
            method: httpVerb,
            data: data,
            withCredentials: true,
            headers: {
                "Content-Type": isFile ? "multipart/form-data" : "application/json"
            },
            responseType: isFile ? "blob" : "json"
        };

        return new Promise<T>((resolve, reject) => {
            axios.request<T>(config)
                .then((response: AxiosResponse<T, unknown>) => {
                    return resolve(response?.data);
                })
                .catch((error: AxiosError) => {
                    return reject(error);
                });
        });
    }
};