export type Role = "user" | "owner" | "deliveryBoy";

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: Role;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  accessToken: string;
  message: string;
}
