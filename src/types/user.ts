export type User = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: "guest" | "technician" | "admin" | "staff";
  phone_number: string;
};
