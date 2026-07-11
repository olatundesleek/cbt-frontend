export interface SystemSettings {
  appName: string;
  institutionName: string;
  shortName: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  supportEmail: string;
  systemStatus: 'ACTIVE' | 'MAINTENANCE';
  id: number;
  loginBannerUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SystemSettingsResponse {
  success: boolean;
  message: string;
  data: SystemSettings;
}

// Payload used for partial updates; allow nullable URLs so callers can request deletions
export type SystemSettingsUpdatePayload = Partial<
  Omit<SystemSettings, 'logoUrl' | 'faviconUrl' | 'loginBannerUrl'>
> & {
  logoUrl?: string | null;
  faviconUrl?: string | null;
  loginBannerUrl?: string | null;
};

export interface Backup {
  filename: string;
  createdAt: string;
  size: number;
}

export interface GetAllBackupsResponse {
  success: boolean;
  message: string;
  data: { backups: Backup[] };
}

export interface CreateBackupResponse {
  success: boolean;
  message: string;
  filename: string;
  path: string;
}

export interface UploadAndRestoreBackupPayload {
  backupFile: File;
}

export interface UploadAndRestoreBackupResponse {
  success: boolean;
  message: string;
}

export interface RestoreFromBackupResponse {
  success: boolean;
  message: string;
}

export interface RestoreFromBackupPayload {
  filename: string;
}