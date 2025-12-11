import { ReactNode, TdHTMLAttributes, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import SpinnerMini from '../ui/SpinnerMini';
import { IoMdMore } from 'react-icons/io';
import Pagination from '../ui/Pagination';
import { PaginationMeta } from '@/types/pagination.types';
import { normalizePaginationMeta } from '@/utils/pagination';

interface TableDataItemProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
}

interface RenderItemProps<T> {
  item: T;
  itemIndex: number;
}

/**
 * Pagination mode configuration
 * - 'client': Data is paginated on the client side (default behavior)
 * - 'server': Data comes pre-paginated from server with metadata
 * - 'none': No pagination
 */
type PaginationMode = 'client' | 'server' | 'none';

interface AppTableProps<T> {
  headerColumns: string[];
  data: T[];
  isLoading?: boolean;
  label?: string;
  centralizeLabel?: boolean;

  /**
   * Pagination configuration
   * @default 'client'
   */
  paginationMode?: PaginationMode;

  /**
   * Items per page (for client-side pagination)
   * @default 10
   */
  itemsPerPage?: number;

  /**
   * Server pagination metadata (required when paginationMode='server')
   */
  paginationMeta?: PaginationMeta;

  /**
   * Page change callback (for server-side pagination)
   */
  onPageChange?: (page: number) => void;

  /** Action modal */
  actionModalContent?: ReactNode;

  itemKey: ({ item, itemIndex }: RenderItemProps<T>) => string;
  renderItem: ({ item, itemIndex }: RenderItemProps<T>) => ReactNode;
  onActionClick?: ({
    item,
    itemIndex,
    event,
  }: RenderItemProps<T> & {
    event: MouseEvent;
  }) => void;
  onRowPress?: ({ item, itemIndex }: RenderItemProps<T>) => void;
}

export const TableDataItem = ({ children, ...rest }: TableDataItemProps) => {
  return (
    <td className='text-center text-sm' {...rest}>
      {children}
    </td>
  );
};

const AppTable = <T,>({
  isLoading,
  centralizeLabel,
  label,
  headerColumns,
  data,
  renderItem,
  onRowPress,
  itemKey,
  actionModalContent,
  paginationMode = 'client',
  itemsPerPage = 10,
  paginationMeta,
  onPageChange,
  onActionClick,
}: AppTableProps<T>) => {
  const [itemOffset, setItemOffset] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalPosition, setModalPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });

  const columns = onActionClick ? [...headerColumns, 'Actions'] : headerColumns;

  // Normalize pagination metadata (fill in missing navigation flags)
  const normalizedMeta = useMemo(
    () => (paginationMeta ? normalizePaginationMeta(paginationMeta) : null),
    [paginationMeta],
  );

  // Client-side pagination logic
  const endOffset = itemOffset + itemsPerPage;
  const currentItems =
    paginationMode === 'client' ? data.slice(itemOffset, endOffset) : data; // For server mode, data is already paginated

  const pageCount =
    paginationMode === 'client'
      ? Math.ceil(data.length / itemsPerPage)
      : normalizedMeta?.totalPages ?? 1;

  const currentPage =
    paginationMode === 'client'
      ? Math.floor(itemOffset / itemsPerPage) + 1
      : normalizedMeta?.currentPage ?? 1;

  const totalItems =
    paginationMode === 'client'
      ? data.length
      : normalizedMeta?.totalItems ?? data.length;

  const handlePageClick = (page: number) => {
    if (paginationMode === 'client') {
      const newOffset = ((page - 1) * itemsPerPage) % data.length;
      setItemOffset(newOffset);
    } else if (paginationMode === 'server') {
      onPageChange?.(page);
    }
  };

  const openActionModal = (
    item: T,
    itemIndex: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    event: any,
  ) => {
    event.stopPropagation();

    const rect = event?.currentTarget?.getBoundingClientRect();
    setModalPosition({
      top: rect.top + window.scrollY + rect.height + 4,
      left: rect.left + window.scrollX,
    });

    setShowModal(true);

    onActionClick?.({ item, itemIndex, event });
  };

  if (!data) return null;

  return (
    <div className='flex flex-col overflow-x-auto w-full relative'>
      {label && (
        <span
          className={`${
            centralizeLabel ? 'text-center' : 'text-left'
          } text-base md:text-lg font-bold`}
        >
          {label}
        </span>
      )}

      <table className='w-full border-separate border-spacing-y-4'>
        <thead className='bg-primary-600'>
          <tr>
            {columns.map((item, itemIndex) => (
              <th key={itemIndex} className='text-background py-2 text-sm'>
                {item}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className='bg-grey-30'>
          {currentItems.map((item, itemIndex) => {
            const hasRowPress = !!onRowPress;

            return (
              <tr
                key={itemKey({ item, itemIndex })}
                onClick={() =>
                  hasRowPress ? onRowPress({ item, itemIndex }) : null
                }
                className={`${
                  hasRowPress
                    ? 'cursor-pointer hover:bg-neutral-300 transition-colors'
                    : 'cursor-default'
                }`}
              >
                {renderItem({
                  item,
                  itemIndex,
                })}

                {onActionClick && (
                  <td className='text-center'>
                    <button
                      aria-label='actions'
                      className='px-2 py-1 rounded bg-primary-500 text-white text-xs cursor-pointer'
                      onClick={(e) => openActionModal(item, itemIndex, e)}
                    >
                      <IoMdMore size={16} />
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination controls - only show if pagination is enabled and there's data */}
      {paginationMode !== 'none' && totalItems > 0 && (
        <div className='flex items-center justify-center w-full mt-6'>
          <Pagination
            page={currentPage}
            limit={itemsPerPage}
            totalItems={totalItems}
            onPageChange={handlePageClick}
            showPageNumbers={true}
            showFirstLast={true}
            showPrevNext={true}
            showTotal={true}
            showPageInfo={false}
            pageRangeDisplayed={5}
            disabled={isLoading}
          />
        </div>
      )}

      {isLoading ? (
        <SpinnerMini color='#0c4a6e' />
      ) : (
        !currentItems.length && (
          <span
            className={`${
              centralizeLabel ? 'text-center' : 'text-left'
            } text-sm font-bold`}
          >
            No available data
          </span>
        )
      )}

      {/* PORTAL MODAL */}
      {showModal &&
        createPortal(
          <div
            className='fixed inset-0 z-999 bg-black/20'
            onClick={() => setShowModal(false)}
          >
            <div
              className='absolute bg-white p-1 rounded shadow-xl z-1000 mx-2'
              style={{
                top: modalPosition.top,
                left: modalPosition.left,
              }}
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(false);
              }}
            >
              {actionModalContent}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default AppTable;
