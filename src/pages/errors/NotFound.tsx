import { Stack, Box, Button } from "@mui/material";
import { useNavigate } from "react-router";
import logo from "/favicon.svg";
import Header from "../../components/molecules/header";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <>
      <Header />
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

          <h1>Erreur 404</h1>
          <p>Oops, cette page n'existe pas !</p>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "var(--light-blue)",
              color: "var(--dark-blue)",
              fontWeight: 500,
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
            onClick={() => navigate("/dashboard")}
          >
            Retourner au Dashboard
          </Button>
        </Box>
      </Stack>
    </>
  );
}
