import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '@/services/settingsService';
import {
  CreateBackupResponse,
  GetAllBackupsResponse,
  RestoreFromBackupPayload,
  RestoreFromBackupResponse,
  SystemSettingsResponse,
  SystemSettingsUpdatePayload,
  UploadAndRestoreBackupPayload,
  UploadAndRestoreBackupResponse,
} from '@/types/settings.types';
import toast from 'react-hot-toast';

import { AppError } from '@/types/errors.types';
import getErrorDetails from '@/utils/getErrorDetails';

export function useSystemSettings() {
  return useQuery<SystemSettingsResponse>({
    queryFn: settingsService.getSystemSettings,
    queryKey: ['systemSettings'],
  });
}

export function useUpdateSystemSettings() {
  const queryClient = useQueryClient();
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
  const queryClient = useQueryClient();
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

export function useAllBackups(enabled: boolean) {
  return useQuery<GetAllBackupsResponse>({
    queryFn: settingsService.getAllBackups,
    queryKey: ['allBackups'],
    enabled,
    // enabled: false, // Disable automatic query on mount; call refetch() manually when needed
  });
}

export function useCreateBackup() {
  const queryClient = useQueryClient();
  return useMutation<CreateBackupResponse, AppError>({
    mutationFn: () => settingsService.createBackup(),
    onSuccess: (data) => {
      toast.success(data.message || 'Backup created successfully');
      queryClient.invalidateQueries({
        queryKey: ['allBackups'],
        refetchType: 'all',
      });
      // queryClient.refetchQueries({ queryKey: ['allBackups'] });
    },
    onError: (err) => {
      toast.error(getErrorDetails(err) || 'Failed to create backup');
    },
  });
}

export function useUploadAndRestoreBackup() {
  return useMutation<
    UploadAndRestoreBackupResponse,
    AppError,
    UploadAndRestoreBackupPayload
  >({
    mutationFn: (backupFile: UploadAndRestoreBackupPayload) =>
      settingsService.uploadAndRestoreBackup(backupFile),
    onSuccess: (data) => {
      toast.success(data.message || 'Backup uploaded and restore initiated');
    },
    onError: (err) => {
      toast.error(
        getErrorDetails(err) || 'Failed to upload and restore backup',
      );
    },
  });
}

export function useRestoreFromBackup() {
  return useMutation<
    RestoreFromBackupResponse,
    AppError,
    RestoreFromBackupPayload
  >({
    mutationFn: (payload: RestoreFromBackupPayload) =>
      settingsService.restoreFromBackup(payload),
    onSuccess: (data) => {
      toast.success(data.message || 'Restore from backup initiated');
    },
    onError: (err) => {
      toast.error(getErrorDetails(err) || 'Failed to restore from backup');
    },
  });
}

export function useDownloadBackupFile() {
  return (backupFilename: string) => {
    settingsService.downloadBackupFile(backupFilename);
  };
}

export function useDeleteBackupFile() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, AppError, string>({
    mutationFn: (backupFilename: string) =>
      settingsService.deleteBackupFile(backupFilename),
    onSuccess: (data) => {
      toast.success(data.message || 'Backup file deleted successfully');
      queryClient.invalidateQueries({
        queryKey: ['allBackups'],
        refetchType: 'all',
      });
      // queryClient.refetchQueries({ queryKey: ['allBackups'] });
    },
    onError: (err) => {
      toast.error(getErrorDetails(err) || 'Failed to delete backup file');
    },
  });
}
