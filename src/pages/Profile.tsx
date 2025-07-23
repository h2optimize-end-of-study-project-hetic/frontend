import { Stack } from "@mui/material";
import ProfileBox from "../components/molecules/profileBox";

export default function Profile() {
  return (
    <>
      <Stack alignItems="center" justifyContent="center" padding={14}>
        <ProfileBox/>
      </Stack>
    </>
  );
}