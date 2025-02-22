import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Context, createContext, JSX, useContext } from "react";
import { UNDEFINED_CONTEXT_ERROR_MESSAGE } from "../../Library/constants";
import { MusicService } from "../musicService";
import { IServices, IServicesProviderProps } from "./servicesContext.types";

const queryClient: QueryClient = new QueryClient();
const musicService: MusicService = new MusicService();

const services: IServices = {
    MusicService: musicService,
};

const ServicesContext: Context<IServices | undefined> = createContext<IServices | undefined>(undefined);

export const ServicesProvider = (props: IServicesProviderProps): JSX.Element => {
    return (
        <ServicesContext.Provider value={services}>
            <QueryClientProvider client={queryClient}>
                {props.children}
            </QueryClientProvider>
        </ServicesContext.Provider>
    );
};

export const useServicesContext = (): IServices => {
    const context: IServices | undefined = useContext(ServicesContext);
    if (context === undefined) {
        throw new Error(UNDEFINED_CONTEXT_ERROR_MESSAGE);
    }

    return context;
};