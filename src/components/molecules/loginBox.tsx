import { Box, Stack, Typography } from "@mui/material";
import BasicTextFields from "../atoms/Input";
import BasicButtons from "../atoms/Button";
import LoginSignUpActions from "../atoms/LoginSignUpActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput} from "../../schemas/login";
 import { useAuth } from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

export default function LoginBox() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<LoginInput>({
  resolver: zodResolver(loginSchema),
});



const onSubmit = async (data: LoginInput) => {
  await login(data.username, data.password);
};
  
  return (
    <Box
      sx={{
        color: "#1A3C7E",
        backgroundColor: "#fff",
        padding: 5,
        borderRadius: 2,
        width: "100%",
        maxWidth: 400,
        boxShadow: 3,
        textAlign: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Connexion
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} alignItems="center">
          <BasicTextFields
            label="Email"
            {...register("username")}
            error={!!errors.username}
            helperText={errors.username?.message}
          />

          <BasicTextFields
            label="Mot de passe"
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <BasicButtons label="Se connecter" type="submit" onClick={() => navigate("/dashboard")} />

          <Stack paddingTop={4}>
          <LoginSignUpActions mode={"login"}  />
          </Stack>
        </Stack>
      </form>
    </Box>
  );
}