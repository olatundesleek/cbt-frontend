import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resultsServices } from '@/services/resultsService';
import type {
  StudentResultCoursesResponse,
  getAllResultAdminResponse,
  AdminSingleResultResponse,
} from '@/types/results.types';
import type { AdminTestsResponse } from '@/types/tests.types';
import type { PaginationParams } from '@/types/pagination.types';
import { AppError } from '@/types/errors.types';
import toast from 'react-hot-toast';
import getErrorDetails from '@/utils/getErrorDetails';

export function useResultCourses(params?: PaginationParams) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['student-result-courses', params],
    queryFn: () => resultsServices.getStudentResultCourses(params),
  });

  return {
    data: data as StudentResultCoursesResponse | undefined,
    student: data?.student,
    // courses: (data?.courses ?? []) as CourseResults[],
    overallStats: data?.overallStats,
    pagination: data?.pagination,
    isLoading,
    error,
    refetch,
  };
}

export function useAdminResult(params?: PaginationParams) {
  const resultQuery = useQuery<getAllResultAdminResponse, AppError>({
    queryKey: ['adminResult', params],
    queryFn: () => resultsServices.getAllResultAdmin(params),
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
    // optimistic update: update cache immediately then rollback on error
    onMutate: async ({ testId, showResult }) => {
      await queryClient.cancelQueries({ queryKey: ['adminTests'] });
      await queryClient.cancelQueries({ queryKey: ['adminResult'] });

      const previousAdminTests = queryClient.getQueryData<AdminTestsResponse>([
        'adminTests',
      ]);
      const previousAdminResult =
        queryClient.getQueryData<getAllResultAdminResponse>(['adminResult']);

      if (previousAdminTests) {
        queryClient.setQueryData<AdminTestsResponse>(['adminTests'], (old) => {
          if (!old) return old;
          const updatedDataArray = (old.data?.data ?? []).map((t) =>
            t.id === testId ? { ...t, showResult } : t,
          );
          return {
            ...old,
            data: {
              ...old.data,
              data: updatedDataArray,
            },
          } as AdminTestsResponse;
        });
      }

      if (previousAdminResult) {
        // adminResult shape may differ; try to update any test entries found
        queryClient.setQueryData<getAllResultAdminResponse>(
          ['adminResult'],
          (old) => {
            if (!old) return old;
            // if old has a data array of courses/tests, attempt to update nested tests
            if (Array.isArray(old.data?.courses)) {
              const updated = {
                ...old,
                data: {
                  ...old.data,
                  courses: old.data.courses.map((course) => ({
                    ...course,
                    tests: Array.isArray(course.tests)
                      ? course.tests.map((t) =>
                          t.id === testId ? { ...t, showResult } : t,
                        )
                      : course.tests,
                  })),
                },
              } as getAllResultAdminResponse;
              return updated;
            }
            return old;
          },
        );
      }

      return { previousAdminTests, previousAdminResult };
    },
    onError: (
      err,
      variables,
      context?: {
        previousAdminTests?: AdminTestsResponse;
        previousAdminResult?: getAllResultAdminResponse;
      },
    ) => {
      // rollback to previous cache state
      if (context?.previousAdminTests) {
        queryClient.setQueryData<AdminTestsResponse>(
          ['adminTests'],
          context.previousAdminTests,
        );
      }
      if (context?.previousAdminResult) {
        queryClient.setQueryData<getAllResultAdminResponse>(
          ['adminResult'],
          context.previousAdminResult,
        );
      }
      toast.error(getErrorDetails(err));
    },
    onSettled: () => {
      // ensure server state is reflected
      queryClient.invalidateQueries({ queryKey: ['adminTests'] });
      queryClient.invalidateQueries({ queryKey: ['adminResult'] });
    },

    onSuccess: (data) => {
      toast.success(data.message);
    },
  });

  return mutation;
}

export function useAdminSingleResult(sessionId?: number | null) {
  const queryResponse = useQuery<AdminSingleResultResponse, AppError>({
    queryKey: ['adminSingleResult', sessionId],
    queryFn: () => resultsServices.getTestBySessionId(sessionId as number),
    enabled: !!sessionId,
  });

  return queryResponse;
}
