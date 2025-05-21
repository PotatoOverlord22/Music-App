import { QueryKey, useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { AxiosError } from "axios";

export type UseQueryWithKeyResult<TData, E = AxiosError<string, unknown>> = UseQueryResult<TData, E> & {
    queryKey: QueryKey;
};

export const useFetchQuery = <T, E = AxiosError<string, unknown>>(options: UseQueryOptions<T, E>): UseQueryWithKeyResult<T, E> => {
    const queryResult: UseQueryResult<T, E> = useQuery<T, E>({...options, retry: false });
    const key: QueryKey = options.queryKey;
    
    return {
        ...queryResult,
        queryKey: key
    };
};