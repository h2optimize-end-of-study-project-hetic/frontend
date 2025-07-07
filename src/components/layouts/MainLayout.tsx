import { Outlet } from "react-router";
import Logo from "../atoms/Logo";
import { Box } from "@mui/material";

export default function MainLayout() {
  return (
    <>
    <Box sx={{backgroundColor: "#CDE6F2", minHeight: '110vh'}}>
      <Box sx={{ p: 2, textAlign: "left" }}>
        <Logo />
      </Box>
      <Box>
        <Outlet />
      </Box>
      </Box>
    </>
  );
}
