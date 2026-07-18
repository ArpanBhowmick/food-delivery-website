export type Role = "user" | "owner" | "deliveryBoy";

export interface DefaultAddress {
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  latitude: number | null;
  longitude: number | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: Role;
  avatar?: string | null;
  defaultAddress: DefaultAddress | null;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  accessToken: string;
  message: string;
}
