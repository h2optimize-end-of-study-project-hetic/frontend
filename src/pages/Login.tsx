import { Stack } from "@mui/material";
import LoginBox from "../components/molecules/loginBox";
// import Logo from "../components/atoms/Logo";

export default function LoginPage() {
  return (
    <>
      <Stack alignItems="center" justifyContent="center" padding={14}>
        <LoginBox />
      </Stack>
    </>
  );
}
