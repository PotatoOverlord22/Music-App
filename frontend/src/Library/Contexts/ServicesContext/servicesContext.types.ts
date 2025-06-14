import { DataService } from "../../../services/dataService";
import { GenrePresetService } from "../../../services/genrePresetService";
import { MusicService } from "../../../services/musicService";
import { UserService } from "../../../services/userService";

export type Services = {
    MusicService: MusicService
    UserService: UserService
    DataService: DataService
    GenrePresetService: GenrePresetService
};