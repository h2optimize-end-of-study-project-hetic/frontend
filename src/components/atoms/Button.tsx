import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

type ButtonProps = {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit"; 
};

export default function BasicButtons({ label, onClick, type = "button"}: ButtonProps) {
  return (
    <Stack spacing={2} direction="row">
      <Button
        type={type}
        onClick={onClick}
        sx={{
          backgroundColor: "#CDE6F2",
          color: "#1A3C7E",
          "&:hover": {
            backgroundColor: "#1A3C7E",
            color: "#CDE6F2",
          },
        }}
        variant="contained"
      >
        {label}
      </Button>
    </Stack>
  );
}
