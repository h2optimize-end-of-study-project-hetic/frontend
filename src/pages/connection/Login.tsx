import { Stack } from "@mui/material";
import LoginBox from "../../components/molecules/loginBox";

export default function LoginPage() {
  return (
    <>
      <Stack alignItems="center" justifyContent="center" padding={14} px={1}>
        <LoginBox />
      </Stack>
    </>
  );
}
