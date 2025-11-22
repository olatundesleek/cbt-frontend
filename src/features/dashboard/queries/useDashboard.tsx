import { dashboardServices } from "@/services/dashboardService";
import type { DashboardResponse, DashboardData } from "@/types/dashboard.types";
import { AppError } from "@/types/errors.types";
import { useQuery } from "@tanstack/react-query";

export default function useDashboard<T = DashboardData>() {
  const queryResponse = useQuery<DashboardResponse<T>, AppError>({
    queryFn: () => dashboardServices.getDashboard<T>(),
    queryKey: ["dashboard"],
  });

  return queryResponse;
}

export const useGetClasses = () => {
  const queryResponse = useQuery({
    queryFn: dashboardServices.getAllClasses,
    queryKey: ["classes"],
  });

  return queryResponse;
};

export const useGetTeachers = () => {
  const queryResponse = useQuery({
    queryFn: dashboardServices.getAllTeacher,
    queryKey: ["teachers"],
  });

  return queryResponse;
};

export const useGetCourses = () => {
  const queryResponse = useQuery({
    queryFn: dashboardServices.getAllCourses,
    queryKey: ["courses"],
  });

  return queryResponse;
};

export const useGetQuestionBank = () => {
  const queryResponse = useQuery({
    queryFn: dashboardServices.getAllQuestionBank,
    queryKey: ["questionBanks"],
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
