import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Context, createContext, JSX, useContext } from "react";
import { MusicService } from "../../../services/musicService";
import { UserService } from "../../../services/userService";
import { UNDEFINED_CONTEXT_ERROR_MESSAGE } from "../../constants";
import { Services } from "./servicesContext.types";
import { DataService } from "../../../services/dataService";

const queryClient: QueryClient = new QueryClient();
const musicService: MusicService = new MusicService();
const userService: UserService = new UserService();
const dataService: DataService = new DataService();

const services: Services = {
    MusicService: musicService,
    UserService: userService,
    DataService: dataService
};

const ServicesContext: Context<Services | undefined> = createContext<Services | undefined>(undefined);

export const ServicesProvider = (props: React.PropsWithChildren): JSX.Element => {
    return (
        <ServicesContext.Provider value={services}>
            <QueryClientProvider client={queryClient}>
                {props.children}
            </QueryClientProvider>
        </ServicesContext.Provider>
    );
};

export const useServices = (): Services => {
    const context: Services | undefined = useContext(ServicesContext);
    if (context === undefined) {
        throw new Error(UNDEFINED_CONTEXT_ERROR_MESSAGE);
    }

    return context;
};