export type GlobalData = {
    moods: string[];
    timesOfDay: string[];
};

export type GlobalContextProps = {
    globalData: GlobalData;
} & React.PropsWithChildren;