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
