import { profileService } from '@/services/profileService';
import { useQuery } from '@tanstack/react-query';

export default function useProfile() {
  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError,
  } = useQuery({
    queryFn: profileService.getProfile,
    queryKey: ['profile'],
  });

  return { profileData, isProfileLoading, profileError };
}
