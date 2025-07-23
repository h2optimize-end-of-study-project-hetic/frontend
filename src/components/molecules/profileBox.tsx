import { Box, Stack, Typography, Select, MenuItem } from "@mui/material";
import type { SelectChangeEvent } from '@mui/material';
import BasicTextFields from "../atoms/Input";
import BasicButtons from "../atoms/Button";
import { useState } from 'react';
import { useForm } from "react-hook-form";

export default function ProfileBox() {
  const [language, setLanguage] = useState('1');
  const { register, handleSubmit } = useForm();
  const onSubmit = (data: any) => {
    console.log("données du formulaire:", data);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value);
  };

  return (
    <>
        <Box
        sx={{
            color: "#1A3C7E",
            backgroundColor: "#fff",
            padding: 5,
            borderRadius: 2,
            width: "100%",
            maxWidth: 600,
            boxShadow: 3,
            textAlign: "center",
        }}
        >
            <Typography variant="h4" gutterBottom>Mon profil</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2} alignItems="center">
                    <BasicTextFields label="Firstname" {...register("firstname")} />
                    <BasicTextFields label="Lastname" {...register("lastname")} />
                    <BasicTextFields label="Telephone" {...register("telephone")} />
                    <BasicTextFields label="E-mail" {...register("email")} />

                    <Typography variant="h6" >Changer de mot de passe</Typography>

                    <BasicTextFields label="Password" {...register("password")} />
                    <BasicTextFields label="Verify password" {...register("verifyPassword")} />

                    <Typography variant="h6" >Changer de langue</Typography>

                    <Select
                        labelId="language-label"
                        id="language-select"
                        value={language}
                        label="Langue"
                        onChange={handleChange}
                    >
                        <MenuItem value="1">Français</MenuItem>
                        <MenuItem value="2">Anglais</MenuItem>
                    </Select>
                    <BasicButtons label="Enregistrer" type="submit" />
                </Stack>
            </form>
        </Box>
    </>
  );
}