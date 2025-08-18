import { Box, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom"; 
type LoginActionsProps = {
  mode: "login" | "signup";
};

const LoginSignUpActions = ({ mode }: LoginActionsProps) => {
  const isLogin = mode === "login";

  return (
    <Box mt={2}>
    <Link
            component={RouterLink}

      to={isLogin ? "/sign-up" : "/login"}
      underline="hover"
      sx={{ color: "#1A3C7E" }}
    >
      {isLogin
        ? "Pas encore de compte ? S'enregistrer"
        : "Déjà un compte ? Connectez-vous"}
    </Link>
    </Box>
  );
};

export default LoginSignUpActions;
