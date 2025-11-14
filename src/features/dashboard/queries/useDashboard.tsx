import { dashboardServices } from "@/services/dashboardService";
import { DashboardResponse } from '@/types/dashboard.types';
import { AppError } from '@/types/errors.types';
import { useQuery } from '@tanstack/react-query';

export default function useDashboard() {
  const {
    data: dashboardData,
    isLoading: isDashboardDataLoading,
    error: dashboardDataError,
  } = useQuery<DashboardResponse, AppError>({
    queryFn: dashboardServices.getDashboard,
    queryKey: ['dashboard'],
  });

  return { dashboardData, isDashboardDataLoading, dashboardDataError };
}

export const useGetClasses = () => {
  const queryResponse = useQuery({
    queryFn: dashboardServices.getAllClasses,
    queryKey: ["classes"],
  });

  return queryResponse;
};
