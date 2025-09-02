import { Button, Stack } from "@mui/material";
import CreateUserBox from "../../components/molecules/createUserBox";
import { useState } from "react";
import { useNavigate } from "react-router";

const UserCreate = () => {
  const [role, setRole] = useState("guest");
  const navigate = useNavigate()

  return (
    <Stack alignItems="center" justifyContent="center" padding={4} px={1}>
      <CreateUserBox roleFilter={role} onRoleFilterChange={setRole} />
      <Button
          onClick={() => navigate("/user/dashboard")}
          variant="contained"
          sx={{
            margin: "24px",
            color: "var(--dark-blue)",
            backgroundColor: "var(--light-blue)",
            "&:hover": {
              backgroundColor: "var(--dark-blue)",
              color: "var(--light-blue)",
            },
          }}
        >
          Vue tableau
        </Button>
    </Stack>
  );
};

export default UserCreate;
