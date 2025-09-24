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
          width: "100%",
          maxWidth: "38ch",
          minWidth: "28ch",
          "& .MuiInputBase-input": { color: "var(--dark-blue)"},
          "& .MuiInputLabel-root": { color: "var(--dark-blue)"},
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--dark-blue)"},
        }}
        {...(isPassword
          ? {
              InputProps: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
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
