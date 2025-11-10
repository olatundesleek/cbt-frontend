import api from "@/lib/axios";
import { DashboardResponse } from "@/types/dashboard.types";

export const dashboardServices = {
  // you don't need to statically include withCredentials. its already part of the axios api config
  getDashboard: async (): Promise<DashboardResponse> => {
    const response = await api.get("/dashboard");
    return response.data;
  },

  getAllClasses: async () => {
    const response = await api.get("/classes");
    return response.data;
  },
};
