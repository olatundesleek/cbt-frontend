'use client';

import { useSystemSettingsStore } from '@/store/useSystemSettingsStore';

export default function MaintenanceMode() {
  const settings = useSystemSettingsStore((store) => store.settings);

  const isMaintenanceMode = settings?.systemStatus === 'MAINTENANCE';

  if (!isMaintenanceMode) return null;

  return (
    <div className='min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center px-4'>
      <div className='max-w-md w-full'>
        <div className='text-center'>
          {/* Maintenance Icon */}
          <div className='mb-6 flex justify-center'>
            <div className='relative w-24 h-24'>
              <svg
                className='w-full h-full text-neutral-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M12 9v2m0 4v2m0 4v2M6.34 20H17.66a2 2 0 001.97-1.66l1.35-8.34a2 2 0 00-1.97-2.34H5.66a2 2 0 00-1.97 2.34l1.35 8.34A2 2 0 006.34 20z'
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className='text-4xl font-bold text-white mb-2'>
            Maintenance Mode
          </h1>

          {/* Subtitle */}
          <p className='text-neutral-300 text-lg mb-6'>
            We are currently performing scheduled maintenance to improve our
            services.
          </p>

          {/* Description */}
          <div className='bg-neutral-800 rounded-lg p-6 mb-8'>
            <p className='text-neutral-200 text-sm'>
              Our system is temporarily unavailable. We apologize for any
              inconvenience caused. We expect to be back online shortly.
            </p>
          </div>

          {/* Support Contact */}
          {settings?.supportEmail && (
            <div className='bg-neutral-800/50 rounded-lg p-4 mb-8'>
              <p className='text-neutral-400 text-sm mb-2'>
                For urgent inquiries, please contact:
              </p>
              <a
                href={`mailto:${settings.supportEmail}`}
                className='text-primary-500 hover:text-primary-400 font-semibold transition-colors'
              >
                {settings.supportEmail}
              </a>
            </div>
          )}

          {/* Status Indicator */}
          <div className='flex items-center justify-center gap-2 mb-8'>
            <div className='w-3 h-3 bg-yellow-500 rounded-full animate-pulse'></div>
            <span className='text-neutral-400 text-sm'>
              System in maintenance
            </span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => window.location.reload()}
            className='w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors'
          >
            Refresh Page
          </button>
        </div>

        {/* Institution Info */}
        {settings?.institutionName && (
          <div className='mt-12 text-center'>
            <p className='text-neutral-500 text-sm'>
              {settings.institutionName}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
