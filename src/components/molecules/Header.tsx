import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Logo from "../atoms/Logo";
import { useNavigate } from "react-router-dom";
import Weather from "../atoms/Weather";
import { useAuth } from "../../hooks/useAuth";
import { useSnackbar } from "../../context/SnackbarContext";


export default function Header() {
  const navigate = useNavigate();
  const { error, logout } = useAuth();
  const { showMessage } = useSnackbar()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const token = localStorage.getItem("token");
  const isAuthenticated = Boolean(token);

  const options = isAuthenticated
    ? [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Pièces", path: "/room" },
        { label: "Balises", path: "/tag" },
        { label: "Utilisateurs", path: "/user/dashboard" },
        { label: "Se déconnecter", path: "/login" },
      ]
    : [
        { label: "Se connecter", path: "/login" },
        { label: "S'inscrire", path: "/sign-up" },
      ];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path: string, label?: string) => {
    if (label === "Se déconnecter") {
      localStorage.removeItem("token"); // ✅ supprime le token
    }
    navigate(path);
    handleClose();
  };


  const handleLogout = () => {
    logout()

    if (error) {
      showMessage(error, 'error')
      handleClose();
      return 
    }
    showMessage('Déconnecté', 'success')
    handleClose();
    navigate("/login");
  };

  return (
    <header className="flex flex-row items-center gap-2.5 justify-between">
      <Logo />
      <div className="flex flex-row items-center gap-2.5">
        <Weather />
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? "long-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          slotProps={{
            paper: {
              style: {
                width: "20ch",
              },
            },
            list: {
              "aria-labelledby": "long-button",
            },
          }}
        >
          {options.map((option) => (
            <MenuItem
              key={option.path}
              onClick={() => handleNavigate(option.path, option.label)}
            >
              {option.label}
            </MenuItem>
          ))}
          <MenuItem onClick={handleLogout}>
          Déconnexion
        </MenuItem>
      </Menu>
      </div>
    </header>
  );
}
