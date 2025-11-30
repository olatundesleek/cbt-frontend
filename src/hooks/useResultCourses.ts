import { queryClient } from '@/providers/query-provider';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resultsServices } from '@/services/resultsService';
import type {
  StudentResultCoursesResponse,
  CourseResults,
  getAllResultAdminResponse,
  AdminSingleResultResponse,
} from '@/types/results.types';
import { AppError } from '@/types/errors.types';

export function useResultCourses() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['student-result-courses'],
    queryFn: resultsServices.getStudentResultCourses,
  });

  return {
    data: data as StudentResultCoursesResponse | undefined,
    student: data?.student,
    courses: (data?.courses ?? []) as CourseResults[],
    overallStats: data?.overallStats,
    isLoading,
    error,
    refetch,
  };
}

export function useAdminResult() {
  const resultQuery = useQuery<getAllResultAdminResponse, AppError>({
    queryKey: ['adminResult'],
    queryFn: resultsServices.getAllResultAdmin,
  });

  return resultQuery;
}

export function useToggleResultVisibility() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      testId,
      showResult,
    }: {
      testId: number;
      showResult: boolean;
    }) => resultsServices.updateResultVisibility(testId, showResult),
    onSuccess: () => {
      // refresh admin results after toggling
      queryClient.invalidateQueries({ queryKey: ['adminResult'] });
    },
  });

  return mutation;
}

export function useAdminSingleResult(testId?: number | null) {
  const queryResponse = useQuery<AdminSingleResultResponse, AppError>({
    queryKey: ['adminSingleResult', testId],
    queryFn: () => resultsServices.getTestById(testId as number),
    enabled: !!testId,
  });

  return queryResponse;
}
