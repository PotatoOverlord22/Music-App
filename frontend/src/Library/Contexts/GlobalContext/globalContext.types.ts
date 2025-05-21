import { UserStats } from "../../../models/UserStats";

export type GlobalData = {
    userStats: UserStats;
    setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
    // moods: string[];
    // timesOfDay: string[];
};