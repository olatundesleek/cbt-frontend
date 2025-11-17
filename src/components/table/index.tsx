import { ReactNode, TdHTMLAttributes, useState } from "react";
import { createPortal } from "react-dom";
import SpinnerMini from "../ui/SpinnerMini";
import { IoMdMore } from "react-icons/io";

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
  onActionClick,
}: AppTableProps<T>) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalPosition, setModalPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });

  const columns = onActionClick ? [...headerColumns, "Actions"] : headerColumns;

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
          {data.map((item, itemIndex) => {
            const hasRowPress = !!onRowPress;

            return (
              <tr
                key={itemKey({ item, itemIndex })}
                onClick={() =>
                  hasRowPress ? onRowPress({ item, itemIndex }) : null
                }
                className={`${
                  hasRowPress
                    ? "cursor-pointer hover:bg-neutral-300 transition-colors"
                    : "cursor-default"
                }`}
              >
                {renderItem({
                  item,
                  itemIndex,
                })}

                {onActionClick && (
                  <td className="text-center">
                    <button
                      className="px-2 py-1 rounded bg-primary-500 text-white text-xs cursor-pointer"
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

      {isLoading ? (
        <SpinnerMini color="#0c4a6e" />
      ) : (
        !data.length && (
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
