export type UserRole = "developer" | "admin";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  age?: number | null;
  createdAt?: string;
  updatedAt?: string;
}