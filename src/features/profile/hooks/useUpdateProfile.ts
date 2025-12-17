import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { profileService } from '@/services/profileService';
import type {
  UpdateProfileRequest,
  UpdateProfileResponse,
  StudentProfile,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
} from '@/types/profile.types';
import type { AppError } from '@/types/errors.types';
import getErrorDetails from '@/utils/getErrorDetails';

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateProfileResponse,
    AppError,
    UpdateProfileRequest,
    { previousProfile: StudentProfile | undefined }
  >({
    mutationFn: profileService.updateProfile,
    onMutate: async () => {
      // Cancel outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ['profile'] });

      const previousProfile = queryClient.getQueryData<StudentProfile>([
        'profile',
      ]);

      // Return context with the previous value for rollback
      return { previousProfile };
    },
    onSuccess: (res) => {
      toast.success(res.message || 'Profile updated');
      if (res.success && res.data) {
        // Update cached profile
        queryClient.setQueryData<StudentProfile>(['profile'], res.data);
      } else {
        // Fallback: refetch
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      }
    },
    onError: (err, _variables, context) => {
      // Rollback to previous data on error
      if (context?.previousProfile) {
        queryClient.setQueryData<StudentProfile>(
          ['profile'],
          context.previousProfile,
        );
      }
      toast.error(getErrorDetails(err));
    },
  });
}

export function useUpdatePassword() {
  return useMutation<UpdatePasswordResponse, AppError, UpdatePasswordRequest>({
    mutationFn: profileService.updatePassword,
    onSuccess: (res) => {
      toast.success(res.message || 'Password updated');
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}
