# Quick Start Guide - Pagination

## 🚀 Quick Implementation

### Option 1: Existing Tables (Keep Client-Side Pagination)

**No changes needed!** Your existing tables will work as before, but with better UI.

The default pagination mode is `'client'`, so existing code like this continues to work:

```tsx
<AppTable
  data={students}
  itemsPerPage={10}
  // ... rest of your props
/>
```

### Option 2: Upgrade to Server-Side Pagination

#### Step 1: Update your component to use the hook

```tsx
'use client';

import { useServerPagination } from '@/hooks/useServerPagination';
import { useQuery } from '@tanstack/react-query';
import AppTable, { TableDataItem } from '@/components/table';

export default function StudentsPage() {
  // 1. Add the hook
  const { params, page, goToPage } = useServerPagination({
    defaultPage: 1,
    defaultLimit: 10,
  });

  // 2. Use params in your query
  const { data, isLoading } = useQuery(
    ['students', params], // Include params in query key
    () => fetchStudents(params), // Pass params to fetch function
  );

  return (
    <AppTable<Student>
      data={data?.data ?? []}
      headerColumns={['Name', 'Email', 'Course']}
      itemKey={({ item }) => item.id}
      // 3. Add these three props
      paginationMode='server'
      paginationMeta={data?.meta}
      onPageChange={goToPage}
      isLoading={isLoading}
      renderItem={({ item }) => (
        <>
          <TableDataItem>{item.name}</TableDataItem>
          <TableDataItem>{item.email}</TableDataItem>
          <TableDataItem>{item.course}</TableDataItem>
        </>
      )}
    />
  );
}
```

#### Step 2: Update your API service function

```typescript
// Before
export async function fetchStudents() {
  const response = await api.get('/students');
  return response.data;
}

// After - Accept pagination params
export async function fetchStudents(params: PaginationParams) {
  const response = await api.get('/students', { params });
  return response.data; // Should return { data: [], meta: {} }
}
```

#### Step 3: Backend should return this format

```typescript
{
  data: Student[],
  meta: {
    currentPage: 1,
    totalPages: 10,
    totalItems: 100,
    itemsPerPage: 10,
    // ✨ hasNextPage and hasPreviousPage are OPTIONAL!
    // The system calculates them automatically:
    // hasNextPage = currentPage < totalPages
    // hasPreviousPage = currentPage > 1
  }
}
```

**Minimal backend response:**

```typescript
// Your backend can send just this:
{
  data: Student[],
  meta: {
    currentPage: 1,
    totalPages: 10,
    totalItems: 100,
    itemsPerPage: 10
  }
}
```

The pagination system will automatically calculate the navigation flags! ✨

---

## 🔥 Server Pagination with Filters

```tsx
'use client';

import { useServerPagination } from '@/hooks/useServerPagination';
import { useState } from 'react';

export default function StudentsPage() {
  const { params, goToPage } = useServerPagination({ defaultLimit: 10 });
  const [courseFilter, setCourseFilter] = useState('');

  // Combine pagination and filters
  const queryParams = {
    ...params,
    course: courseFilter || undefined,
  };

  const { data, isLoading } = useQuery(['students', queryParams], () =>
    fetchStudents(queryParams),
  );

  const handleFilterChange = (value: string) => {
    setCourseFilter(value);
    goToPage(1); // Reset to page 1 when filter changes
  };

  return (
    <>
      {/* Filter Controls */}
      <select
        value={courseFilter}
        onChange={(e) => handleFilterChange(e.target.value)}
      >
        <option value=''>All Courses</option>
        <option value='math'>Math</option>
        <option value='science'>Science</option>
      </select>

      {/* Table */}
      <AppTable
        data={data?.data ?? []}
        paginationMode='server'
        paginationMeta={data?.meta}
        onPageChange={goToPage}
        isLoading={isLoading}
        // ... rest of props
      />
    </>
  );
}
```

---

## 📦 Import Cheatsheet

```typescript
// Components
import { Pagination } from '@/components/ui';
import AppTable, { TableDataItem } from '@/components/table';

// Hooks
import { useClientPagination } from '@/hooks/useClientPagination';
import { useServerPagination } from '@/hooks/useServerPagination';

// Types
import type {
  PaginationMeta,
  PaginatedResponse,
  PaginationParams,
} from '@/types/pagination.types';

// Utils
import {
  calculatePagination,
  getPaginatedData,
  buildSearchParams,
} from '@/utils/pagination';
```

---

## 🎯 Common Patterns

### Pattern 1: Simple Client Pagination

```tsx
<AppTable
  data={allStudents}
  itemsPerPage={10}
  paginationMode='client'
  // ...
/>
```

### Pattern 2: Server Pagination (Basic)

```tsx
const { params, goToPage } = useServerPagination();
const { data } = useQuery(['items', params], () => fetch(params));

<AppTable
  data={data?.data ?? []}
  paginationMode='server'
  paginationMeta={data?.meta}
  onPageChange={goToPage}
  // ...
/>;
```

### Pattern 3: Server Pagination + Filters

```tsx
const { params, goToPage, updateParams } = useServerPagination();
const [filters, setFilters] = useState({});

const queryParams = { ...params, ...filters };
const { data } = useQuery(['items', queryParams], () => fetch(queryParams));

// When filter changes:
const handleFilterChange = (newFilters) => {
  setFilters(newFilters);
  goToPage(1); // Reset to page 1
};
```

### Pattern 4: Custom Layout (No Table)

```tsx
const { paginatedData, currentPage, totalPages, goToPage } =
  useClientPagination({
    data: myData,
    initialItemsPerPage: 12,
  });

return (
  <>
    <div className='grid grid-cols-3 gap-4'>
      {paginatedData.map((item) => (
        <Card key={item.id}>{item.name}</Card>
      ))}
    </div>

    <Pagination
      page={currentPage}
      limit={12}
      totalItems={myData.length}
      onPageChange={goToPage}
    />
  </>
);
```

---

## 🐛 Troubleshooting

### "Pagination not showing"

- Check: Is `totalItems > 0`?
- Check: Is `paginationMode` not set to `'none'`?

### "Page doesn't change"

- For server mode: Did you pass `onPageChange` prop?
- For client mode: It should work automatically

### "URL not updating"

- Make sure you're using `useServerPagination`, not `useClientPagination`
- Check that you're in a client component (`'use client'`)

### "TypeScript errors with AppTable"

- Explicitly type your data: `<AppTable<Student> ... />`

---

## 📚 Full Documentation

See `docs/PAGINATION.md` for complete API reference and advanced usage.

See `src/components/pagination/examples.tsx` for working code examples.
