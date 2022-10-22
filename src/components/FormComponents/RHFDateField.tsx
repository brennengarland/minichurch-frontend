import { TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ReactNode } from "react";
import { useController, useFormContext } from "react-hook-form";

interface Props {
    name: string,
    required?: boolean,
    label?: string
    children?: ReactNode
}

export default function RHFDateField({ name, required, label, children }: Props) {

    function disableDate (date: any) {
        return date.getDay() !== 3
    }

    const { control } = useFormContext();
    const {
        field: { onChange, value, ref },
    } = useController({
        name,
        control,
        rules: { required: required },
    });

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
                label={label}
                value={value || null}
                onChange={onChange}
                inputRef={ref}
                disablePast
                shouldDisableDate={disableDate}
                renderInput={(params) => <TextField {...params} />}
            />
        </LocalizationProvider>
    );
}