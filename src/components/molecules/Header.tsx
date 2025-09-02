import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Logo from "../atoms/Logo";
import { useNavigate } from "react-router-dom";

const options = [
  { label: "Login", path: "/login" },
  { label: "Sign Up", path: "/sign-up" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Tag - Dashboard", path: "/tag/dashboard" },
  { label: "Utilisateur - Dashboard", path: "/user/dashboard" },
];

export default function Header () {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleClose();
  };

  return (
    <header className="flex flex-row items-center gap-2.5 justify-between">
      <Logo />
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
            onClick={() => handleNavigate(option.path)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </header>
  );
}
