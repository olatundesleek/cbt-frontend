import { dashboardServices } from "@/services/dashboardService";
import { useQuery } from "@tanstack/react-query";

export default function useDashboard() {
  const queryResponse = useQuery({
    queryFn: dashboardServices.getDashboard,
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
