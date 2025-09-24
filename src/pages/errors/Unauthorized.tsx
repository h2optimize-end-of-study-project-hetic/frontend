import { Stack, Box } from "@mui/material";
import BasicButtons from "../../components/atoms/Button";
import { useNavigate } from "react-router";
import logo from "/favicon.svg";

export default function Unauthorized() {
  const navigate = useNavigate();
  return (
    <>
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          padding: {
            xs: 2, // mobile
            sm: 4, // ≥600px
            md: 8, // ≥900px
            lg: 14, // ≥1200px
          },
          textAlign: {
            xs: "center",
            md: "left",
          },
        }}
      >
        <Box
          sx={{
            backgroundColor: "#fff",
            padding: 5,
            borderRadius: 2,
            width: "100%",
            maxWidth: 400,
            boxShadow: 3,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              width: "120px",
              height: "auto",
              filter: "grayscale(100%)",
            }}
          />

          <h1>Erreur 403</h1>
          <p>Vous n'êtes pas authorisé ici</p>
          <BasicButtons
            label="Retourner à la page d'acceuil"
            onClick={() => navigate("/")}
          />
        </Box>
      </Stack>
    </>
  );
}
