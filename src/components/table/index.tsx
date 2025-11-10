import { ReactNode } from "react";
import SpinnerMini from "../ui/SpinnerMini";

interface TableDataItemProps {
  children: ReactNode;
}

interface RenderItemProps<T> {
  item: T;
  itemIndex: number;
}

interface AppTableProps<T> {
  headerColumns: string[];
  data: T[];
  itemKey: ({ item, itemIndex }: RenderItemProps<T>) => string;
  renderItem: ({ item, itemIndex }: RenderItemProps<T>) => ReactNode;
  isLoading?: boolean;
  label?: string;
  centralizeLabel?: boolean;
  onRowPress?: ({ item, itemIndex }: RenderItemProps<T>) => void;
}

export const TableDataItem = ({ children }: TableDataItemProps) => {
  return <td className="text-center text-sm">{children}</td>;
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
}: AppTableProps<T>) => {
  if (!data) return null;

  return (
    <div className="flex flex-col gap-1 overflow-x-auto w-full">
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
            {headerColumns.map((item, itemIndex) => (
              <th key={`${item} - ${itemIndex}`} className="text-background">
                {item}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-grey-30">
          {isLoading ? (
            <SpinnerMini />
          ) : (
            data?.map((item, itemIndex) => {
              const hasRowPress = !!onRowPress;

              return (
                <tr
                  key={itemKey({ item, itemIndex }) ?? itemIndex}
                  onClick={() =>
                    hasRowPress ? onRowPress({ item, itemIndex }) : null
                  }
                  className={`${
                    hasRowPress
                      ? "cursor-pointer hover:bg-neutral-400"
                      : "cursor-default bg-transparent"
                  }`}
                >
                  {renderItem({ item, itemIndex })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* when data isn't available */}
      {!data.length && (
        <span
          className={`${
            centralizeLabel ? "text-center" : "text-left"
          } text-sm font-bold`}
        >
          No available data
        </span>
      )}
    </div>
  );
};

export default AppTable;
