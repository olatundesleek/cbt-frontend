# Migration Guide: Converting Tables to Server-Side Pagination

## Overview

This guide walks you through converting existing client-side paginated tables to server-side pagination with filters.

## Example: Admin Students Page

### Before (Client-Side)

```tsx
'use client';
import AppTable, { TableDataItem } from '@/components/table';
import { useAdminStudents } from '@/features/students/hooks/useStudents';

export default function AdminStudentsPage() {
  const { data: studentsData, isLoading } = useAdminStudents();
  const students = studentsData?.data ?? [];

  return (
    <AppTable<Student>
      data={students}
      isLoading={isLoading}
      headerColumns={['Name', 'Email', 'Class', 'Created At']}
      itemKey={({ item }) => item.id}
      itemsPerPage={10}
      renderItem={({ item }) => (
        <>
          <TableDataItem>
            {item.firstname} {item.lastname}
          </TableDataItem>
          <TableDataItem>{item.email}</TableDataItem>
          <TableDataItem>{item.class?.name}</TableDataItem>
          <TableDataItem>{formatDate(item.createdAt)}</TableDataItem>
        </>
      )}
    />
  );
}
```

### After (Server-Side with Filters)

```tsx
'use client';
import { useMemo } from 'react';
import AppTable, { TableDataItem } from '@/components/table';
import { useAdminStudents } from '@/features/students/hooks/useStudents';
import { useServerPagination } from '@/hooks/useServerPagination';
import FilterBar from '@/components/tests/FilterBar';

export default function AdminStudentsPage() {
  // 1. Add server pagination hook
  const { params, page, goToPage } = useServerPagination({
    defaultPage: 1,
    defaultLimit: 10,
  });

  // 2. Update hook to accept params (you'll need to modify the hook)
  const { data: studentsData, isLoading } = useAdminStudents(params);

  const students = studentsData?.data ?? [];
  const meta = studentsData?.meta;

  return (
    <div className="space-y-4">
      {/* 3. Add filter component if needed */}
      <FilterBar
        onFilterChange={(filters) => {
          updateParams({ ...filters, page: 1 });
        }}
      />

      {/* 4. Update AppTable */}
      <AppTable<Student>
        data={students}
        isLoading={isLoading}
        headerColumns={['Name', 'Email', 'Class', 'Created At']}
        itemKey={({ item }) => item.id}

        {/* Add these three props */}
        paginationMode="server"
        paginationMeta={meta}
        onPageChange={goToPage}

        renderItem={({ item }) => (
          <>
            <TableDataItem>{item.firstname} {item.lastname}</TableDataItem>
            <TableDataItem>{item.email}</TableDataItem>
            <TableDataItem>{item.class?.name}</TableDataItem>
            <TableDataItem>{formatDate(item.createdAt)}</TableDataItem>
          </>
        )}
      />
    </div>
  );
}
```

## Step-by-Step Migration

### Step 1: Update the Hook

**File**: `src/features/students/hooks/useStudents.ts`

```tsx
// Before
export function useAdminStudents() {
  return useQuery({
    queryKey: ['admin-students'],
    queryFn: () => studentsService.getAdminStudents(),
  });
}

// After
import type { PaginationParams } from '@/types/pagination.types';

export function useAdminStudents(params?: PaginationParams) {
  return useQuery({
    queryKey: ['admin-students', params],
    queryFn: () => studentsService.getAdminStudents(params),
  });
}
```

### Step 2: Update the Service

**File**: `src/services/studentsService.ts`

```tsx
// Before
async getAdminStudents() {
  const response = await api.get('/admin/students');
  return response.data;
}

// After
import type { PaginationParams, PaginatedResponse } from '@/types/pagination.types';
import type { Student } from '@/types/students.types';

async getAdminStudents(params?: PaginationParams): Promise<PaginatedResponse<Student>> {
  const response = await api.get('/admin/students', { params });
  return response.data;
}
```

### Step 3: Update Backend API

**Backend should return**:

```json
{
  "data": [
    {
      "id": 1,
      "firstname": "John",
      "lastname": "Doe",
      "email": "john@example.com",
      "class": { "name": "Class A" },
      "createdAt": "2024-01-01T00:00:00Z"
    }
    // ... more students
  ],
  "meta": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### Step 4: Add Filters (Optional)

```tsx
import { useServerPagination } from '@/hooks/useServerPagination';
import { useState } from 'react';

export default function AdminStudentsPage() {
  const { params, goToPage, updateParams } = useServerPagination();
  const [filters, setFilters] = useState({
    className: '',
    search: '',
  });

  // Combine pagination and filters
  const queryParams = useMemo(
    () => ({
      ...params,
      className: filters.className || undefined,
      search: filters.search || undefined,
    }),
    [params, filters],
  );

  const { data, isLoading } = useAdminStudents(queryParams);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    goToPage(1); // Reset to page 1 when filters change
  };

  return (
    <>
      {/* Filter UI */}
      <div className='flex gap-4'>
        <input
          placeholder='Search students...'
          value={filters.search}
          onChange={(e) =>
            handleFilterChange({ ...filters, search: e.target.value })
          }
        />
        <select
          value={filters.className}
          onChange={(e) =>
            handleFilterChange({ ...filters, className: e.target.value })
          }
        >
          <option value=''>All Classes</option>
          <option value='Class A'>Class A</option>
          <option value='Class B'>Class B</option>
        </select>
      </div>

      <AppTable
        data={data?.data ?? []}
        paginationMode='server'
        paginationMeta={data?.meta}
        onPageChange={goToPage}
        // ... rest of props
      />
    </>
  );
}
```

## Common Migration Patterns

### Pattern 1: Simple List (No Filters)

```tsx
const { params, goToPage } = useServerPagination({ defaultLimit: 20 });
const { data, isLoading } = useMyData(params);

<AppTable
  data={data?.data ?? []}
  paginationMode='server'
  paginationMeta={data?.meta}
  onPageChange={goToPage}
  isLoading={isLoading}
/>;
```

### Pattern 2: With Search

```tsx
const { params, goToPage } = useServerPagination();
const [search, setSearch] = useState('');

const queryParams = { ...params, search: search || undefined };
const { data, isLoading } = useMyData(queryParams);

const handleSearch = (value: string) => {
  setSearch(value);
  goToPage(1);
};
```

### Pattern 3: With Multiple Filters

```tsx
const { params, goToPage } = useServerPagination();
const [filters, setFilters] = useState<FilterState>({});

const queryParams = useMemo(
  () => ({
    ...params,
    ...Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '' && v !== undefined),
    ),
  }),
  [params, filters],
);

const { data, isLoading } = useMyData(queryParams);
```

### Pattern 4: With Sort

```tsx
const { params, goToPage, setSort } = useServerPagination({
  defaultSortBy: 'createdAt',
  defaultSortOrder: 'desc',
});

const { data, isLoading } = useMyData(params);

// In table header
<th
  onClick={() => setSort('name', params.sortOrder === 'asc' ? 'desc' : 'asc')}
>
  Name {params.sortBy === 'name' && (params.sortOrder === 'asc' ? '↑' : '↓')}
</th>;
```

## Checklist for Each Page

- [ ] Import `useServerPagination` hook
- [ ] Add hook with default values
- [ ] Update data fetching hook to accept params
- [ ] Update service function signature
- [ ] Add `paginationMode="server"` to AppTable
- [ ] Pass `paginationMeta` from response
- [ ] Add `onPageChange` callback
- [ ] Update backend endpoint (if needed)
- [ ] Test pagination works
- [ ] Test with filters (if applicable)
- [ ] Test URL synchronization
- [ ] Test browser back/forward buttons

## Backend Query Parameters

Your backend should expect these query params:

```
GET /api/admin/students?page=2&limit=10&sortBy=name&sortOrder=asc&className=ClassA&search=john
```

Parameters:

- `page`: Page number (1-indexed)
- `limit`: Items per page
- `sortBy`: Field to sort by
- `sortOrder`: 'asc' or 'desc'
- Any additional filter params

## Testing Your Migration

1. **Test pagination**: Click through pages, verify correct data
2. **Test URL sync**: Check URL updates, copy/paste URL works
3. **Test filters**: Apply filters, verify page resets to 1
4. **Test empty results**: Apply filters that return 0 results
5. **Test browser navigation**: Back/forward buttons work
6. **Test loading states**: Verify spinners show during fetch
7. **Test error states**: Handle API errors gracefully

## Performance Comparison

### Before (Client-Side)

- Initial load: Fetches ALL data (e.g., 1000 students)
- Memory usage: High (all data in memory)
- Navigation: Instant (no network)
- Filtering: Client-side (fast but limited)

### After (Server-Side)

- Initial load: Fetches only 10-20 items
- Memory usage: Low (only current page)
- Navigation: ~100-300ms (network delay)
- Filtering: Server-side (powerful queries)

## Troubleshooting

### Issue: "Pagination not showing"

**Fix**: Check that `data?.meta` exists and has proper structure

### Issue: "Page doesn't change"

**Fix**: Verify `onPageChange={goToPage}` is passed to AppTable

### Issue: "URL not updating"

**Fix**: Ensure component has `'use client'` directive

### Issue: "Filters not working"

**Fix**: Make sure to call `goToPage(1)` when filters change

### Issue: "TypeScript errors"

**Fix**: Properly type your data: `<AppTable<Student> />`

## Need Help?

- Check `docs/PAGINATION.md` for full API reference
- See `docs/PAGINATION_QUICKSTART.md` for quick examples
- Look at `src/components/pagination/examples.tsx` for working code
- Review existing implementations in `src/app/admin/(dashboard)/*`
