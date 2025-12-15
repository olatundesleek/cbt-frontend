import { resultsServices } from '@/services/resultsService';
import { useMutation } from '@tanstack/react-query';
import type { PaginationParams } from '@/types/pagination.types';

type DownloadPayload = {
  format: 'pdf' | 'excel';
  params?: PaginationParams;
};

export default function useDownloadResult() {
  return useMutation({
    mutationKey: ['student-result-download'],
    mutationFn: ({ format, params }: DownloadPayload) =>
      resultsServices.downloadStudentResultCourses(format, params),
  });
}

export function useAdminDownloadResult() {
  return useMutation({
    mutationKey: ['admin-result-download'],
    mutationFn: ({ format, params }: DownloadPayload) =>
      resultsServices.downloadAdminResults(format, params),
  });
}
