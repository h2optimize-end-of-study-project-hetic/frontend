import { Outlet } from "react-router";
import Logo from "../atoms/Logo";
import { Box } from "@mui/material";

export default function MainLayout() {
  return (
    <>
      <Box>
        <header>
          <Logo />
        </header>
        <Box p={2}>
          <Outlet />
        </Box>
      </Box>
    </>
  );
}
