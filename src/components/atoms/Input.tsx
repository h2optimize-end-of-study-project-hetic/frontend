import Box from "@mui/material/Box";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { type ForwardedRef, forwardRef } from "react";

type Props = TextFieldProps & {
  label: string;
};

const BasicTextFields = forwardRef(function BasicTextFields(
  { label, ...props }: Props,
  ref: ForwardedRef<HTMLInputElement>
) {
  return (
    <Box component="div">
      <TextField
        label={label}
        variant="outlined"
        size="small"
        fullWidth
        inputRef={ref}
        sx={{
          my: 1,
          width: "38ch",
          "& .MuiInputBase-input": { color: "#1A3C7E" },
          "& .MuiInputLabel-root": { color: "#1A3C7E" },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1A3C7E" },
        }}
        {...props}
      />
    </Box>
  );
});

export default BasicTextFields;
