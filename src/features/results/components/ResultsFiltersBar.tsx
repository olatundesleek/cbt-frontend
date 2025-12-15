'use client';

import React, { useEffect, useMemo, useState, useRef } from 'react';

export type ResultFilterOption = {
  label: string;
  value: string | number;
};

export type ResultFilterField =
  | {
      type: 'search';
      name: string;
      placeholder?: string;
      label?: string;
    }
  | {
      type: 'select';
      name: string;
      label: string;
      placeholder?: string;
      options: ResultFilterOption[];
      loading?: boolean;
    }
  | {
      type: 'date';
      name: string;
      label: string;
      placeholder?: string;
    };

interface ResultsFiltersBarProps {
  fields: ResultFilterField[];
  initialValues?: Record<string, string | number | undefined>;
  limit?: number;
  limitOptions?: number[];
  sort?: string;
  sortOptions?: Array<{ label: string; value: string }>;
  onChange?: (params: Record<string, string | number | undefined>) => void;
  onLimitChange?: (limit: number) => void;
  onSortChange?: (sort: string) => void;
  onReset?: () => void;
}

const DEFAULT_LIMIT_OPTIONS = [5, 10, 20, 30, 40];

const sanitizeParams = (
  values: Record<string, string | number | undefined>,
): Record<string, string | number | undefined> => {
  const cleaned: Record<string, string | number | undefined> = {};

  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    cleaned[key] = value;
  });

  return cleaned;
};

const useDebouncedValue = <T,>(value: T, delay: number = 350) => {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounced;
};

const ResultsFiltersBar: React.FC<ResultsFiltersBarProps> = ({
  fields,
  initialValues = {},
  limit,
  limitOptions = DEFAULT_LIMIT_OPTIONS,
  sort,
  sortOptions,
  onChange,
  onLimitChange,
  onSortChange,
  onReset,
}) => {
  const normalizedInitial = useMemo(
    () => sanitizeParams(initialValues),
    [initialValues],
  );

  // Initialize filter values from normalizedInitial at mount only
  const [filters, setFilters] = useState<
    Record<string, string | number | undefined>
  >(() => {
    const init: Record<string, string | number | undefined> = {};
    fields.forEach((field) => {
      if (field.name !== 'search') {
        init[field.name] = normalizedInitial[field.name];
      }
    });
    return init;
  });

  const [searchInput, setSearchInput] = useState<string>(
    typeof normalizedInitial.search === 'string' ||
      typeof normalizedInitial.search === 'number'
      ? String(normalizedInitial.search)
      : '',
  );

  const debouncedSearch = useDebouncedValue(searchInput, 350);

  const lastPayloadRef = useRef<string>('');

  useEffect(() => {
    const payload: Record<string, string | number | undefined> = {};

    fields.forEach((field) => {
      payload[field.name] = filters[field.name];
    });

    payload.search = debouncedSearch ? debouncedSearch : undefined;

    const payloadStr = JSON.stringify(payload);
    if (payloadStr !== lastPayloadRef.current) {
      lastPayloadRef.current = payloadStr;
      onChange?.({ ...payload, page: 1 });
    }
  }, [filters, debouncedSearch, fields, onChange]);

  const handleFieldChange = (
    name: string,
    value: string | number | undefined,
  ) => {
    setFilters((prev) => {
      const next = { ...prev };
      if (value === undefined || value === '') {
        delete next[name];
      } else {
        next[name] = value;
      }
      return next;
    });
  };

  const handleReset = () => {
    setFilters({});
    setSearchInput('');
    const cleared: Record<string, string | number | undefined> = { page: 1 };
    fields.forEach((field) => {
      cleared[field.name] = undefined;
    });
    onChange?.(cleared);
    onReset?.();
  };

  return (
    <div className='w-full bg-white rounded border border-neutral-200 p-4 shadow-sm'>
      <div className='flex flex-col gap-3'>
        <div className='flex flex-wrap items-end gap-3'>
          {fields.map((field) => {
            if (field.type === 'search') {
              return (
                <div key={field.name} className='flex-1 min-w-[220px]'>
                  {field.label && (
                    <label className='block text-sm text-neutral-600 mb-1'>
                      {field.label}
                    </label>
                  )}
                  <input
                    type='search'
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder={field.placeholder ?? 'Search'}
                    className='w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
                  />
                </div>
              );
            }

            if (field.type === 'select') {
              const value = filters[field.name] ?? '';
              return (
                <div key={field.name} className='min-w-[160px]'>
                  <label
                    htmlFor={field.name}
                    className='block text-sm text-neutral-600 mb-1'
                  >
                    {field.label}
                  </label>
                  <select
                    id={field.name}
                    value={value}
                    onChange={(e) =>
                      handleFieldChange(
                        field.name,
                        e.target.value === '' ? undefined : e.target.value,
                      )
                    }
                    disabled={field.loading}
                    className='w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    <option value=''>{field.placeholder ?? 'All'}</option>
                    {field.options.map((option) => (
                      <option
                        key={`${field.name}-${option.value}`}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            if (field.type === 'date') {
              const value = (filters[field.name] as string) ?? '';
              return (
                <div key={field.name} className='min-w-[160px]'>
                  <label className='block text-sm text-neutral-600 mb-1'>
                    {field.label}
                  </label>
                  <input
                    type='date'
                    value={value}
                    onChange={(e) =>
                      handleFieldChange(
                        field.name,
                        e.target.value === '' ? undefined : e.target.value,
                      )
                    }
                    placeholder={field.placeholder}
                    className='w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
                  />
                </div>
              );
            }

            return null;
          })}

          <div className='flex items-center gap-2 ml-auto'>
            {sortOptions && sortOptions.length > 0 && (
              <>
                <label htmlFor='sort' className='text-sm text-neutral-600'>
                  Sort
                </label>
                <select
                  id='sort'
                  value={sort ?? sortOptions[0]?.value ?? ''}
                  onChange={(e) => onSortChange?.(e.target.value)}
                  className='border border-neutral-300 rounded px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
                >
                  {sortOptions.map((opt) => (
                    <option key={`sort-${opt.value}`} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </>
            )}

            <label htmlFor='limit' className='text-sm text-neutral-600'>
              Limit
            </label>
            <select
              id='limit'
              value={limit ?? limitOptions[0]}
              onChange={(e) => onLimitChange?.(Number(e.target.value))}
              className='border border-neutral-300 rounded px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
            >
              {(limitOptions.length ? limitOptions : DEFAULT_LIMIT_OPTIONS).map(
                (opt) => (
                  <option key={`limit-${opt}`} value={opt}>
                    {opt}
                  </option>
                ),
              )}
            </select>
            <button
              type='button'
              onClick={handleReset}
              className='border border-neutral-300 px-3 py-2 rounded text-sm text-neutral-700 hover:bg-neutral-50'
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsFiltersBar;
