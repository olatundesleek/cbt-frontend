import useDownloadResult, {
  useAdminDownloadResult,
} from '../hook/useDownloadResult';
import { Button, SpinnerMini } from '@/components/ui';
import { useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import type { PaginationParams } from '@/types/pagination.types';

type Props = {
  params?: PaginationParams;
};

export default function DownloadResults({ params }: Props) {
  const role = useUserStore((state) => state.role);
  const { mutate: downloadStudentResult, isPending: isDownloadingStudent } =
    useDownloadResult();
  const { mutate: downloadAdminResult, isPending: isDownloadingAdmin } =
    useAdminDownloadResult();
  const [format, setFormat] = useState<'pdf' | 'excel'>('pdf');

  const isDownloadingResults = isDownloadingStudent || isDownloadingAdmin;

  const handleDownloadResult = function () {
    if (role === 'admin' || role === 'teacher') {
      downloadAdminResult({ format, params });
    } else {
      downloadStudentResult({ format, params });
    }
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
