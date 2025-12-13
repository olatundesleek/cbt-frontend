import { useQuery, useMutation } from '@tanstack/react-query';
import { settingsService } from '@/services/settingsService';
import {
  SystemSettingsResponse,
  SystemSettingsUpdatePayload,
} from '@/types/settings.types';
import toast from 'react-hot-toast';
import { queryClient } from '@/providers/query-provider';
import { AppError } from '@/types/errors.types';
import getErrorDetails from '@/utils/getErrorDetails';

export function useSystemSettings() {
  return useQuery<SystemSettingsResponse>({
    queryFn: settingsService.getSystemSettings,
    queryKey: ['systemSettings'],
  });
}

export function useUpdateSystemSettings() {
  return useMutation<
    SystemSettingsResponse,
    AppError,
    SystemSettingsUpdatePayload
  >({
    mutationFn: (data: SystemSettingsUpdatePayload) =>
      settingsService.updateSystemSettings(data),
    onSuccess: (res) => {
      toast.success(res.message || 'Settings updated');
      queryClient.invalidateQueries({ queryKey: ['systemSettings'] });
    },
    onError: (err) => {
      toast.error(getErrorDetails(err) || 'Failed to update settings');
    },
  });
}

export function useUpdateSystemSettingsWithFiles() {
  return useMutation<
    SystemSettingsResponse,
    AppError,
    {
      payload: SystemSettingsUpdatePayload;
      logoFile?: File;
      faviconFile?: File;
      loginBannerFile?: File;
    }
  >({
    mutationFn: ({ payload, logoFile, faviconFile, loginBannerFile }) =>
      settingsService.updateSystemSettingsWithFiles(
        payload,
        logoFile,
        faviconFile,
        loginBannerFile,
      ),
    onSuccess: (res) => {
      toast.success(res.message || 'Settings updated');
      queryClient.invalidateQueries({ queryKey: ['systemSettings'] });
    },
    onError: (err) => {
      toast.error(getErrorDetails(err) || 'Failed to update settings');
    },
  });
}
