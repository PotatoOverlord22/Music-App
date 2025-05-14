import axios, { AxiosHeaders } from "axios";

export const setupInterceptors = (getToken: () => Promise<string>) => {
    axios.interceptors.request.use(async (config) => {
        const token = await getToken();

        const headers = new AxiosHeaders(config.headers);
        headers.set('Authorization', `Bearer ${token}`);

        config.headers = headers;
        return config;
    });
};