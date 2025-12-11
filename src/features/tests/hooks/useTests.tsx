import { testsServices } from '@/services/testsService';
import { useQuery } from '@tanstack/react-query';
import type { PaginationParams } from '@/types/pagination.types';

export default function useTests(params?: PaginationParams) {
  const {
    data: testsData,
    isLoading: isTestsDataLoading,
    error: testsDataError,
  } = useQuery({
    queryFn: () => testsServices.getTests(params),
    queryKey: ['tests', params],
  });

  return { testsData, isTestsDataLoading, testsDataError };
}

export function useAdminTest(params?: PaginationParams) {
  const queryResponse = useQuery({
    queryFn: () => testsServices.getAdminTests(params),
    queryKey: ['adminTests', params],
  });

  return queryResponse;
}