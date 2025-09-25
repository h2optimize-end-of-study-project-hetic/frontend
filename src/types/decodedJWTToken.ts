export type decodedJWTToken = {
  sub: string;
  email: string;
  role: string;
  exp: number;
  [key: string]: any;
};