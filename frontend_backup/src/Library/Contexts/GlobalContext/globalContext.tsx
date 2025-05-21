import React, { JSX } from "react";
import { UNDEFINED_CONTEXT_ERROR_MESSAGE } from "../../constants";
import { GlobalContextProps, GlobalData } from "./globalContext.types";

const GlobalDataContext: React.Context<GlobalData | undefined> = React.createContext<GlobalData | undefined>(undefined);

export const GlobalContextProvider = (props: GlobalContextProps): JSX.Element => {
    return (
        <GlobalDataContext.Provider value={props.globalData}>
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