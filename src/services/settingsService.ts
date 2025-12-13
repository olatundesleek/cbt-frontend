import axios from '@/lib/axios';
import {
  SystemSettingsResponse,
  SystemSettingsUpdatePayload,
} from '@/types/settings.types';

export const settingsService = {
  getSystemSettings: async (): Promise<SystemSettingsResponse> => {
    const response = await axios.get('/system-settings');
    return response.data;
  },
  updateSystemSettings: async (
    payload: SystemSettingsUpdatePayload,
  ): Promise<SystemSettingsResponse> => {
    const response = await axios.patch('/system-settings', payload);
    return response.data;
  },
  updateSystemSettingsWithFiles: async (
    payload: SystemSettingsUpdatePayload,
    logoFile?: File | null,
    faviconFile?: File | null,
    loginBannerFile?: File | null,
  ): Promise<SystemSettingsResponse> => {
    const form = new FormData();
    if (payload.appName) form.append('appName', payload.appName);
    if (payload.institutionName)
      form.append('institutionName', payload.institutionName);
    if (payload.shortName) form.append('shortName', payload.shortName);
    if (payload.primaryColor) form.append('primaryColor', payload.primaryColor);
    if (payload.supportEmail) form.append('supportEmail', payload.supportEmail);
    if (payload.systemStatus) form.append('systemStatus', payload.systemStatus);

    // If caller provided payload keys for URLs (e.g. logoUrl) but did not
    // upload a file, append them under the multipart keys so the server can
    // clear or update the corresponding resource. If a File is present, it
    // takes precedence.
    if (logoFile) {
      form.append('logo', logoFile);
    } else if (Object.prototype.hasOwnProperty.call(payload, 'logoUrl')) {
      if (payload.logoUrl === null) {
        form.append('logo', 'null');
      } else {
        form.append('logo', payload.logoUrl ?? '');
      }
    }

    if (faviconFile) {
      form.append('favicon', faviconFile);
    } else if (Object.prototype.hasOwnProperty.call(payload, 'faviconUrl')) {
      if (payload.faviconUrl === null) {
        form.append('favicon', 'null');
      } else {
        form.append('favicon', payload.faviconUrl ?? '');
      }
    }

    if (loginBannerFile) {
      form.append('loginBanner', loginBannerFile);
    } else if (
      Object.prototype.hasOwnProperty.call(payload, 'loginBannerUrl')
    ) {
      if (payload.loginBannerUrl === null) {
        form.append('loginBanner', 'null');
      } else {
        form.append('loginBanner', payload.loginBannerUrl ?? '');
      }
    }

    const response = await axios.patch('/system-settings', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
