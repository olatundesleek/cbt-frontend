import { useQuery } from '@tanstack/react-query';
import { resultsServices } from '@/services/resultsService';
import type {
  StudentResultCoursesResponse,
  CourseResults,
} from '@/types/results.types';

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
