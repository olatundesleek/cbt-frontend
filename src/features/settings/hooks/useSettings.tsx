import { useQuery, useMutation } from '@tanstack/react-query';
import { settingsService } from '@/services/settingsService';
import { SystemSettingsResponse, SystemSettings } from '@/types/settings.types';
import toast from 'react-hot-toast';
import { queryClient } from '@/providers/query-provider';
import { AppError } from '@/types/errors.types';

export function useSystemSettings() {
  return useQuery<SystemSettingsResponse>({
    queryFn: settingsService.getSystemSettings,
    queryKey: ['systemSettings'],
  });
}

export function useUpdateSystemSettings() {
  return useMutation<SystemSettingsResponse, AppError, Partial<SystemSettings>>(
    {
      mutationFn: (data: Partial<SystemSettings>) =>
        settingsService.updateSystemSettings(data),
      onSuccess: (res) => {
        toast.success(res.message || 'Settings updated');
        queryClient.invalidateQueries({ queryKey: ['systemSettings'] });
      },
      onError: (err) => {
        console.log({ err });
        toast.error(err.details);
      },
    },
  );
}

export function useUpdateSystemSettingsWithFiles() {
  return useMutation<
    SystemSettingsResponse,
    AppError,
    { payload: Partial<SystemSettings>; logoFile?: File; faviconFile?: File }
  >({
    mutationFn: ({ payload, logoFile, faviconFile }) =>
      settingsService.updateSystemSettingsWithFiles(
        payload,
        logoFile,
        faviconFile,
      ),
    onSuccess: (res) => {
      toast.success(res.message || 'Settings updated');
      queryClient.invalidateQueries({ queryKey: ['systemSettings'] });
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.details || 'Failed to update settings');
    },
  });
}
