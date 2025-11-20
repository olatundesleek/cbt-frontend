import { testsServices } from '@/services/testsService';
import { useQuery } from '@tanstack/react-query';

export default function useTests() {
  const {
    data: testsData,
    isLoading: isTestsDataLoading,
    error: testsDataError,
  } = useQuery({
    queryFn: testsServices.getTests,
    queryKey: ['tests'],
  });

  return { testsData, isTestsDataLoading, testsDataError };
}

export function useAdminTest() {
  const queryResponse = useQuery({
    queryFn: testsServices.getAdminTests,
    queryKey: ['adminTests'],
  });

  return queryResponse;
}