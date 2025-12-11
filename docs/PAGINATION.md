# Pagination System Documentation

## Overview

This comprehensive pagination system provides both **client-side** and **server-side** pagination capabilities for the CBT application. It includes reusable components, hooks, utilities, and TypeScript types.

## Architecture

```
src/
├── components/
│   ├── ui/
│   │   └── Pagination.tsx          # Reusable pagination UI component
│   ├── table/
│   │   └── index.tsx                # AppTable with pagination support
│   └── pagination/
│       └── examples.tsx             # Usage examples
├── hooks/
│   ├── useClientPagination.ts      # Client-side pagination hook
│   └── useServerPagination.ts      # Server-side pagination hook
├── types/
│   └── pagination.types.ts         # TypeScript type definitions
└── utils/
    └── pagination.ts                # Pagination utility functions
```

---

## Components

### 1. `<Pagination />` Component

A fully-featured, reusable pagination component with extensive customization options.

#### Props

```typescript
interface PaginationProps {
  // Required
  page: number; // Current page (1-indexed)
  limit: number; // Items per page
  totalItems: number; // Total number of items
  onPageChange?: (page: number) => void;

  // Display Options
  showPageNumbers?: boolean; // Show numbered page buttons (default: true)
  showFirstLast?: boolean; // Show first/last buttons (default: true)
  showPrevNext?: boolean; // Show prev/next buttons (default: true)
  showPageSize?: boolean; // Show page size selector (default: false)
  showTotal?: boolean; // Show total count (default: true)
  showPageInfo?: boolean; // Show "Page X of Y" (default: false)
  pageRangeDisplayed?: number; // Number of page buttons (default: 5)
  pageSizeOptions?: number[]; // Page size options (default: [5,10,20,50,100])

  // Other
  className?: string; // Custom CSS classes
  disabled?: boolean; // Disable all controls (default: false)
}
```

#### Usage

```tsx
import { Pagination } from '@/components/ui';

<Pagination
  page={currentPage}
  limit={10}
  totalItems={100}
  onPageChange={(page) => setCurrentPage(page)}
  showPageNumbers={true}
  showTotal={true}
/>;
```

---

### 2. `<AppTable />` Component

Enhanced table component with built-in pagination support.

#### New Props

```typescript
interface AppTableProps<T> {
  // ... existing props ...

  // Pagination Configuration
  paginationMode?: 'client' | 'server' | 'none'; // Default: 'client'
  itemsPerPage?: number; // Default: 10
  paginationMeta?: PaginationMeta; // For server mode
  onPageChange?: (page: number) => void; // For server mode
}
```

#### Usage - Client-Side Pagination

```tsx
import AppTable, { TableDataItem } from '@/components/table';

<AppTable<Student>
  data={allStudents}
  headerColumns={['Name', 'Email', 'Course']}
  itemKey={({ item }) => item.id}
  paginationMode='client' // Client-side pagination
  itemsPerPage={10}
  renderItem={({ item }) => (
    <>
      <TableDataItem>{item.name}</TableDataItem>
      <TableDataItem>{item.email}</TableDataItem>
      <TableDataItem>{item.course}</TableDataItem>
    </>
  )}
/>;
```

#### Usage - Server-Side Pagination

```tsx
import AppTable, { TableDataItem } from '@/components/table';
import { useServerPagination } from '@/hooks/useServerPagination';

function MyComponent() {
  const { page, goToPage } = useServerPagination({ defaultLimit: 10 });
  const { data: response, isLoading } = useQuery(['students', page], () =>
    fetchStudents(page),
  );

  return (
    <AppTable<Student>
      data={response?.data ?? []}
      headerColumns={['Name', 'Email', 'Course']}
      itemKey={({ item }) => item.id}
      paginationMode='server' // Server-side pagination
      paginationMeta={response?.meta} // Pass server metadata
      onPageChange={goToPage} // Handle page changes
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

---

## Hooks

### 1. `useClientPagination`

Manages pagination state for client-side data.

#### API

```typescript
const {
  paginatedData, // Current page data
  currentPage, // Current page number
  itemsPerPage, // Items per page
  totalPages, // Total pages
  startIndex, // Start index in full dataset
  endIndex, // End index in full dataset
  hasNextPage, // Boolean
  hasPreviousPage, // Boolean
  goToPage, // (page: number) => void
  nextPage, // () => void
  previousPage, // () => void
  setItemsPerPage, // (itemsPerPage: number) => void
} = useClientPagination({
  data: myData,
  initialPage: 1,
  initialItemsPerPage: 10,
});
```

#### Example

```tsx
import { useClientPagination } from '@/hooks/useClientPagination';

function StudentList() {
  const students = [
    /* ... */
  ];

  const { paginatedData, currentPage, totalPages, goToPage } =
    useClientPagination({
      data: students,
      initialPage: 1,
      initialItemsPerPage: 10,
    });

  return (
    <div>
      {paginatedData.map((student) => (
        <StudentCard key={student.id} student={student} />
      ))}

      <Pagination
        page={currentPage}
        limit={10}
        totalItems={students.length}
        onPageChange={goToPage}
      />
    </div>
  );
}
```

---

### 2. `useServerPagination`

Manages pagination state with URL synchronization for server-side data fetching.

#### API

```typescript
const {
  params, // Current pagination params from URL
  page, // Current page number
  limit, // Current items per page
  updateParams, // (newParams: Partial<PaginationParams>) => void
  goToPage, // (page: number) => void
  setLimit, // (limit: number) => void
  setSort, // (sortBy: string, sortOrder?: 'asc' | 'desc') => void
  reset, // () => void - Reset to defaults
} = useServerPagination({
  defaultPage: 1,
  defaultLimit: 10,
  defaultSortBy: 'name',
  defaultSortOrder: 'asc',
});
```

#### Example - Basic

```tsx
import { useServerPagination } from '@/hooks/useServerPagination';
import { useQuery } from '@tanstack/react-query';

function StudentList() {
  const { params, page, goToPage } = useServerPagination({
    defaultPage: 1,
    defaultLimit: 10,
  });

  const { data, isLoading } = useQuery(['students', params], () =>
    fetchStudents(params),
  );

  return (
    <AppTable
      data={data?.data ?? []}
      paginationMode='server'
      paginationMeta={data?.meta}
      onPageChange={goToPage}
      isLoading={isLoading}
      // ... other props
    />
  );
}
```

#### Example - With Filters

```tsx
import { useServerPagination } from '@/hooks/useServerPagination';
import { useQuery } from '@tanstack/react-query';

function StudentList() {
  const { params, updateParams, goToPage } = useServerPagination();
  const [courseFilter, setCourseFilter] = useState('');

  // Combine pagination and filter params
  const queryParams = {
    ...params,
    course: courseFilter || undefined,
  };

  const { data, isLoading } = useQuery(['students', queryParams], () =>
    fetchStudents(queryParams),
  );

  const handleFilterChange = (course: string) => {
    setCourseFilter(course);
    goToPage(1); // Reset to page 1 when filter changes
  };

  return (
    <>
      <select onChange={(e) => handleFilterChange(e.target.value)}>
        <option value=''>All Courses</option>
        <option value='math'>Math</option>
        <option value='science'>Science</option>
      </select>

      <AppTable
        data={data?.data ?? []}
        paginationMode='server'
        paginationMeta={data?.meta}
        onPageChange={goToPage}
        isLoading={isLoading}
        // ... other props
      />
    </>
  );
}
```

---

## Server-Side Implementation Guide

### Backend API Response Format

**Good news:** `hasNextPage` and `hasPreviousPage` are **optional**! The system automatically calculates them if not provided.

```typescript
// Backend can return the minimal response:
{
  data: T[],                    // Array of items for current page
  meta: {
    currentPage: number,        // Current page number (1-indexed)
    totalPages: number,         // Total number of pages
    totalItems: number,         // Total number of items
    itemsPerPage: number,       // Items per page
    // hasNextPage and hasPreviousPage are calculated automatically!
  }
}
```

Or if your backend provides them, they'll be used as-is:

```typescript
{
  data: T[],
  meta: {
    currentPage: number,
    totalPages: number,
    totalItems: number,
    itemsPerPage: number,
    hasNextPage?: boolean,        // Optional - will be calculated if missing
    hasPreviousPage?: boolean,    // Optional - will be calculated if missing
  }
}
```

**How it works:** The `normalizePaginationMeta()` utility function automatically calculates:
- `hasNextPage = currentPage < totalPages`
- `hasPreviousPage = currentPage > 1`

### Backend Query Parameters

The frontend will send these query parameters:

```
GET /api/students?page=2&limit=10&sortBy=name&sortOrder=asc
```

- `page`: Current page number (1-indexed)
- `limit`: Number of items per page
- `sortBy`: Field to sort by
- `sortOrder`: 'asc' or 'desc'

### Example Backend (Node.js/Express)

```typescript
app.get('/api/students', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortBy = req.query.sortBy || 'id';
  const sortOrder = req.query.sortOrder || 'asc';

  const offset = (page - 1) * limit;

  const [students, totalItems] = await Promise.all([
    db.students.findMany({
      skip: offset,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    db.students.count(),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  res.json({
    data: students,
    meta: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  });
});
```

---

## Utility Functions

Located in `src/utils/pagination.ts`:

```typescript
// Calculate pagination metadata
calculatePagination(currentPage, itemsPerPage, totalItems);

// Get paginated slice of data
getPaginatedData(data, page, limit);

// Build URL search params
buildSearchParams(params);

// Parse pagination params from URL
parsePaginationParams(searchParams);

// Validate page number
validatePage(page, totalPages);

// Generate page numbers for display
generatePageNumbers(currentPage, totalPages, rangeDisplayed);

// Format info text
formatPaginationInfo(startIndex, endIndex, totalItems);

// Merge filter and pagination params
mergeFilterParams(filters, pagination);
```

---

## Migration Guide

### Migrating Existing Tables

#### Before (Old ReactPaginate)

```tsx
<AppTable
  data={students}
  itemsPerPage={5}
  // ... other props
/>
```

#### After (New Pagination)

```tsx
// Option 1: Keep default client-side pagination
<AppTable
  data={students}
  itemsPerPage={10}
  paginationMode='client' // Optional, this is default
  // ... other props
/>;

// Option 2: Switch to server-side pagination
const { page, goToPage } = useServerPagination({ defaultLimit: 10 });
const { data } = useQuery(['students', page], () => fetchStudents(page));

<AppTable
  data={data?.data ?? []}
  paginationMode='server'
  paginationMeta={data?.meta}
  onPageChange={goToPage}
  // ... other props
/>;
```

---

## Best Practices

### When to Use Client-Side Pagination

✅ Small datasets (< 1000 items)
✅ Data already loaded in memory
✅ No server-side filtering/sorting needed
✅ Faster user experience (no loading states)

### When to Use Server-Side Pagination

✅ Large datasets (> 1000 items)
✅ Server-side filtering and sorting
✅ Reduced memory usage
✅ Real-time data updates

### Performance Tips

1. **Client-side**: Use `useMemo` for expensive data transformations
2. **Server-side**: Debounce filter inputs to reduce API calls
3. **URL Sync**: Always use `useServerPagination` for shareable links
4. **Loading States**: Show loading indicators during data fetching

---

## TypeScript Types

All types are exported from `@/types/pagination.types`:

```typescript
import type {
  PaginationMeta,
  PaginatedResponse,
  PaginationConfig,
  PaginationParams,
  ClientPaginationState,
  ServerPaginationState,
  PaginationDisplayOptions,
  PaginationProps,
} from '@/types/pagination.types';
```

---

## Examples

Full working examples are available in:

- `src/components/pagination/examples.tsx`

View the examples file for:

- Client-side pagination with AppTable
- Client-side pagination with hook
- Server-side pagination with AppTable
- Server-side pagination with filters
- Standalone Pagination component
- No pagination mode

---

## Troubleshooting

### Issue: Pagination not showing

**Solution**: Ensure `totalItems > 0` and `paginationMode !== 'none'`

### Issue: Page resets when filter changes

**Solution**: This is intentional. Use `goToPage(1)` when filters change.

### Issue: URL not syncing

**Solution**: Ensure you're using `useServerPagination` hook, not `useClientPagination`.

### Issue: TypeScript errors with generics

**Solution**: Explicitly type your data:

```tsx
<AppTable<Student> ... />
```

---

## Contributing

When adding new pagination features:

1. Update types in `pagination.types.ts`
2. Add utilities to `pagination.ts`
3. Update components/hooks as needed
4. Add examples to `examples.tsx`
5. Update this README

---

## Support

For questions or issues:

- Check the examples in `src/components/pagination/examples.tsx`
- Review this documentation
- Check existing table implementations in `src/app/admin/(dashboard)/*`
