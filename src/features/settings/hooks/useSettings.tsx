import { useQuery, useMutation } from '@tanstack/react-query';
import { settingsService } from '@/services/settingsService';
import { SystemSettingsResponse, SystemSettings } from '@/types/settings.types';
import toast from 'react-hot-toast';
import { errorLogger } from '@/lib/axios';
import { queryClient } from '@/providers/query-provider';

export function useSystemSettings() {
  return useQuery<SystemSettingsResponse>({
    queryFn: settingsService.getSystemSettings,
    queryKey: ['systemSettings'],
  });
}

export function useUpdateSystemSettings() {
  return useMutation({
    mutationFn: (data: Partial<SystemSettings>) =>
      settingsService.updateSystemSettings(data),
    onSuccess: (res) => {
      toast.success(res.message || 'Settings updated');
      queryClient.invalidateQueries({ queryKey: ['systemSettings'] });
    },
    onError: (err) => {
      errorLogger(err);
    },
  });
}
