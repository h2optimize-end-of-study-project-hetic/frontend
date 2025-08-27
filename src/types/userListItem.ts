export type UserListItem = {
  id: number;
  firstname: string;
  lastname: string;
  role: "invité" | "technicien" | "admin";
};
