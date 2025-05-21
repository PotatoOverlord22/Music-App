import { Avatar } from "@mui/material";
import { JSX } from "react";
import { NameAvatarProps } from "./nameAvatar.types";

const defaultSize: number = 40;

export const NameAvatar = (props: NameAvatarProps): JSX.Element => {
    const stringToColor = (string: string): string => {
        let hash: number = 0;
        let i: number;

        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color: string = '#';
        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }

        return color;
    };

    const stringAvatar = (str: string) => {
        const initials: string = str.split(' ').map((n) => n[0]).join('');

        return {
            sx: {
                bgcolor: props.color ?? stringToColor(str),
                width: props.size ?? defaultSize,
                height: props.size ?? defaultSize,
            },
            children: initials.toUpperCase(),
        };
    };

    return (
        <Avatar {...stringAvatar(props.name)} />
    );
};