import { Genre } from "./Genre";

export type EQPreset = {
    id: string;
    genre: Genre;
    name: string;
    bands: number[];
}