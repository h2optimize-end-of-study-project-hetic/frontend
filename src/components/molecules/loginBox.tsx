import { Box, Stack, Typography } from "@mui/material";
import BasicTextFields from "../atoms/Input";
import BasicButtons from "../atoms/BasicButtons";
import LoginActions from "../atoms/Link";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput} from "../../schemas/login";
 import { useAuth } from "../../hooks/useAuth";
import { useForm } from "react-hook-form";

export default function LoginBox() {
  const { login } = useAuth();
  const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<LoginInput>({
  resolver: zodResolver(loginSchema),
});

const onSubmit = async (data: LoginInput) => {
  await login(data.email, data.password);
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
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <BasicTextFields
            label="Mot de passe"
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <LoginActions label="Mot de passe oublié ?" />
          <BasicButtons label="Se connecter" type="submit" />

          <Stack paddingTop={4}>
            <LoginActions label="Nouveau à H₂Optimize ? Rejoignez-nous" />
          </Stack>
        </Stack>
      </form>
    </Box>
  );
}