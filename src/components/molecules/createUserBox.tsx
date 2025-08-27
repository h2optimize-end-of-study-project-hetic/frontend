import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router";

import { userSchema, type UserInput } from "../../schemas/user";
import { useCreateUser } from "../../hooks/useCreateUser";

import BasicTextFields from "../atoms/Input";
import BasicButtons from "../atoms/Button";
import type { CreateUserBoxProps } from "../../types/AdminCreateUser";

export default function CreateUserBox({
  roleFilter,
  onRoleFilterChange,
}: CreateUserBoxProps) {
  const navigate = useNavigate();
  const { createUser, loading, error } = useCreateUser();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserInput>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: roleFilter,
    },
  });

  useEffect(() => {
    setValue("role", roleFilter);
  }, [roleFilter, setValue]);

  const onSubmit = async (data: UserInput) => {
    console.log("🚀 onSubmit déclenché avec :", data);
    const result = await createUser(data);
    if (result) {
      alert("Utilisateur créé bravo!");
      navigate("/admin/dashboard");
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
            onChange={(e) => {
              onRoleFilterChange(e.target.value);
              setValue("role", e.target.value);
            }}
            error={!!errors.role}
            helperText={errors.role?.message}
            sx={{
              "& .MuiOutlinedInput-root": {
                maxHeight: "40px",
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
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "var(--light-green)",
              color: "var(--dark-green)",
              "&:hover": {
                color: "var(--light-green)",
                backgroundColor: "var(--dark-green)",
              },
            }}
            label={loading ? "Création..." : "Créer"}
          />
        </Stack>
      </form>
    </Box>
  );
}
