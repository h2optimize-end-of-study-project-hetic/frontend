import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import type { ButtonProps as MUIButtonProps } from "@mui/material/Button";

type Props = MUIButtonProps & {
  label?: string;
  children?: React.ReactNode;
};

export default function BasicButtons({
  label,
  children,
  ...rest
}: Props) {
  return (
    <Stack spacing={2} direction="row" justifyContent="center">
      <Button
        {...rest}
        sx={{
          fontFamily: "inherit",
          borderRadius: "12px",
          backgroundColor: "var(--light-blue)",
          color: "var(--dark-blue)",
          textTransform: "none",
          ...(rest.sx || {}),
        }}
      >
        {label ?? children}
      </Button>
    </Stack>
  );
}
