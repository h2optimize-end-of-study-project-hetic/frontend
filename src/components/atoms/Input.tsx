import Box from "@mui/material/Box";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { type ForwardedRef, forwardRef, useState } from "react";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type Props = TextFieldProps & {
  label: string;
};

const BasicTextFields = forwardRef(function BasicTextFields(
  { label, type, ...props }: Props,
  ref: ForwardedRef<HTMLInputElement>
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <Box component="div">
      <TextField
        label={label}
        variant="outlined"
        size="small"
        fullWidth
        type={isPassword && showPassword ? "text" : type}
        inputRef={ref}
        sx={{
          my: 1,
          width: "38ch",
          "& .MuiInputBase-input": { color: "#1A3C7E" },
          "& .MuiInputLabel-root": { color: "#1A3C7E" },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1A3C7E" },
        }}
        {...(isPassword
          ? {
              InputProps: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {!showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }
          : {})}
        {...props}
      />
    </Box>
  );
});

export default BasicTextFields;
