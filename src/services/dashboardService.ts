import api from "@/lib/axios";
import {
  AllClassesResponse,
  AllCourses,
  AllTeachersResponse,
  DashboardResponse,
} from "@/types/dashboard.types";

export const dashboardServices = {
  // you don't need to statically include withCredentials. its already part of the axios api config
  getDashboard: async (): Promise<DashboardResponse> => {
    const response = await api.get("/dashboard");
    return response.data;
  },

  getAllClasses: async (): Promise<AllClassesResponse[]> => {
    const response = await api.get("/class");
    return response.data;
  },

  getAllTeacher: async (): Promise<AllTeachersResponse[]> => {
    const response = await api.get("/teachers");
    return response.data.data;
  },

  getAllCourses: async (): Promise<AllCourses[]> => {
    const response = await api.get("/courses");
    return response.data;
  },

  getAllQuestionBank: async (): Promise<[]> => {
    const response = await api.get("/questionBanks");
    return response.data;
  },
};
