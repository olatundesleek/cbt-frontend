'use client';
import AppTable, { TableDataItem } from '@/components/table';
import { Badge, Button } from '@/components/ui';
import Input from '@/components/ui/input';
import { useAdminTest } from '@/features/tests/hooks/useTests';
import { Test as TestType, AdminTestsResponse } from '@/types/tests.types';
import { useServerPagination } from '@/hooks/useServerPagination';
type AdminTestItem = AdminTestsResponse['data']['data'][number];
import { formatDate } from '../../../../../utils/helpers';
import TestSummary from '@/components/tests/TestSummary';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ResultsFiltersBar, {
  type ResultFilterField,
} from '@/features/results/components/ResultsFiltersBar';
import type { TestType as TestTypeConst } from '@/lib/constants';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import useCreateTest from '@/features/tests/hooks/useCreateTest';
import useUpdateTest from '@/features/tests/hooks/useUpdateTest';
import Modal from '@/components/modal';
import useDeleteTest from '@/features/tests/hooks/useDeleteTest';
import {
  useGetCourses,
  useGetQuestionBank,
} from '@/features/dashboard/queries/useDashboard';
import { AllCourses, AllQuestionBank } from '@/types/dashboard.types';
import { useToggleResultVisibility } from '@/hooks/useResultCourses';
import { useUserStore } from '@/store/useUserStore';
import getErrorDetails from '@/utils/getErrorDetails';

const createClassSchema = Yup.object({
  title: Yup.string().required('Test title is required'),
  type: Yup.string().required('Test type is required'),
  testState: Yup.string().required('Test state is required'),
  courseId: Yup.string().required('Course is required'),
  bankId: Yup.string().required('Question bank is required'),
  duration: Yup.number()
    .transform((value, originalValue) =>
      originalValue === '' ? NaN : Number(originalValue),
    )
    .typeError('Duration must be a number')
    .required('Duration is required')
    .min(1),
  attemptsAllowed: Yup.number()
    .transform((value, originalValue) =>
      originalValue === '' ? NaN : Number(originalValue),
    )
    .typeError('Attempts allowed must be a number')
    .required('Attempts allowed is required')
    .min(1),
  passMark: Yup.number()
    .transform((value, originalValue) =>
      originalValue === '' ? NaN : Number(originalValue),
    )
    .typeError('Pass mark must be a number')
    .required('Pass mark is required')
    .min(0)
    .max(100),
  startDate: Yup.string().required('Start date is required'),
  startTime: Yup.string().required('Start time is required'),
  endDate: Yup.string().required('End date is required'),
  endTime: Yup.string().required('End time is required'),
});
function UpdateForm({
  coursesData,
  allQuestionBank,
  initialData,
  onClose,
  role = 'teacher',
}: {
  coursesData: AllCourses[];
  allQuestionBank: { data: AllQuestionBank[] } | undefined;
  initialData: AdminTestItem | null;
  onClose?: () => void;
  role?: 'admin' | 'teacher' | 'student';
}) {
  type FormValues = {
    title: string;
    type: string;
    testState: string;
    courseId: string;
    bankId: string;
    duration: number;
    attemptsAllowed: number;
    passMark: number;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(createClassSchema),
    defaultValues: {
      title: '',
      type: 'TEST',
      testState: 'scheduled',
      courseId: '',
      bankId: '',
      duration: 60,
      attemptsAllowed: 1,
      passMark: 50,
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
    },
  });

  const updateMutation = useUpdateTest();

  // populate form when initialData changes
  useEffect(() => {
    if (!initialData) return;

    setValue('title', initialData.title ?? '');
    setValue('type', initialData.type ?? 'TEST');
    setValue('testState', initialData.testState ?? 'scheduled');
    setValue('duration', initialData.duration ?? 60);
    setValue('attemptsAllowed', initialData.attemptsAllowed ?? 1);
    setValue('passMark', initialData.passMark ?? 50);
    setValue('courseId', initialData.courseId ? `${initialData.courseId}` : '');
    setValue('bankId', initialData.bankId ? `${initialData.bankId}` : '');

    if (initialData.startTime) {
      const s = new Date(initialData.startTime);
      setValue('startDate', s.toISOString().slice(0, 10));
      setValue('startTime', s.toISOString().slice(11, 16));
    } else {
      setValue('startDate', '');
      setValue('startTime', '');
    }

    if (initialData.endTime) {
      const e = new Date(initialData.endTime);
      setValue('endDate', e.toISOString().slice(0, 10));
      setValue('endTime', e.toISOString().slice(11, 16));
    } else {
      setValue('endDate', '');
      setValue('endTime', '');
    }
  }, [initialData, setValue]);

  const selectedCourseId = watch('courseId');

  useEffect(() => {
    if (!selectedCourseId) {
      setValue('bankId', '');
      return;
    }

    const banksForCourse = (allQuestionBank?.data ?? []).filter(
      (b) => `${b.courseId}` === `${selectedCourseId}`,
    );
    if (banksForCourse.length) setValue('bankId', `${banksForCourse[0].id}`);
  }, [selectedCourseId, allQuestionBank, setValue]);

  const onSubmit = async (data: FormValues) => {
    if (!initialData) return toast.error('Missing test data');
    if (!data.courseId) return toast.error('Please select a course');
    if (!data.bankId) return toast.error('Please select a question bank');

    const startTime =
      data.startDate && data.startTime
        ? new Date(`${data.startDate}T${data.startTime}`).toISOString()
        : null;
    const endTime =
      data.endDate && data.endTime
        ? new Date(`${data.endDate}T${data.endTime}`).toISOString()
        : null;

    const payload = {
      title: data.title,
      type: data.type as TestTypeConst,
      testState: data.testState,
      startTime,
      endTime,
      duration: Number(data.duration),
      courseId: Number(data.courseId),
      bankId: Number(data.bankId),
      attemptsAllowed: Number(data.attemptsAllowed),
      passMark: Number(data.passMark),
    };

    try {
      await updateMutation.mutateAsync({ id: initialData.id, payload });
      if (onClose) onClose();
    } catch {
      // handled in hook onError
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <Input
        label='Test Title'
        name='title'
        placeholder='MAT 101'
        type='text'
        hookFormRegister={register}
        errorText={errors.title?.message as string}
      />

      <div className='flex gap-4'>
        <div className='flex flex-col gap-1 w-full'>
          <label htmlFor='testType'>
            <span className='text-sm text-neutral-600'> Test Type</span>

            <select
              id='testType'
              {...register('type', { required: 'Test type is required' })}
              className='block w-full rounded-md border border-neutral-300 p-1 h-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-background text-foreground caret-foreground'
            >
              <option value='TEST'>TEST</option>
              <option value='EXAM'>EXAM</option>
              <option value='PRACTICE'>PRACTICE</option>
            </select>
            {errors.type && (
              <small className='text-error-500'>{errors.type.message}</small>
            )}
          </label>
        </div>

        <div className='flex flex-col gap-1 w-full'>
          <label htmlFor='testState'>
            <span className='text-sm text-neutral-600'>Test State</span>

            <select
              id='testState'
              {...register('testState', { required: 'Test state is required' })}
              className='block w-full rounded-md border border-neutral-300 p-1 h-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-background text-foreground caret-foreground disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100'
              disabled={role !== 'admin'}
            >
              <option value='active'>ACTIVE</option>
              <option value='scheduled'>SCHEDULED</option>
              <option value='completed'>COMPLETED</option>
            </select>
            {errors.testState && (
              <small className='text-error-500'>
                {errors.testState.message}
              </small>
            )}
          </label>
        </div>
      </div>

      <div>
        <span className='text-sm text-neutral-600'>Select Courses</span>
        <div className='w-full flex gap-4 flex-wrap'>
          {coursesData?.map((course) => (
            <label
              htmlFor={`course-${course.id}`}
              key={course.id}
              className='flex gap-2'
            >
              {course.title}
              <input
                key={course.id}
                {...register('courseId', { required: 'Course is required' })}
                type='radio'
                id={`course-${course.id}`}
                value={`${course.id}`}
              />
            </label>
          ))}
          {errors.courseId && (
            <div className='text-sm text-error-500'>
              {errors.courseId.message}
            </div>
          )}
        </div>
      </div>

      <div>
        <span className='text-sm text-neutral-600'>Question Bank</span>
        {!selectedCourseId ? (
          <div className='text-sm text-neutral-500'>
            Select a course to choose a bank
          </div>
        ) : (
          <div className='w-full flex gap-4 flex-wrap'>
            {(allQuestionBank?.data ?? [])
              .filter((b) => `${b.courseId}` === `${selectedCourseId}`)
              .map((bank) => (
                <label key={bank.id} className='flex gap-2 items-start'>
                  <input
                    {...register('bankId', {
                      required: 'Question bank is required',
                    })}
                    type='radio'
                    value={`${bank.id}`}
                    className='mt-1'
                  />
                  <div className='flex flex-col'>
                    <span className='font-medium'>{bank.questionBankName}</span>
                    <small className='text-neutral-500'>
                      {bank._count?.questions ?? 0} questions
                    </small>
                  </div>
                </label>
              ))}
            {errors.bankId && (
              <div className='text-sm text-error-500'>
                {errors.bankId.message}
              </div>
            )}
            {(allQuestionBank?.data ?? []).filter(
              (b) => `${b.courseId}` === `${selectedCourseId}`,
            ).length === 0 && (
              <div className='text-sm text-error-500'>
                No question banks available for this course
              </div>
            )}
          </div>
        )}
      </div>

      <div className='flex gap-4'>
        <Input
          label='Duration(mins)'
          name='duration'
          placeholder='20'
          type='number'
          hookFormRegister={register}
          errorText={errors.duration?.message as string}
        />
        <Input
          label='Attempts Allowed'
          name='attemptsAllowed'
          placeholder='2'
          type='number'
          hookFormRegister={register}
          errorText={errors.attemptsAllowed?.message as string}
        />
        <Input
          label='Pass Mark'
          name='passMark'
          placeholder='50'
          type='number'
          hookFormRegister={register}
          errorText={errors.passMark?.message as string}
        />
      </div>

      <div className='flex gap-4'>
        <Input
          label='Start Date'
          name='startDate'
          type='date'
          hookFormRegister={register}
          errorText={errors.startDate?.message as string}
        />
        <Input
          label='End Date'
          name='endDate'
          hookFormRegister={register}
          type='date'
          errorText={errors.startDate?.message as string}
        />
        <Input
          label='Start Time'
          type='time'
          name='startTime'
          hookFormRegister={register}
          errorText={errors.startTime?.message as string}
        />
        <Input
          label='End Time'
          name='endTime'
          type='time'
          hookFormRegister={register}
          errorText={errors.endTime?.message as string}
        />
      </div>

      <div className='w-full flex justify-end'>
        <div className='w-fit'>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update test'}
          </Button>
        </div>
      </div>
    </form>
  );
}

function AddTestForm({
  coursesData,
  allQuestionBank,
  isCoursesDataLoading,
  questionBankLoading,
  role = 'teacher',
}: {
  coursesData: AllCourses[];
  allQuestionBank?: { data: AllQuestionBank[] };
  isCoursesDataLoading?: boolean;
  questionBankLoading?: boolean;
  role?: 'admin' | 'teacher' | 'student';
}) {
  const createTestMutation = useCreateTest();

  type FormValues = {
    title: string;
    type: string;
    testState: string;
    courseId: string;
    bankId: string;
    duration: number;
    attemptsAllowed: number;
    passMark: number;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: yupResolver(createClassSchema),
    defaultValues: {
      title: '',
      type: 'TEST',
      testState: 'scheduled',
      courseId: '',
      bankId: '',
      duration: 60,
      attemptsAllowed: 1,
      passMark: 50,
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
    },
  });

  const selectedCourseId = watch('courseId');

  useEffect(() => {
    if (!selectedCourseId) {
      setValue('bankId', '');
      return;
    }

    const banksForCourse = (allQuestionBank?.data ?? []).filter(
      (b) => `${b.courseId}` === `${selectedCourseId}`,
    );
    if (banksForCourse.length) setValue('bankId', `${banksForCourse[0].id}`);
  }, [selectedCourseId, allQuestionBank, setValue]);

  const onSubmit = async (data: FormValues) => {
    if (!data.courseId) return toast.error('Please select a course');
    if (!data.bankId) return toast.error('Please select a question bank');

    const startTime =
      data.startDate && data.startTime
        ? new Date(`${data.startDate}T${data.startTime}`).toISOString()
        : null;
    const endTime =
      data.endDate && data.endTime
        ? new Date(`${data.endDate}T${data.endTime}`).toISOString()
        : null;

    const payload = {
      title: data.title,
      type: data.type as TestTypeConst,
      testState: data.testState,
      startTime,
      endTime,
      duration: Number(data.duration),
      courseId: Number(data.courseId),
      bankId: Number(data.bankId),
      attemptsAllowed: Number(data.attemptsAllowed),
      passMark: Number(data.passMark),
    };

    try {
      await createTestMutation.mutateAsync(payload);
      reset();
    } catch (err) {}
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <Input
        label='Test Title'
        name='title'
        placeholder='MAT 101'
        type='text'
        hookFormRegister={register}
        errorText={errors.title?.message as string}
      />

      <div className='flex gap-4'>
        <div className='flex flex-col gap-1 w-full'>
          <label htmlFor='testType'>
            <span className='text-sm text-neutral-600'> Test Type</span>

            <select
              id='testType'
              {...register('type', { required: 'Test type is required' })}
              className='block w-full rounded-md border border-neutral-300 p-1 h-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-background text-foreground caret-foreground'
            >
              <option value='TEST'>TEST</option>
              <option value='EXAM'>EXAM</option>
              <option value='PRACTICE'>PRACTICE</option>
            </select>
            {errors.type && (
              <small className='text-error-500'>{errors.type.message}</small>
            )}
          </label>
        </div>

        <div className='flex flex-col gap-1 w-full'>
          <label htmlFor='testState'>
            <span className='text-sm text-neutral-600'>Test State</span>

            <select
              id='testState'
              {...register('testState', { required: 'Test state is required' })}
              className='block w-full rounded-md border border-neutral-300 p-1 h-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-background text-foreground caret-foreground disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100'
              disabled={role !== 'admin'}
            >
              <option value='active'>ACTIVE</option>
              <option value='scheduled'>SCHEDULED</option>
              <option value='completed'>COMPLETED</option>
            </select>
            {errors.testState && (
              <small className='text-error-500'>
                {errors.testState.message}
              </small>
            )}
          </label>
        </div>
      </div>

      <div>
        <span className='text-sm text-neutral-600'>Select Courses</span>
        <div className='w-full flex gap-4 flex-wrap'>
          {coursesData?.map((course) => (
            <label
              htmlFor={`course-${course.id}`}
              key={course.id}
              className='flex gap-2'
            >
              {course.title}
              <input
                key={course.id}
                {...register('courseId', { required: 'Course is required' })}
                type='radio'
                id={`course-${course.id}`}
                value={`${course.id}`}
              />
            </label>
          ))}
          {errors.courseId && (
            <div className='text-sm text-error-500'>
              {errors.courseId.message}
            </div>
          )}
        </div>
      </div>

      <div>
        <span className='text-sm text-neutral-600'>Question Bank</span>
        {!selectedCourseId ? (
          <div className='text-sm text-neutral-500'>
            Select a course to choose a bank
          </div>
        ) : (
          <div className='w-full flex gap-4 flex-wrap'>
            {(allQuestionBank?.data ?? [])
              .filter((b) => `${b.courseId}` === `${selectedCourseId}`)
              .map((bank) => (
                <label key={bank.id} className='flex gap-2 items-start'>
                  <input
                    {...register('bankId', {
                      required: 'Question bank is required',
                    })}
                    type='radio'
                    value={`${bank.id}`}
                    className='mt-1'
                  />
                  <div className='flex flex-col'>
                    <span className='font-medium'>{bank.questionBankName}</span>
                    <small className='text-neutral-500'>
                      {bank._count?.questions ?? 0} questions
                    </small>
                  </div>
                </label>
              ))}
            {errors.bankId && (
              <div className='text-sm text-error-500'>
                {errors.bankId.message}
              </div>
            )}
            {(allQuestionBank?.data ?? []).filter(
              (b) => `${b.courseId}` === `${selectedCourseId}`,
            ).length === 0 && (
              <div className='text-sm text-error-500'>
                No question banks available for this course
              </div>
            )}
          </div>
        )}
      </div>

      <div className='flex gap-4'>
        <Input
          label='Duration(mins)'
          name='duration'
          placeholder='20'
          type='number'
          hookFormRegister={register}
          errorText={errors.duration?.message as string}
        />
        <Input
          label='Attempts Allowed'
          name='attemptsAllowed'
          placeholder='2'
          type='number'
          hookFormRegister={register}
          errorText={errors.attemptsAllowed?.message as string}
        />
        <Input
          label='Pass Mark'
          name='passMark'
          placeholder='50'
          type='number'
          hookFormRegister={register}
          errorText={errors.passMark?.message as string}
        />
      </div>

      <div className='flex gap-4'>
        <Input
          label='Start Date'
          name='startDate'
          type='date'
          hookFormRegister={register}
          errorText={errors.startDate?.message as string}
        />
        <Input
          label='End Date'
          name='endDate'
          hookFormRegister={register}
          type='date'
          errorText={errors.startDate?.message as string}
        />
        <Input
          label='Start Time'
          type='time'
          name='startTime'
          hookFormRegister={register}
          errorText={errors.startTime?.message as string}
        />
        <Input
          label='End Time'
          name='endTime'
          type='time'
          hookFormRegister={register}
          errorText={errors.endTime?.message as string}
        />
      </div>

      <div className='w-full flex justify-end'>
        <div className='w-fit'>
          <Button
            type='submit'
            disabled={
              isSubmitting || isCoursesDataLoading || questionBankLoading
            }
          >
            {isSubmitting ? 'Creating...' : 'Create test'}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default function AdminTestPage() {
  // Add server pagination hook with sort/order for server
  const { params, goToPage, setLimit, updateParams } = useServerPagination({
    defaultPage: 1,
    defaultLimit: 10,
  });

  const {
    data: adminTestsData,
    isLoading: isAdminTestLoading,
    error: adminTestError,
  } = useAdminTest(params);
  const role = useUserStore((state) => state.role);

  const {
    data: coursesData,
    isLoading: isCoursesDataLoading,
    error: coursesError,
  } = useGetCourses();

  const {
    data: allQuestionBank,
    isLoading: questionBankLoading,
    error: questionBankError,
  } = useGetQuestionBank();

  const deleteMutation = useDeleteTest();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    modalContent: AdminTestItem | null;
    type: 'create' | 'update' | 'delete';
  }>({
    isOpen: false,
    modalContent: null,
    type: 'create',
  });

  // Client-side filter state
  const [clientFilters, setClientFilters] = useState<{
    search?: string;
    course?: string;
    className?: string;
    status?: string;
    testType?: string;
    testTitle?: string;
    startDate?: string;
  }>({});

  const handleFilterChange = useCallback(
    (nextParams: Record<string, string | number | undefined>) => {
      // Extract server params (sort, order) and client filters
      const {
        sort,
        order,
        search,
        course,
        className,
        status,
        testType,
        testTitle,
        startDate,
        ...rest
      } = nextParams;

      // Update client filters
      setClientFilters({
        search: search as string | undefined,
        course: course as string | undefined,
        className: className as string | undefined,
        status: status as string | undefined,
        testType: testType as string | undefined,
        testTitle: testTitle as string | undefined,
        startDate: startDate as string | undefined,
      });

      // Update server params (sort, order, page, limit)
      updateParams({
        page: 1,
        sort: sort as string | undefined,
        order: order as string | undefined,
        ...rest,
      });
    },
    [updateParams],
  );

  const toggleMutation = useToggleResultVisibility();

  const courses = useMemo(() => {
    const arr = (adminTestsData?.data.data ?? [])
      .map((d: AdminTestItem) => d.course?.title)
      .filter(Boolean) as string[];
    return Array.from(new Set(arr));
  }, [adminTestsData]);

  const availableTests = useMemo(() => {
    const set = new Set<string>();
    (adminTestsData?.data.data ?? []).forEach((t) => {
      if (t?.title) set.add(String(t.title));
    });
    return Array.from(set).sort();
  }, [adminTestsData]);

  const classes = useMemo(() => {
    const arr = (adminTestsData?.data.data ?? []).flatMap(
      (d: AdminTestItem) =>
        d.course?.classes?.map((c) => c.className) ?? ([] as string[]),
    );
    return Array.from(new Set(arr));
  }, [adminTestsData]);

  // Filter fields configuration
  const filterFields = useMemo<ResultFilterField[]>(
    () => [
      {
        label: 'Search',
        type: 'search',
        name: 'search',
        placeholder: 'Search by test title',
      },
      {
        type: 'select',
        name: 'course',
        label: 'Course',
        options: courses.map((c) => ({ value: c, label: c })),
        placeholder: 'All courses',
      },
      {
        type: 'select',
        name: 'className',
        label: 'Class',
        options: classes.map((c) => ({ value: c, label: c })),
        placeholder: 'All classes',
      },
      {
        type: 'select',
        name: 'testTitle',
        label: 'Test Title',
        options: availableTests.map((t) => ({ value: t, label: t })),
        placeholder: 'All tests',
      },

      {
        type: 'select',
        name: 'status',
        label: 'Status',
        options: [
          { label: 'Active', value: 'active' },
          { label: 'Scheduled', value: 'scheduled' },
          { label: 'Completed', value: 'completed' },
        ],
        placeholder: 'All statuses',
      },
      {
        type: 'select',
        name: 'testType',
        label: 'Test Type',
        options: [
          { label: 'Exam', value: 'EXAM' },
          { label: 'Test', value: 'TEST' },
          { label: 'Practice', value: 'PRACTICE' },
        ],
        placeholder: 'All types',
      },
      {
        type: 'date',
        name: 'startDate',
        label: 'Start Date',
      },
      {
        type: 'select',
        name: 'sort',
        label: 'Sort By',
        options: [
          { label: 'Title', value: 'title' },
          { label: 'Created Date', value: 'createdAt' },
          { label: 'Type', value: 'type' },
        ],
        placeholder: 'Default',
      },
      {
        type: 'select',
        name: 'order',
        label: 'Order',
        options: [
          { label: 'Descending', value: 'desc' },
          { label: 'Ascending', value: 'asc' },
        ],
        placeholder: 'Default',
      },
    ],
    [courses, classes, availableTests],
  );

  const paginationData = useMemo(() => {
    const total = adminTestsData?.data?.pagination?.total ?? 0;
    const limit = params.limit ?? 10;
    const pages = Math.ceil(total / limit) || 1;
    return {
      total,
      pages,
      limit,
    };
  }, [adminTestsData?.data?.pagination?.total, params.limit]);

  const filteredData = useMemo(() => {
    const list = adminTestsData?.data.data ?? ([] as AdminTestItem[]);
    return list.filter((item: AdminTestItem) => {
      // search
      if (
        clientFilters.search &&
        !item.title.toLowerCase().includes(clientFilters.search.toLowerCase())
      )
        return false;
      // course
      if (clientFilters.course && item.course?.title !== clientFilters.course)
        return false;
      // class
      if (
        clientFilters.className &&
        !(item.course?.classes ?? []).some(
          (c) => c.className === clientFilters.className,
        )
      )
        return false;
      // status
      if (clientFilters.status && item.testState !== clientFilters.status)
        return false;
      // test type
      if (
        clientFilters.testType &&
        String(item.type).toUpperCase() !==
          String(clientFilters.testType).toUpperCase()
      )
        return false;
      // start date equality (yyyy-mm-dd)
      if (clientFilters.startDate && item.startTime) {
        const d = new Date(item.startTime).toISOString().slice(0, 10);
        if (d !== clientFilters.startDate) return false;
      }
      // test title
      if (clientFilters.testTitle && item.title !== clientFilters.testTitle)
        return false;
      return true;
    });
  }, [adminTestsData, clientFilters]);

  const tableHeaders = useMemo(() => {
    const headers = ['S/N', 'Test Title', 'Class', 'Course', 'Test Type'];

    if (role === 'admin') {
      headers.push('Created By');
    }

    headers.push('Result Status', 'Status', 'Start Date', 'Created on');

    return headers;
  }, [role]);

  const getStatusVariant = (status: TestType['testState']) => {
    if (status === 'completed') return 'primary';
    if (status === 'scheduled') return 'warning';
    return 'success';
  };

  if (adminTestError) {
    toast.error(getErrorDetails(adminTestError));
  }

  if (coursesError) toast.error(getErrorDetails(coursesError));
  if (questionBankError) toast.error(getErrorDetails(questionBankError));

  //update modal state
  const updateModalState = ({
    key,
    value,
  }: {
    key: keyof typeof modalState;
    value: boolean | AdminTestItem | ('create' | 'update' | 'delete') | null;
  }) => {
    setModalState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <section className='space-y-4'>
      <div className='flex flex-col lg:flex-row gap-6 w-full'>
        <div className='flex-1 flex flex-col gap-4'>
          <div className='flex justify-between w-full'>
            <h1 className='text-2xl font-semibold'>Manage Tests</h1>
            <div>
              <Button
                onClick={() => {
                  updateModalState({ key: 'type', value: 'create' });
                  updateModalState({ key: 'isOpen', value: true });
                }}
                label='+ Create Test'
              />
            </div>
          </div>

          <ResultsFiltersBar
            fields={filterFields}
            limit={params.limit}
            limitOptions={[5, 10, 20, 30, 40]}
            initialValues={{
              sort: params.sort,
              order: params.order,
              ...clientFilters,
            }}
            onChange={handleFilterChange}
            onLimitChange={setLimit}
            onReset={() => {
              setClientFilters({});
              updateParams({ page: 1, limit: params.limit });
            }}
          />
        </div>

        <aside className='w-full lg:w-80'>
          <TestSummary tests={adminTestsData?.data.data ?? []} />
        </aside>
      </div>

      <div>
        <AppTable
          isLoading={isAdminTestLoading}
          headerColumns={tableHeaders}
          data={filteredData}
          itemKey={({ item }) => `${item.id}`}
          centralizeLabel={false}
          itemsPerPage={paginationData.limit}
          paginationMode='server'
          paginationMeta={{
            currentPage: params.page || 1,
            totalPages: paginationData.pages,
            totalItems: paginationData.total,
            itemsPerPage: paginationData.limit,
          }}
          onPageChange={goToPage}
          renderItem={({ item, itemIndex }) => {
            // setshowResult(item.showResult);
            return (
              <>
                <TableDataItem>
                  <span className='font-light text-sm text-neutral-600'>
                    {((params?.page ?? 1) - 1) * paginationData.limit +
                      itemIndex +
                      1}
                    .
                  </span>
                </TableDataItem>
                <TableDataItem>{item.title}</TableDataItem>
                <TableDataItem>
                  {(item.course?.classes ?? []).length > 0
                    ? (item.course.classes ?? [])
                        .filter((el) => el?.className)
                        .map((el) => el.className)
                        .join(', ')
                    : 'N/A'}
                </TableDataItem>
                <TableDataItem>{item.course?.title ?? 'N/A'}</TableDataItem>
                <TableDataItem>{item.type}</TableDataItem>
                {role === 'admin' && (
                  <TableDataItem>
                    {item?.createdBy?.firstname && item?.createdBy?.lastname
                      ? `${item.createdBy.firstname} ${item.createdBy.lastname}`
                      : 'N/A'}
                  </TableDataItem>
                )}
                <TableDataItem>
                  <div className='flex items-center justify-center'>
                    <label className='relative inline-flex items-center cursor-pointer'>
                      <input
                        type='checkbox'
                        className='sr-only peer disabled:cursor-not-allowed'
                        aria-label='Toggle release result'
                        checked={item.showResult}
                        onChange={(e) => {
                          toggleMutation.mutate({
                            testId: item.id,
                            showResult: e.target.checked,
                          });

                          // setshowResult(e.target.checked);
                        }}
                        disabled={
                          role !== 'admin' ||
                          item.type.toLowerCase() === 'practice' ||
                          toggleMutation.isPending
                        }
                      />
                      <div className='w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-primary-600 relative peer-disabled:opacity-50 peer-disabled:cursor-not-allowed'></div>
                      <span
                        className='absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow
                   transition-transform translate-x-0 peer-checked:translate-x-5 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed'
                      />
                    </label>
                  </div>
                </TableDataItem>
                <TableDataItem className='capitalize flex justify-center'>
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
                <TableDataItem>
                  {item.createdAt
                    ? formatDate(item.createdAt.toString())
                    : '--'}
                </TableDataItem>
              </>
            );
          }}
          onActionClick={({ item }) => {
            updateModalState({ key: 'modalContent', value: item });
          }}
          actionModalContent={
            <div className='flex flex-col gap-2 w-full'>
              <button
                onClick={() => {
                  updateModalState({ key: 'type', value: 'update' });
                  updateModalState({ key: 'isOpen', value: true });
                }}
                className='px-2 py-1 rounded bg-primary-500 text-white text-xs cursor-pointer'
              >
                Update Test
              </button>
              <button
                onClick={() => {
                  updateModalState({ key: 'type', value: 'delete' });
                  updateModalState({ key: 'isOpen', value: true });
                }}
                className='px-2 py-1 rounded bg-error-500 text-white text-xs cursor-pointer'
              >
                Delete Test
              </button>
            </div>
          }
        />
      </div>

      <Modal
        modalIsOpen={modalState.isOpen}
        setModalIsOpen={(value) =>
          updateModalState({ key: 'isOpen', value: value as boolean })
        }
      >
        {modalState.type === 'create' ? (
          <AddTestForm
            coursesData={coursesData?.data ?? []}
            allQuestionBank={allQuestionBank?.data}
            isCoursesDataLoading={isCoursesDataLoading}
            questionBankLoading={questionBankLoading}
            role={role}
          />
        ) : modalState.type === 'update' ? (
          <UpdateForm
            coursesData={coursesData?.data ?? []}
            allQuestionBank={allQuestionBank?.data}
            initialData={modalState.modalContent}
            onClose={() => {
              updateModalState({ key: 'isOpen', value: false });
              updateModalState({ key: 'modalContent', value: null });
            }}
            role={role}
          />
        ) : (
          <div className='w-full h-full flex flex-col gap-6'>
            <div className='flex flex-col items-center gap-2 w-full'>
              <span className='text-lg text-error-700 font-medium'>
                Delete Class
              </span>
              <span className='text-sm font-normal'>
                This action is irreversible
              </span>
            </div>

            <div className='flex flex-row items-center justify-center w-full'>
              <div className='flex flex-row items-center gap-2 w-full max-w-[50%] mx-auto'>
                <Button
                  variant='danger'
                  disabled={deleteMutation.isPending}
                  onClick={async () => {
                    if (!modalState.modalContent) return;
                    try {
                      await deleteMutation.mutateAsync(
                        modalState.modalContent.id,
                      );
                      updateModalState({ key: 'isOpen', value: false });
                      updateModalState({ key: 'modalContent', value: null });
                    } catch {
                      // error handled in hook
                    }
                  }}
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Yes, Delete'}
                </Button>

                <Button
                  disabled={deleteMutation.isPending}
                  onClick={() =>
                    updateModalState({ key: 'isOpen', value: false })
                  }
                >
                  No, Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
