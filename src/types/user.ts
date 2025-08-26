export type User = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: "invité" | "technicien" | "admin";
  phone_number: string;
};
