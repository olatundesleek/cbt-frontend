'use client';
import AppTable, { TableDataItem } from '@/components/table';
import { Badge, Button, Input } from '@/components/ui';
// import { Test, testData } from './data';
import { useAdminTest } from '@/features/tests/hooks/useTests';
import { errorLogger } from '@/lib/axios';
import { Test as TestType, AdminTestsResponse } from '@/types/tests.types';
type AdminTestItem = AdminTestsResponse['data'][number];
import { formatDate } from '../../../../../utils/helpers';
import FilterBar, { FilterState } from '@/components/tests/FilterBar';
import TestSummary from '@/components/tests/TestSummary';
import { useMemo, useState } from 'react';
import Modal from '@/components/modal';

export default function AdminTestPage() {
  const {
    data: adminTestsData,
    isLoading: isAdminTestLoading,
    error: adminTestError,
  } = useAdminTest();

  const [filter, setFilter] = useState<FilterState>({
    query: '',
  });

  const courses = useMemo(() => {
    const arr = (adminTestsData?.data ?? [])
      .map((d: AdminTestItem) => d.course?.title)
      .filter(Boolean) as string[];
    return Array.from(new Set(arr));
  }, [adminTestsData]);

  const classes = useMemo(() => {
    const arr = (adminTestsData?.data ?? []).flatMap(
      (d: AdminTestItem) =>
        d.course?.classes?.map((c) => c.className) ?? ([] as string[]),
    );
    return Array.from(new Set(arr));
  }, [adminTestsData]);

  const filteredData = useMemo(() => {
    const list = adminTestsData?.data ?? ([] as AdminTestItem[]);
    return list.filter((item: AdminTestItem) => {
      // search
      if (
        filter.query &&
        !item.title.toLowerCase().includes(filter.query.toLowerCase())
      )
        return false;
      // course
      if (filter.course && item.course?.title !== filter.course) return false;
      // class
      if (
        filter.className &&
        !(item.course?.classes ?? []).some(
          (c) => c.className === filter.className,
        )
      )
        return false;
      // status
      if (filter.status && item.testState !== filter.status) return false;
      // start date equality (yyyy-mm-dd)
      if (filter.startDate && item.startTime) {
        const d = new Date(item.startTime).toISOString().slice(0, 10);
        if (d !== filter.startDate) return false;
      }
      return true;
    });
  }, [adminTestsData, filter]);

  const tableHeaders = [
    'Test Title',
    'Class',
    'Course',
    'Test Type',
    'Teacher',
    'Status',
    'Start Date',
  ];

  const getStatusVariant = (status: TestType['testState']) => {
    if (status === 'completed') return 'primary';
    if (status === 'scheduled') return 'warning';
    return 'success';
  };

  if (adminTestError) {
    errorLogger(adminTestError);
  }

  return (
    <section className='flex flex-col lg:flex-row gap-6 w-full'>
      <div className='flex-1 flex flex-col gap-4'>
        <div className='flex justify-between w-full'>
          <h1 className='text-2xl font-semibold'>Manage Tests</h1>
          <div>
            <Button label='+ Create Test' />
          </div>
        </div>

        <FilterBar
          courses={courses}
          classes={classes}
          onChange={(s) => setFilter(s)}
        />

        <div>
          <AppTable
            isLoading={isAdminTestLoading}
            headerColumns={tableHeaders}
            data={filteredData}
            itemKey={({ item }) => `${item.id}`}
            centralizeLabel={false}
            renderItem={({ item }) => {
              return (
                <>
                  <TableDataItem>{item.title}</TableDataItem>
                  <TableDataItem>
                    {(item.course?.classes ?? [])
                      .map((el) => el.className)
                      .join(', ')}
                  </TableDataItem>
                  <TableDataItem>{item.course?.title}</TableDataItem>
                  <TableDataItem>{item.type}</TableDataItem>
                  <TableDataItem>
                    {(item.course?.classes ?? [])
                      .map((el) => el.teacherId)
                      .join(', ')}
                  </TableDataItem>
                  <TableDataItem className='capitalize'>
                    <Badge
                      variant={getStatusVariant(
                        item.testState as TestType['testState'],
                      )}
                    >
                      {item.testState}
                    </Badge>
                  </TableDataItem>
                  <TableDataItem>
                    {item.startTime ? formatDate(item?.startTime) : '--'}
                  </TableDataItem>
                </>
              );
            }}
          />
        </div>
      </div>

      <aside className='w-full lg:w-80'>
        <TestSummary tests={adminTestsData?.data ?? []} />
      </aside>

      {/* <Modal modalIsOpen={true} setModalIsOpen={() => false}>
        <form>
          <Input label='Test Title' />
          <Input label='Pass Mark' />
          <Input label='Attempts Allowed' />
          <Input label='Duration' />
          <Input />
        </form>
      </Modal> */}
    </section>
  );
}
