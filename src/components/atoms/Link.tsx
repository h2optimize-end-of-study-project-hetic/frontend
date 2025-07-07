import { Box, Link } from "@mui/material";

type linkProps = {
  label: string;
};

export default function LoginActions({ label }: linkProps) {
  return (
    <Box mt={2}>
      <Link href="#" underline="hover" sx={{color: "#1A3C7E"}}>
        {label}
      </Link>
    </Box>
  );
}
