import { EQPreset } from "../../models/EQPreset";
import { Genre } from "../../models/Genre";

export type PresetCardProps = {
    preset: EQPreset;
    isSelected: boolean;
    onSelect: (genre: Genre) => void;
    onBandChange: (bandIndex: number, gain: number) => void;
}