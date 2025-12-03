import { useSystemSettingsStore } from '@/store/useSystemSettingsStore';
import Link from 'next/link';

export default function Logo() {
  const settings = useSystemSettingsStore((store) => store.settings);

  return settings?.logoUrl ? (
    <Link href={'/dashboard'}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={settings.logoUrl}
        alt={settings.institutionName || 'CBT'}
        className='h-10 w-auto'
      />
    </Link>
  ) : (
    <Link
      href={'/dashboard'}
      className='text-primary-900 shadow text-2xl font-black'
    >
      {settings?.shortName || 'CBT TEST'}
    </Link>
  );
}
