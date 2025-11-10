import api from "@/lib/axios";
import internalApi from "@/lib/internalApi";
import {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  UserRole,
} from "@/types/auth.types";
import axios from "axios";

export async function proxySetCookie({
  token,
  role,
}: {
  token: string;
  role: UserRole;
}) {
  try {
    const response = await internalApi.post(
      "/api/auth/set-auth-cookie",
      { token, role },
      { withCredentials: true }
    );

    const data = response.data;

    if (response.status === 200 && data.success) {
      return { success: true, message: data.message, token };
    }

    return {
      success: false,
      message: data.message || "Failed to set cookie",
      status: response.status,
    };
  } catch (error) {
    console.error("proxySetCookie error:", error);

    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || "Error setting authentication cookie";

      return {
        success: false,
        message,
        status: error.response?.status || 500,
      };
    }

    // fallback for non-Axios errors
    return {
      success: false,
      message: "An unexpected error occurred",
      status: 500,
    };
  }
}

const AUTH_BASE = "/auth";

export const authService = {
  login: async (data: LoginPayload): Promise<LoginResponse> => {
    const response = await api.post(`${AUTH_BASE}/login`, data);
    const token = response.data?.data?.token;
    const role = response.data.data.data.role;

    if (!token) throw new Error("Token not found in response");

    // Call proxy to set cookie in Next.js domain
    const cookieResult = await proxySetCookie({ token, role });

    if (!cookieResult.success) {
      throw new Error(cookieResult.message || "Failed to set cookie");
    }

    // Return login data (for UI state or redirect)
    return response.data;
  },

  register: async (payload: RegisterPayload) => {
    const response = await api.post(`${AUTH_BASE}/register`, payload);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post(`${AUTH_BASE}/logout`);
  },

  //   getCurrentUser: async (): Promise<LoginResponse> => {
  //     const response = await api.get(`${AUTH_BASE}/me`);
  //     return response.data;
  //   },
};
