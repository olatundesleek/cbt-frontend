import axios from '@/lib/axios';
import { SystemSettingsResponse, SystemSettings } from '@/types/settings.types';

export const settingsService = {
  getSystemSettings: async (): Promise<SystemSettingsResponse> => {
    const response = await axios.get('/system-settings');
    return response.data;
  },
  updateSystemSettings: async (
    payload: Partial<SystemSettings>,
  ): Promise<SystemSettingsResponse> => {
    const response = await axios.patch('/system-settings', payload);
    return response.data;
  },
};
