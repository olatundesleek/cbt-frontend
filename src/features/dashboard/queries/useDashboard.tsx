import { dashboardServices } from '@/services/dashboardService';
import type { DashboardResponse, DashboardData } from '@/types/dashboard.types';
import { AppError } from '@/types/errors.types';
import { useQuery } from '@tanstack/react-query';

export default function useDashboard<T = DashboardData>() {
  const queryResponse = useQuery<DashboardResponse<T>, AppError>({
    queryFn: () => dashboardServices.getDashboard<T>(),
    queryKey: ['dashboard'],
  });

  return queryResponse;
}

export const useGetClasses = () => {
  const queryResponse = useQuery({
    queryFn: dashboardServices.getAllClasses,
    queryKey: ['classes'],
  });

  return queryResponse;
};

export const useGetTeachers = () => {
  const queryResponse = useQuery({
    queryFn: dashboardServices.getAllTeacher,
    queryKey: ['teachers'],
  });

  return queryResponse;
};
