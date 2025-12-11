import { dashboardServices } from "@/services/dashboardService";
import type { DashboardResponse, DashboardData } from "@/types/dashboard.types";
import type { PaginationParams } from '@/types/pagination.types';
import { AppError } from '@/types/errors.types';
import { useQuery } from '@tanstack/react-query';

export default function useDashboard<T = DashboardData>() {
  const queryResponse = useQuery<DashboardResponse<T>, AppError>({
    queryFn: () => dashboardServices.getDashboard<T>(),
    queryKey: ['dashboard'],
  });

  return queryResponse;
}

export const useGetClasses = (params?: PaginationParams) => {
  const queryResponse = useQuery({
    queryFn: () => dashboardServices.getAllClasses(params),
    queryKey: ['classes', params],
  });

  return queryResponse;
};

export const useGetTeachers = (params?: PaginationParams) => {
  const queryResponse = useQuery({
    queryFn: () => dashboardServices.getAllTeacher(params),
    queryKey: ['teachers', params],
  });

  return queryResponse;
};

export const useGetCourses = (params?: PaginationParams) => {
  const queryResponse = useQuery({
    queryFn: () => dashboardServices.getAllCourses(params),
    queryKey: ['courses', params],
  });

  return queryResponse;
};

export const useGetQuestionBank = (params?: PaginationParams) => {
  const queryResponse = useQuery({
    queryFn: () => dashboardServices.getAllQuestionBank(params),
    queryKey: ['questionBanks', params],
  });

  return queryResponse;
};

export const useGetQuestionsInBank = (bankId: string) => {
  const queryResponse = useQuery({
    queryFn: () => dashboardServices.getQuestionsInBank(bankId),
    queryKey: ["questionBanks", bankId],
    enabled: !!bankId
  });

  return queryResponse;
};
