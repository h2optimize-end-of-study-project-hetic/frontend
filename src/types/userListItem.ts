export type UserListItem = {
  id: number;
  firstname: string;
  lastname: string;
  role: "guest" | "technician" | "admin" | "staff";
};
