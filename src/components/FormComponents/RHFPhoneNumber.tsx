import { TextField } from "@mui/material";
import { useController, useFormContext } from "react-hook-form";
import { PatternFormat } from 'react-number-format';

interface Props {
    name: string,
    required?: boolean
    label?: string
}

export default function RHFPhoneNumber({ name, required, label }: Props) {

    const { control } = useFormContext();
    const {
        field: { onChange, value, ref },
        // formState: { touchedFields, dirtyFields }
    } = useController({
        name,
        control,
        rules: { required: required },
        defaultValue: "",
    });

    return (
        <PatternFormat 
            format="(###) ###-####" 
            onValueChange={(value) => onChange(value.value)} // send value to hook form 
            value={value} // input value
            name={name} // send down the input name
            getInputRef={ref} // send input ref, so we can focus on input when error appear
            label={label}
            customInput={TextField}
            valueIsNumericString
            allowEmptyFormatting
            displayType="input"
            type="tel"

        />
    );
}