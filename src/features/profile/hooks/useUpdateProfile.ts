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

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<UpdateProfileResponse, AppError, UpdateProfileRequest>({
    mutationFn: profileService.updateProfile,
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
    onError: (err) => {
      toast.error(err.message);
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
