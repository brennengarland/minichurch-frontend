import { TextField } from "@mui/material";
import { useController, useFormContext } from "react-hook-form";

interface Props {
    name: string,
    required?: boolean
    label?: string
}

export default function RHFEmail({ name, required, label }: Props) {

    const { control } = useFormContext();
    const {
        field: { onChange, onBlur, value, ref },
        // formState: { touchedFields, dirtyFields }
    } = useController({
        name,
        control,
        rules: { required: required },
        defaultValue: "",
    });
    return (
        <TextField
            onChange={onChange} // send value to hook form 
            onBlur={onBlur} // notify when input is touched/blur
            value={value} // input value
            name={name} // send down the input name
            inputRef={ref} // send input ref, so we can focus on input when error appear
            label={label}
            type="email"
        />
    );
}