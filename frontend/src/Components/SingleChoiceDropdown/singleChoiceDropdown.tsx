import { InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React, { JSX } from "react";
import { SELECTION_EMPTY_VALUE } from "../../Library/resources";
import { StyledFormControl } from "./singleChoiceDropdown.styles";
import { SingleChoiceDropdownProps } from "./singleChoiceDropdown.types";

export const SingleChoiceDropdown = (props: SingleChoiceDropdownProps): JSX.Element => {
    const [selectedValue, setSelectedValue] = React.useState<string>(props.defaultValue ?? "");

    const handleValueChange = (event: SelectChangeEvent<typeof selectedValue>): void => {
        setSelectedValue(event.target.value);
        props.onValueChange(event.target.value);
    };

    return (
        <StyledFormControl variant="standard">
            <InputLabel id={`${props.label}-select-label`}>{props.label}</InputLabel>
            <Select
                id={`${props.label}-select`}
                labelId={`${props.label}-select-label`}
                label={props.label}
                value={selectedValue}
                onChange={handleValueChange}
            >
                <MenuItem value="">
                    <em>{SELECTION_EMPTY_VALUE}</em>
                </MenuItem>
                {props.values.map((value) => (
                    <MenuItem key={value} value={value}>
                        {value}
                    </MenuItem>
                ))}
            </Select>
        </StyledFormControl>
    )
};