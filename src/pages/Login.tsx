import { Stack } from "@mui/material";
import LoginBox from "../components/molecules/loginBox";
import Logo from "../components/atoms/Logo";

export default function LoginPage() {
  return (
    <>
      <Stack
        style={{
          textAlign: "left",
        }}
        sx={{ minHeight: "110vh", backgroundColor: "#d7edf8" }}
        p={2}
      >
        {" "}
        <Logo />
        <Stack alignItems="center" justifyContent="center" pt={18}>
          <LoginBox />
        </Stack>
      </Stack>
    </>
  );
}
