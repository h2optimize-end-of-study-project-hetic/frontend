import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Stack, Typography } from "@mui/material";

import BasicButtons from "../atoms/Button";
import BasicTextFields from "../atoms/Input";
import { useAuth } from "../../hooks/useAuth";
import { useSnackbar } from "../../context/SnackbarContext";
import LoginSignUpActions from "../atoms/LoginSignUpActions";
import { loginSchema, type LoginInput} from "../../schemas/login";

export default function LoginBox() {
  const { showMessage } = useSnackbar()
  const navigate = useNavigate();
  const { login, error } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    await login(data.username, data.password);
    if (error && error === 'Erreur de connexion') {
      showMessage(error, 'error')
      return
    }
    showMessage('Connecté', 'success')
    navigate('/dashboard')
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
            autoComplete="username" 
       />

          <BasicTextFields
            label="Mot de passe"
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            autoComplete="current-password"
          />

          <BasicButtons label="Se connecter" type="submit" />

          <Stack paddingTop={4}>
            <LoginSignUpActions mode={"login"} />
          </Stack>
        </Stack>
      </form>
    </Box>
  );
}
