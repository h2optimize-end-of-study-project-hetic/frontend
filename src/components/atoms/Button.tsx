import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

type ButtonProps = {
  label: string;
};

export default function BasicButtons({ label }: ButtonProps) {
  return (
    <Stack spacing={2} direction="row">
      <Button
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
