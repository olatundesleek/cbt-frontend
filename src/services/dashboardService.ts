import api from "@/lib/axios";
import {
  AllClassesResponse,
  AllTeachersResponse,
  DashboardResponse,
} from "@/types/dashboard.types";

export const dashboardServices = {
  // you don't need to statically include withCredentials. its already part of the axios api config
  getDashboard: async <T = unknown>(): Promise<DashboardResponse<T>> => {
    const response = await api.get('/dashboard');
    return response.data as DashboardResponse<T>;
  },

  getAllClasses: async (): Promise<AllClassesResponse[]> => {
    const response = await api.get('/class');
    return response.data;
  },

  getAllTeacher: async (): Promise<AllTeachersResponse[]> => {
    const response = await api.get('/teachers');
    return response.data.data;
  },
};
