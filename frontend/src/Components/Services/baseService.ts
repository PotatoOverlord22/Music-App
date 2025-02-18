import { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { HttpVerbs } from "../../Library/Enums/HttpVerbs";

export class BaseService {
    private readonly _localhost: string = "https://localhost:7018";
    private readonly _serviceUrl: string;

    constructor(serviceUrl: string) {
        this._serviceUrl = serviceUrl;
    };

    protected CreateGetQuery = <T, E = AxiosError<string, any>>(methodUrl: string): UseQueryOptions<T, E> => {
        const url: string = `${this._localhost}/${this._serviceUrl}/${methodUrl}`;

        return {
            queryKey: [this.createHashKey(url)],
            queryFn: (): Promise<T> => this.ExecuteRequest<T>(url, HttpVerbs.GET)
        };
    };

    protected CreatePostQuery = <T, U>(methodUrl: string): UseMutationOptions<T, unknown, U> => {
        return this.CreateMutationQuery<T, U>(methodUrl, HttpVerbs.POST);
    };

    protected CreateFilePostQuery = <T, U>(methodUrl: string): UseMutationOptions<T, unknown, U> => {
        return this.CreateMutationQuery<T, U>(methodUrl, HttpVerbs.POST, true);
    }

    protected CreatePutQuery = <T, U>(methodUrl: string): UseMutationOptions<T, unknown, U> => {
        return this.CreateMutationQuery<T, U>(methodUrl, HttpVerbs.PUT);
    };

    protected CreateDeleteQuery = <T, U>(methodUrl: string): UseMutationOptions<T, unknown, U> => {
        const deleteEndpoint: string = methodUrl === "" ? methodUrl : `/${methodUrl}`;
        const url: string = `${this._localhost}/${this._serviceUrl}${deleteEndpoint}`;

        return {
            mutationFn: (data: U) => {
                return this.ExecuteRequest<T>(`${url}/${data}`, HttpVerbs.DELETE, data);
            }
        };
    };

    protected CreateBulkDeleteQuery = <T, U>(methodUrl: string): UseMutationOptions<T, unknown, U> => {
        return this.CreateMutationQuery<T, U>(methodUrl, HttpVerbs.POST);
    };

    protected CreateBulkUpdateQuery = <T, U>(methodUrl: string): UseMutationOptions<T, unknown, U> => {
        return this.CreateMutationQuery<T, U>(methodUrl, HttpVerbs.POST);
    };

    private readonly CreateMutationQuery = <T, U>(methodUrl: string, verb: HttpVerbs, isFile?: boolean): UseMutationOptions<T, unknown, U> => {
        const url: string = `${this._localhost}/${this._serviceUrl}/${methodUrl}`;

        return {
            mutationFn: (data: U) => {
                return this.ExecuteRequest(url, verb, data, isFile);
            }
        };
    };

    private readonly createHashKey = (url: string, data?: any): string => {
        const dataString: string = data ? JSON.stringify(data) : '';
        const combinedString: string = `${url}:${dataString}`;
        const hash: number = this.hashStringToNumber(combinedString);

        return hash.toString();
    };

    private readonly hashStringToNumber = (str: string): number => {
        let hash: number = 5381;
        for (let i = 0; i < str.length; i++) {
            hash = (hash * 33) ^ str.charCodeAt(i);
        }

        return hash >>> 0;
    };

    private readonly ExecuteRequest = async <T>(url: string, httpVerb: HttpVerbs, data?: any, isFile?: boolean): Promise<T> => {
        const config: AxiosRequestConfig = {
            url: url,
            method: httpVerb,
            data: data,
            withCredentials: true,
            headers: {
                "Content-Type": isFile ? "multipart/form-data" : "application/json"
            },
            responseType: "json"
        };

        return new Promise<T>((resolve, reject) => {
            axios.request<T>(config)
                .then((response: AxiosResponse<T, any>) => {
                    return resolve(response?.data);
                })
                .catch((error: AxiosError) => {
                    return reject(error);
                });
        });
    };
};