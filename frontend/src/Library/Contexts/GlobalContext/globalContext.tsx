import React, { JSX } from "react";
import { UNDEFINED_CONTEXT_ERROR_MESSAGE } from "../../constants";
import { GlobalData } from "./globalContext.types";
import { UserStats } from "../../../models/UserStats"; // Assuming this path is correct

const GlobalDataContext: React.Context<GlobalData | undefined> = React.createContext<GlobalData | undefined>(undefined);

const defaultUserStats: UserStats = {
    userId: "",
    transformedWithContext: 0,
    transformedWithoutContext: 0
};

export const GlobalDataProvider = (props: React.PropsWithChildren): JSX.Element => {
    const [userStats, setUserStats] = React.useState<UserStats>(defaultUserStats);

    return (
        <GlobalDataContext.Provider value={{ userStats, setUserStats }}>
            {props.children}
        </GlobalDataContext.Provider>
    );
};

export const useGlobalData = (): GlobalData => {
    const context = React.useContext(GlobalDataContext);
    if (context === undefined) {
        throw new Error(UNDEFINED_CONTEXT_ERROR_MESSAGE);
    }

    return context;
};