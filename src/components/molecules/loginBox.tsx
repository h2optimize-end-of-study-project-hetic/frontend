import { Box, Stack, Typography } from "@mui/material";
import BasicTextFields from "../atoms/Input";
import BasicButtons from "../atoms/Button";
import LoginActions from "../atoms/Link";

export default function LoginBox() {
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

      <Stack spacing={2} alignItems="center">
        <BasicTextFields label="Email" />
        <BasicTextFields label="Mot de passe" />
        <LoginActions label="Mot de passe oublié ?" />
        <BasicButtons label="Se connecter" />
        <Stack paddingTop={4}>
          <LoginActions label="Nouveau à H₂Optimize ? Rejoignez-nous" />
        </Stack>
      </Stack>
    </Box>
  );
}
