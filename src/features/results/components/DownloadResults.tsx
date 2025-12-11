import useDownloadResult from '../hook/useDownloadResult';
import { Button, SpinnerMini } from '@/components/ui';
import { useState } from 'react';

export default function DownloadResults() {
  const { mutate: downloadResult, isPending: isDownloadingResults } =
    useDownloadResult();
  const [format, setFormat] = useState<'pdf' | 'excel'>('pdf');

  const handleDownloadResult = function () {
    downloadResult(format);
  };

  return (
    <>
      <select
        className='border border-neutral-300 py-1.5 px-2 rounded text-neutral-700 mb-4 w-full text-sm'
        title='Download format'
        name='format'
        id='format'
        value={format}
        onChange={(e) => setFormat(e.target.value as 'pdf' | 'excel')}
      >
        <option value='' disabled>
          Select download format
        </option>
        <option value='pdf'>PDF</option>
        <option value='excel'>EXCEL</option>
      </select>
      <Button onClick={handleDownloadResult} disabled={isDownloadingResults}>
        {isDownloadingResults ? (
          <>
            Downloading <SpinnerMini />
          </>
        ) : (
          `Download Report as ${format.toUpperCase()}`
        )}
      </Button>
    </>
  );
}
