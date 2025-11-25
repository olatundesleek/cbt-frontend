'use client';
import AppTable, { TableDataItem } from '@/components/table';
import { Button } from '@/components/ui';
import { useAdminStudents } from '@/features/students/hooks/useStudents';
import FilterBar, { FilterState } from '@/components/tests/FilterBar';
import { formatDate } from '../../../../../utils/helpers';
import StudentSummary from '@/components/tests/StudentSummary';
import { useMemo, useState } from 'react';
import type { Student } from '@/types/students.types';

export default function AdminStudentsPage() {
  const { data: adminStudentsData, isLoading: isStudentsLoading } =
    useAdminStudents();

  const [filter, setFilter] = useState<FilterState>({ query: '' });

  const students = useMemo<Student[]>(
    () => adminStudentsData?.data ?? [],
    [adminStudentsData],
  );

  const classes = useMemo(() => {
    const arr = students
      .map((s) => s.class?.className)
      .filter((v): v is string => !!v);
    return Array.from(new Set(arr));
  }, [students]);

  const courses = useMemo(() => {
    const arr = students.flatMap((s) =>
      s.class.courses.map((c) => c.title).filter((v): v is string => !!v),
    );
    return Array.from(new Set(arr));
  }, [students]);

  const filteredData = useMemo(() => {
    return students.filter((s) => {
      if (filter.query) {
        const q = filter.query.toLowerCase();
        const fullName = `${s.firstname} ${s.lastname}`.toLowerCase();
        if (
          !fullName.includes(q) &&
          !(s.username ?? '').toLowerCase().includes(q)
        )
          return false;
      }
      if (filter.course && (s.class.courses ?? []).length) {
        if (!(s.class.courses ?? []).some((c) => c.title === filter.course))
          return false;
      }
      if (filter.className) {
        if (s.class?.className !== filter.className) return false;
      }
      if (filter.startDate && s.class?.createdAt) {
        const d = new Date(s.class.createdAt).toISOString().slice(0, 10);
        if (d !== filter.startDate) return false;
      }
      return true;
    });
  }, [students, filter]);

  const tableHeaders = ['Name', 'Username', 'Class', 'Courses', 'Created At'];

  return (
    <section className='flex flex-col lg:flex-row gap-6 w-full'>
      <div className='flex-1 flex flex-col gap-4'>
        <div className='flex justify-between w-full'>
          <h1 className='text-2xl font-semibold'>Manage Students</h1>
          <div>
            <Button label='+ Create Student' />
          </div>
        </div>

        <FilterBar
          courses={courses}
          classes={classes}
          onChange={(s) => setFilter(s)}
        />

        <div>
          <AppTable
            isLoading={isStudentsLoading}
            headerColumns={tableHeaders}
            data={filteredData}
            itemKey={({ item }) => `${item.username}`}
            centralizeLabel={false}
            renderItem={({ item }) => {
              return (
                <>
                  <TableDataItem>
                    {item.firstname} {item.lastname}
                  </TableDataItem>
                  <TableDataItem>{item.username ?? '--'}</TableDataItem>
                  <TableDataItem>{item.class?.className ?? '--'}</TableDataItem>
                  <TableDataItem>
                    {(item.class.courses ?? [])
                      .map((c) => c.title)
                      .join(', ') || '--'}
                  </TableDataItem>
                  <TableDataItem>
                    {item.class?.createdAt
                      ? formatDate(item.class.createdAt)
                      : '--'}
                  </TableDataItem>
                </>
              );
            }}
          />
        </div>
      </div>

      <aside className='w-full lg:w-80'>
        <StudentSummary students={students} />
      </aside>
    </section>
  );
}
