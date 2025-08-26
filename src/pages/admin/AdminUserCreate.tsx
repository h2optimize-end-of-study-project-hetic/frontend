import { Stack } from "@mui/material";
import CreateUserBox from "../../components/molecules/createUserBox";

const AdminUserCreate = () => {
  return (
    <Stack alignItems="center" justifyContent="center" padding={4} px={1}>
      <CreateUserBox />
    </Stack>
  );
};

export default AdminUserCreate;
