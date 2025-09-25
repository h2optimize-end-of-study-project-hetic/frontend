import { Box, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router";


type ChangeViewProps = {
  tagId?: number;
};

const ChangeView = ({ tagId }: ChangeViewProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const normalizePath = (path: string) => {
    if (!path) return "/";

    let cleanPath = path !== "/" && path.endsWith("/") ? path.slice(0, -1) : path;
    cleanPath = cleanPath
      .split("/")
      .filter((segment) => segment && !/^\d+$/.test(segment))
      .join("/");

    return cleanPath.startsWith("/") ? cleanPath : "/" + cleanPath;
  };

  const currentPath = normalizePath(location.pathname);

  const getButtonStyle = (path: string | string[]) => {
    const paths = Array.isArray(path) ? path : [path];
    const isActive = paths.some(p => currentPath === normalizePath(p));

    return {
      backgroundColor: isActive ? "var(--dark-blue)" : "var(--light-blue)",
      color: isActive ? "var(--light-blue)" : "var(--dark-blue)",
      width: "fit-content",
      boxShadow: isActive ? "0 2px 6px rgba(0,0,0,0.2)" : "none",
      "&:hover": {
        backgroundColor: isActive ? "var(--light-blue)" : "var(--dark-blue)",
        color: isActive ? "var(--dark-blue)" : "var(--light-blue)",
      },
    };
  };

  return (
    <Box display="flex" flexDirection={{ xs: "column", sm: "row" }}  mb={2} columnGap={4} flexWrap="wrap" justifyContent="space-between">
      <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={1} mb={2}>
        <Button
          onClick={() => navigate(tagId ? `/tag/${tagId}/edit` : "/tag/edit")}
          variant="contained"
          sx={getButtonStyle("/tag/edit")}
        >
          Vue détailées
        </Button>

        <Button
          onClick={() => navigate("/tag")}
          variant="contained"
          sx={getButtonStyle("/tag")}
        >
          Vue tableau
        </Button>

        <Button
          onClick={() => navigate("/tag/statistique")}
          variant="contained"
          sx={getButtonStyle("/tag/statistique")}
        >
          Statistiques
        </Button>
      </Box>

      {
        location.pathname === '/tag/create' || (        
        <Box>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "var(--light-green)",
              color: "var(--dark-green)",
              fontWeight: 500,
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
            onClick={() => navigate("/tag/create")}
          >
            Créer une balise
          </Button>
        </Box>
      )
    }
    </Box>
  );
};

export default ChangeView;