import Logo from "../atoms/Logo";
import { Box } from "@mui/material";

export default function MainLayout() {
  return (
    <Box sx={{ p: 2, textAlign: "center", minHeight: "100vh", backgroundColor: "#f0f8ff" }}>
      <Logo />
    </Box>
  );
}
