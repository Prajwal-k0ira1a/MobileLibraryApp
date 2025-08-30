import { API_ENDPOINTS } from "../utils/constants";
import axiosInstance from "./axiosInstance";

export type LoginPayload = { email: string; password: string };
export type LoginResponse = { token: string };

export interface User {
  _id: string;
  profileImage: string;
  name: string;
  email: string;
  role: "borrower" | "librarian";
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
  const res = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, payload);
  return res.data;
}

export async function getProfile(): Promise<User> {
  const res = await axiosInstance.get(API_ENDPOINTS.USERS.ME);
  // Handle the wrapped response structure: { status: true, data: User }
  return res.data.data || res.data;
}
