'use client';

import { useSystemSettingsStore } from '@/store/useSystemSettingsStore';
import { SystemSettingsResponse } from '@/types/settings.types';
import { useEffect } from 'react';

export default function SystemSettingsHydrator({
  systemSettings,
}: {
  systemSettings: SystemSettingsResponse['data'];
}) {
  const setSettings = useSystemSettingsStore((store) => store.setSettings);
  //   console.log(setSettings);

  useEffect(() => {
    if (systemSettings) {
      setSettings(systemSettings);
    }

    if (systemSettings.faviconUrl) {
      const link: HTMLLinkElement | null =
        document.querySelector("link[rel*='icon']");
      if (link) {
        link.href = systemSettings.faviconUrl;
      } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = systemSettings.faviconUrl;
        document.head.appendChild(newLink);
      }

      if (systemSettings.primaryColor) {
        document.documentElement.style.setProperty(
          '--token-color-primary-600',
          systemSettings.primaryColor,
        );
      }
    }
  }, [systemSettings, setSettings]);

  return null;
}
