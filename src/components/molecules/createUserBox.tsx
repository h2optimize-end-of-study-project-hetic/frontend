import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, type UserInput } from "../../schemas/user";
import { useCreateUser } from "../../hooks/useCreateUser";
import { Box, MenuItem, Stack, TextField, Typography } from "@mui/material";
import BasicTextFields from "../atoms/Input";
import BasicButtons from "../atoms/Button";
import type { CreateUserBoxProps } from "../../types/AdminCreateUser";

type Props = CreateUserBoxProps;

export default function CreateUserBox({
  roleFilter,
  onRoleFilterChange,
}: Props) {
  const { createUser, loading, error } = useCreateUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInput>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = async (data: UserInput) => {
    const result = await createUser(data);
    if (result) {
      alert("Utilisateur créé !");
    }
  };

  return (
    <Box
      sx={{
        color: "var(--dark-blue)",
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
        Ajoutez une personne
      </Typography>

      {error && <p style={{ color: "red" }}>{error}</p>}

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

          <TextField
            select
            label="Rôle"
            fullWidth
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderColor: "var(--dark-blue)",
                "& fieldset": {
                  borderColor: "var(--dark-blue)",
                },
                "&:hover fieldset": {
                  borderColor: "var(--dark-blue)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "var(--dark-blue)",
                },
              },
              "& .MuiInputLabel-root": {
                color: "var(--dark-blue)",
              },
              "& .MuiInputBase-input": {
                color: "var(--dark-blue)",
              },
              width: "100%",
              maxWidth: "28ch",
              minWidth: "18ch",
            }}
          >
            <MenuItem value="invité">Invité</MenuItem>
            <MenuItem value="technicien">Technicien</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>

          <BasicTextFields
            label="Numéro de téléphone"
            {...register("phone_number")}
            error={!!errors.phone_number}
            helperText={errors.phone_number?.message}
          />
          <BasicTextFields
            label="Adresse mail"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <BasicButtons
            label={loading ? "Création..." : "Créer"}
            type="submit"
          />
        </Stack>
      </form>
    </Box>
  );
}
