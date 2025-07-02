import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

type ButtonProps = {
  label: string;
  onClick?: () => void;
};

export default function BasicButtons({ label, onClick }: ButtonProps) {
  return (
    <Stack spacing={2} direction="row" justifyContent="center">
      <Button
        sx={{
          fontFamily: "inherit",
          borderRadius: "12px",
          backgroundColor: "var(--light-blue)",
          color: "var(--dark-blue)",
          textTransform: "none",
          // "&:hover": {
          //   backgroundColor: "var(--dark-blue)",
          //   color: "var(--white)",
          // },
        }}
        variant="contained"
        onClick={onClick}
      >
        {label}
      </Button>
    </Stack>
  );
}
