import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

type ButtonProps = {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit";
};

export default function BasicButtons({
  label,
  onClick,
  type = "button",
}: ButtonProps) {
  return (
    <Stack spacing={2} direction="row" justifyContent="center">
      <Button
        type={type}
        onClick={onClick}
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
      >
        {label}
      </Button>
    </Stack>
  );
}
