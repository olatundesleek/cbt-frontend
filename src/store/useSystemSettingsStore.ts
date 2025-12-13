import { create } from 'zustand';

interface SystemSettings {
  id: number;
  appName: string;
  institutionName: string;
  shortName: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  loginBannerUrl: string | null;
  primaryColor: string;
  supportEmail: string;
  systemStatus: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

interface SystemSettingsStore {
  settings: SystemSettings | null;
  setSettings: (s: SystemSettings) => void;
}

export const useSystemSettingsStore = create<SystemSettingsStore>((set) => ({
  settings: null,
  setSettings: (s: SystemSettings) => set({ settings: s }),
}));
