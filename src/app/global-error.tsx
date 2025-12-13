'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4'>
          <div className='w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg'>
            <div className='text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100'>
                <svg
                  className='h-8 w-8 text-red-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                  />
                </svg>
              </div>
              <h2 className='mb-2 text-2xl font-bold text-gray-900'>
                Something went wrong!
              </h2>
              <p className='mb-6 text-gray-600'>
                {error.message || 'An unexpected error occurred'}
              </p>
            </div>
            <div className='space-y-3'>
              <button
                onClick={reset}
                className='w-full rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 transition-colors'
              >
                Try again
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className='w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors'
              >
                Go to home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
