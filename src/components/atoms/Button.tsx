import * as React from "react";
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
          backgroundColor: "primary.main",
          color: "white",
          "&:hover": {
            backgroundColor: "primary.dark",
          },
        }}
        variant="contained"
      >
        {label}
      </Button>
    </Stack>
  );
}
