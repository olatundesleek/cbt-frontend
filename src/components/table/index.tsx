import { ReactNode, TdHTMLAttributes, useState } from "react";
import { createPortal } from "react-dom";
import SpinnerMini from "../ui/SpinnerMini";
import { IoMdMore } from "react-icons/io";
import ReactPaginate from "react-paginate";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

interface TableDataItemProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
}

interface RenderItemProps<T> {
  item: T;
  itemIndex: number;
}

interface AppTableProps<T> {
  headerColumns: string[];
  data: T[];
  isLoading?: boolean;
  label?: string;
  centralizeLabel?: boolean;
  itemsPerPage?: number;

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
    <td className="text-center text-sm" {...rest}>
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
  itemsPerPage = 5,
  onActionClick,
}: AppTableProps<T>) => {
  const [itemOffset, setItemOffset] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalPosition, setModalPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });

  const columns = onActionClick ? [...headerColumns, "Actions"] : headerColumns;

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = data.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(data.length / itemsPerPage);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event?.selected * itemsPerPage) % data.length;

    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  const openActionModal = (
    item: T,
    itemIndex: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    event: any
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
    <div className="flex flex-col overflow-x-auto w-full relative">
      {label && (
        <span
          className={`${
            centralizeLabel ? "text-center" : "text-left"
          } text-base md:text-lg font-bold`}
        >
          {label}
        </span>
      )}

      <table className="w-full border-separate border-spacing-y-4">
        <thead className="bg-primary-600">
          <tr>
            {columns.map((item, itemIndex) => (
              <th key={itemIndex} className="text-background py-2 text-sm">
                {item}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-grey-30">
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

      {data.length > 10 && (
        <div className="flex items-center justify-center w-full mt-8">
          <ReactPaginate
            breakLabel="..."
            previousLabel={<GrFormPrevious size={16} />}
            nextLabel={<GrFormNext size={16} />}
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            renderOnZeroPageCount={null}
            containerClassName="flex flex-row items-center gap-4"
            pageClassName="cursor-pointer"
            previousClassName="cursor-pointer"
            nextClassName="cursor-pointer"
            disabledClassName="opacity-20"
            activeLinkClassName="underline"
          />
        </div>
      )}

      {isLoading ? (
        <SpinnerMini color="#0c4a6e" />
      ) : (
        !currentItems.length && (
          <span
            className={`${
              centralizeLabel ? "text-center" : "text-left"
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
            className="fixed inset-0 z-999 bg-black/20"
            onClick={() => setShowModal(false)}
          >
            <div
              className="absolute bg-white p-1 rounded shadow-xl z-1000 mx-2"
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
          document.body
        )}
    </div>
  );
};

export default AppTable;
