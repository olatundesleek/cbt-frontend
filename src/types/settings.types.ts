export interface SystemSettings {
  appName?: string;
  institutionName?: string;
  shortName?: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  supportEmail?: string;
  restoreBackup?: boolean;
  systemStatus?: 'active' | 'maintenance' | string;
}

export interface SystemSettingsResponse {
  success: boolean;
  message: string;
  data: SystemSettings;
}
