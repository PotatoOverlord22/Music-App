import { DataService } from "../../../services/dataService";
import { MusicService } from "../../../services/musicService";
import { UserService } from "../../../services/userService";

export type Services = {
    MusicService: MusicService
    UserService: UserService
    DataService: DataService
};