import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  user_id: string;
  role: string;
  exp: number;
}

export function getUserFromToken(): DecodedToken | null {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}