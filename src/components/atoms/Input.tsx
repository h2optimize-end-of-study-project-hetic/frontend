import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

type TextFieldsProps = {
  label: string;
};
export default function BasicTextFields({ label }: TextFieldsProps) {
  return (
    <Box component="form" noValidate autoComplete="off">
      <TextField
        id="outlined-basic"
        label={label}
        variant="outlined"
        size="small"
        sx={{
          my: 1,
          width: "38ch",
          "& .MuiInputBase-input": {
            color: "#1A3C7E", // texte saisi
          },
          "& .MuiInputLabel-root": {
            color: "#1A3C7E", // label
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1A3C7E", // bordure
          },
        }}
      />
    </Box>
  );
}
