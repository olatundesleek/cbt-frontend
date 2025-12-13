import { resultsServices } from '@/services/resultsService';
import { useMutation } from '@tanstack/react-query';

export default function useDownloadResult() {
  return useMutation({
    mutationKey: ['student-result-download'],
    mutationFn: resultsServices.downloadStudentResultCourses,
  });
}

export function useAdminDownloadResult() {
  return useMutation({
    mutationKey: ['admin-result-download'],
    mutationFn: resultsServices.downloadAdminResults,
  });
}
