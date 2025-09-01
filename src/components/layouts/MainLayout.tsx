import { Outlet } from "react-router";
import { Box } from "@mui/material";
import Header from "../molecules/header";

export default function MainLayout() {
  return (
    <>
      <Box>
        <Header />
        <Box p={2}>
          <Outlet />
        </Box>
      </Box>
    </>
  );
}
