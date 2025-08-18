import { Box, Stack, Typography } from "@mui/material";
import BasicTextFields from "../atoms/Input";
import BasicButtons from "../atoms/Button";
import LoginSignUpActions from "../atoms/LoginSignUpActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpInput } from "../../schemas/signUp";
import { useAuth } from "../../hooks/useAuth";
import { useForm } from "react-hook-form";

export default function SignUpBox() {
  const { signUp: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpInput) => {
    await registerUser(data.firstname, data.lastname, data.email, data.password);
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
        S'enregistrer
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} alignItems="center">
          <BasicTextFields
            label="Prénom"
            {...register("firstname")}
            error={!!errors.firstname}
            helperText={errors.firstname?.message}
          />
          <BasicTextFields
            label="Nom"
            {...register("lastname")}
            error={!!errors.lastname}
            helperText={errors.lastname?.message}
          />
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
          <BasicTextFields
            label="Vérifier le mot de passe"
            type="password"
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />

          <BasicButtons label="S'enregistrer" type="submit" />

          <Stack paddingTop={4}>
            <LoginSignUpActions mode={"signup"}  />
          </Stack>
        </Stack>
      </form>
    </Box>
  );
}
