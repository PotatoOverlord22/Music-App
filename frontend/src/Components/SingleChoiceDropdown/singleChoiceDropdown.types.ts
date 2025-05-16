export type SingleChoiceDropdownProps = {
    label: string;
    values: string[];
    defaultValue?: string;
    onValueChange: (value: string) => void;
}