import { Stack } from "@mui/material";
import CreateUserBox from "../../components/molecules/createUserBox";
import { useState } from "react";

const AdminUserCreate = () => {
  const [role, setRole] = useState("invité");

  return (
    <Stack alignItems="center" justifyContent="center" padding={4} px={1}>
      <CreateUserBox
        roleFilter={role}
        onRoleFilterChange={setRole}
      />
    </Stack>
  );
};

export default AdminUserCreate;

