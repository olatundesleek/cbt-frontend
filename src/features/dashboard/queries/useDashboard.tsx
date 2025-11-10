import { dashboardServices } from "@/services/dashboardService";
import { useQuery } from "@tanstack/react-query";

export default function useDashboard() {
  const {
    data: dashboardData,
    isLoading: isDashboardDataLoading,
    error: dashboardDataError,
  } = useQuery({
    queryFn: dashboardServices.getDashboard,
    queryKey: ["dashboard"],
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
