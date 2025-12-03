export interface SystemSettings {
  appName: string;
  institutionName: string;
  shortName: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  supportEmail: string;
  systemStatus: 'ACTIVE' | 'MAINTENANCE';
  id: number;
  loginBannerUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface SystemSettingsResponse {
  success: boolean;
  message: string;
  data: SystemSettings;
}
