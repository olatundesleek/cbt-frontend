"use client";

import React, {
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { GoPlus } from 'react-icons/go';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/input';
import { HiUserGroup } from 'react-icons/hi';
import { LuBuilding2 } from 'react-icons/lu';
import AppTable, { TableDataItem } from '@/components/table';
import { useServerPagination } from '@/hooks/useServerPagination';
import {
  useGetClasses,
  useGetCourses,
  useGetTeachers,
} from '@/features/dashboard/queries/useDashboard';
import api, { errorLogger } from '@/lib/axios';
import { formatDate } from '../../../../../utils/helpers';
import { SubmitHandler, useForm, Resolver } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { queryClient } from '@/providers/query-provider';
import {
  AllClassesResponse,
  AllCourses,
  AllTeachersResponse,
} from '@/types/dashboard.types';
import Modal from '@/components/modal';
import { useAdminStudents } from '@/features/students/hooks/useStudents';
import { FaUsers } from 'react-icons/fa';
import ResultsFiltersBar, {
  type ResultFilterField,
} from '@/features/results/components/ResultsFiltersBar';
import { Badge } from '@/components/ui';

interface UpdateClassProps {
  singleClass: AllClassesResponse['data'][number] | null;
  allTeachers: AllTeachersResponse['data']['data'];
  closeModal: () => void;
  coursesData: AllCourses[];
}

const headerColumns = [
  'S/N',
  'Class',
  'Teacher',
  'Total Courses',
  'Created On',
];

const schema = Yup.object({
  teacher: Yup.string().required('Teacher is required'),
  nameOfClass: Yup.string().required('Name of class is required'),
  courses: Yup.array().min(1, 'At least one course is required'),
});

// separate schema for the "assign teacher" form which doesn't include courses
const assignSchema = Yup.object({
  teacher: Yup.string().required('Teacher is required'),
  nameOfClass: Yup.string().required('Name of class is required'),
});

type FormProps = Yup.InferType<typeof schema>;
type AssignFormProps = Yup.InferType<typeof assignSchema>;

const UpdateClass = ({
  singleClass,
  closeModal,
  allTeachers,
  coursesData,
}: UpdateClassProps) => {
  const {
    register,
    handleSubmit,
    reset: resetForm,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormProps>({
    resolver: yupResolver(schema) as Resolver<FormProps>,
    defaultValues: {
      teacher: '',
      nameOfClass: '',
      courses: [],
    },
  });

  const handleUpdateClass: SubmitHandler<FormProps> = async (data) => {
    const payload = {
      className: data.nameOfClass,
      teacherId: Number(data.teacher),
      courses: data.courses,
    };

    try {
      const response = await api.patch(`/class/${singleClass?.id}`, payload);
      await queryClient.invalidateQueries({ queryKey: ['classes'] });
      resetForm();
      closeModal();
      toast.success(response.data.message || 'Updated Successfully');
    } catch (error) {
      errorLogger(error);
    }
  };

  useEffect(() => {
    if (!singleClass) return;

    setValue('teacher', `${singleClass.teacherId}`);
    setValue('nameOfClass', singleClass.className);
    const existingCourseIds =
      singleClass.courses?.map((c) => String(c.id)) || [];
    setValue('courses', existingCourseIds);
  }, [singleClass, setValue]);

  if (!singleClass) return null;

  return (
    <div className='flex flex-col gap-1 w-full'>
      <span className='text-base font-bold'>Update Class</span>

      <form
        onSubmit={handleSubmit(handleUpdateClass)}
        className='flex flex-col items-stretch gap-2 w-full'
      >
        <div className='flex flex-col gap-1 w-full'>
          <label htmlFor='teacher'>
            <span className='text-sm text-neutral-600'>Select Teacher</span>

            <select
              id='teacher'
              {...register('teacher')}
              disabled={!allTeachers.length}
              className='block w-full rounded-md border border-neutral-300 p-1 h-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-background text-foreground caret-foreground'
            >
              <option value={''} disabled>
                Select Teacher
              </option>
              {allTeachers?.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher?.firstname && teacher?.lastname
                    ? teacher.firstname + ' ' + teacher.lastname
                    : 'N/A'}
                </option>
              ))}
            </select>
          </label>

          {errors?.teacher?.message && (
            <small className='text-error-500'>{errors?.teacher?.message}</small>
          )}
        </div>

        <Input
          label='Name of class'
          name='nameOfClass'
          autoFocus={false}
          placeholder='Name of Class'
          hookFormRegister={register}
          errorText={errors?.nameOfClass?.message}
        />

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
                  type='checkbox'
                  id={`course-${course.id}`}
                  value={course.id}
                  {...register('courses')}
                />
              </label>
            ))}
          </div>
        </div>
        {errors?.courses?.message && (
          <small className='text-error-500'>
            {errors?.courses?.message as React.ReactNode}
          </small>
        )}

        <div className='w-fit'>
          <Button type='submit' disabled={isSubmitting}>
            <div className='flex flex-row items-center gap-2 w-full'>
              <GoPlus />
              <span>{isSubmitting ? 'Updating...' : 'Update Class'}</span>
            </div>
          </Button>
        </div>
      </form>
    </div>
  );
};

const AdminClasses = () => {
  // Add server pagination hook
  const { params, goToPage, setLimit, updateParams } = useServerPagination({
    defaultPage: 1,
    defaultLimit: 10,
  });

  const handleFilterChange = useCallback(
    (nextParams: Record<string, string | number | undefined>) => {
      updateParams(nextParams);
    },
    [updateParams],
  );

  const filterFields = useMemo<ResultFilterField[]>(
    () => [
      {
        type: 'select',
        name: 'sort',
        label: 'Sort By',
        options: [
          { label: 'Class Name', value: 'className' },
          { label: 'Date Created', value: 'createdAt' },
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
    [],
  );

  const [searchValue, setSearchValue] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    modalContent: AllClassesResponse['data'][number] | null;
    type: 'update' | 'delete' | 'view';
  }>({
    isOpen: false,
    modalContent: null,
    type: 'update',
  });

  // create class form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset: resetForm,
  } = useForm<FormProps>({
    resolver: yupResolver(schema) as Resolver<FormProps>,
    defaultValues: {
      teacher: '',
      nameOfClass: '',
      courses: [],
    },
  });

  // assign class teacher form
  const {
    register: assignTeacherReg,
    handleSubmit: assignTeacherSubmit,
    reset: assignTeacherReset,
    formState: {
      errors: assignTeacherError,
      isSubmitting: assignTeacherIsSubmitting,
    },
  } = useForm<AssignFormProps>({
    resolver: yupResolver(assignSchema) as Resolver<AssignFormProps>,
    defaultValues: {
      teacher: '',
      nameOfClass: '',
    },
  });

  const {
    data: allClasses,
    isLoading: classesLoading,
    error: classesError,
  } = useGetClasses(params);

  // Client-side search filtering
  const filteredClasses =
    allClasses?.data?.filter((classItem) =>
      searchValue
        ? classItem.className.toLowerCase().includes(searchValue.toLowerCase())
        : true,
    ) ?? [];

  const {
    data: allTeachers,
    isLoading: teachersLoading,
    error: teachersError,
  } = useGetTeachers();

  const {
    data: coursesData,
    isLoading: isCoursesDataLoading,
    error: coursesError,
  } = useGetCourses();

  const { data: students } = useAdminStudents();

  const quickStats: { icon: ReactNode; label: string; count: number }[] = [
    {
      icon: <LuBuilding2 className='text-primary-600' />,
      label: 'Total Classes',
      count: allClasses?.data ? allClasses.data?.length : 0,
    },
    {
      icon: <HiUserGroup className='text-primary-600' />,
      label: 'Total Teachers',
      count: allTeachers?.data ? allTeachers?.data.data.length : 0,
    },
    {
      icon: <FaUsers className='text-primary-600' />,
      label: 'Total Students',
      count: students?.data ? students.data.data.length : 0,
    },
  ];

  //update modal state
  const updateModalState = ({
    key,
    value,
  }: {
    key: keyof typeof modalState;
    value:
      | boolean
      | AllClassesResponse['data'][number]
      | ('update' | 'delete' | 'view')
      | null;
  }) => {
    setModalState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // create class
  const handleCreateClass: SubmitHandler<FormProps> = async (data) => {
    const payload = {
      className: data.nameOfClass,
      teacherId: Number(data.teacher),
      courses: data.courses,
    };

    try {
      const response = await api.post('/class', payload);
      await queryClient.invalidateQueries({ queryKey: ['classes'] }); // invalidate and refetch classes
      resetForm();
      toast.success(response.data.message || 'Created Successfully');
    } catch (error) {
      errorLogger(error);
    }
  };

  // assign teacher and class
  const handleAssignClass: SubmitHandler<AssignFormProps> = async (data) => {
    try {
      const response = await api.patch(
        `/teachers/${data.nameOfClass}/assign-class-teacher`,
        {
          teacherId: Number(data.teacher),
        },
      );
      await queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast.success(response.data.message || 'Assigned Successfully');
      assignTeacherReset();
    } catch (error) {
      errorLogger(error);
    }
  };

  // delete class
  const handleDeleteClass = async () => {
    setIsDeleting(true);

    try {
      const res = await api.delete(`/class/${modalState?.modalContent?.id}`);
      await queryClient.invalidateQueries({ queryKey: ['classes'] }); // invalidate and refetch classes
      toast.success(res.data.message || 'Deleted Successfully');
      updateModalState({ key: 'isOpen', value: false });
    } catch (error) {
      errorLogger(error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (classesError) {
    errorLogger(classesError);
  }
  if (coursesError) {
    errorLogger(coursesError);
  }
  if (teachersError) {
    errorLogger(teachersError);
  }

  return (
    <section className='flex flex-col gap-4 w-full'>
      <h1 className='text-2xl font-semibold'>Manage Classes</h1>

      <div className='grid grid-cols-1 lg:grid-cols-3 w-full gap-4'>
        <div className='col-span-1 lg:col-span-2 flex flex-col gap-3 bg-background rounded-xl w-full p-3'>
          <div className='flex flex-col gap-1 w-full'>
            <span className='text-base font-bold'>Create A Class</span>

            <form
              onSubmit={handleSubmit(handleCreateClass)}
              className='flex flex-col items-stretch gap-2 w-full'
            >
              <div className='flex flex-col gap-1 w-full'>
                <label htmlFor='teacher'>
                  <span className='text-sm text-neutral-600'>
                    Select Teacher
                  </span>

                  <select
                    id='teacher'
                    {...register('teacher')}
                    disabled={teachersLoading || !allTeachers?.data}
                    className='block w-full rounded-md border border-neutral-300 p-1 h-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-background text-foreground caret-foreground'
                  >
                    <option value={''} disabled>
                      Select Teacher
                    </option>
                    {allTeachers?.data.data?.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.firstname + ' ' + teacher.lastname}
                      </option>
                    ))}
                  </select>
                </label>

                {errors?.teacher?.message && (
                  <small className='text-error-500'>
                    {errors?.teacher?.message}
                  </small>
                )}
              </div>

              <Input
                label='Name of class'
                name='nameOfClass'
                autoFocus={false}
                placeholder='Name of Class'
                hookFormRegister={register}
                errorText={errors?.nameOfClass?.message}
              />

              <div>
                <span className='text-sm text-neutral-600'>Select Courses</span>
                <div className='w-full flex gap-4 flex-wrap'>
                  {coursesData?.data?.map((course) => (
                    <label
                      htmlFor={`course-${course.id}`}
                      key={course.id}
                      className='flex gap-2'
                    >
                      {course.title}
                      <input
                        type='checkbox'
                        id={`course-${course.id}`}
                        value={course.id}
                        {...register('courses')}
                      />
                    </label>
                  ))}
                </div>
              </div>
              {errors?.courses?.message && (
                <small className='text-error-500'>
                  {errors?.courses?.message as React.ReactNode}
                </small>
              )}

              <div className='w-fit'>
                <Button
                  type='submit'
                  disabled={
                    classesLoading ||
                    teachersLoading ||
                    isCoursesDataLoading ||
                    isSubmitting
                  }
                >
                  <div className='flex flex-row items-center gap-2 w-full'>
                    <GoPlus />
                    <span>
                      {isSubmitting ? 'Creating' : 'Create New Class'}
                    </span>
                  </div>
                </Button>
              </div>
            </form>
          </div>

          {/* Search Input */}
          <div className='flex items-center gap-2 w-full'>
            <Input
              name='search'
              placeholder='Search classes by name...'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>

          <ResultsFiltersBar
            fields={filterFields}
            limit={(params.limit as number) ?? 10}
            limitOptions={[5, 10, 20, 30, 40]}
            initialValues={params}
            onChange={handleFilterChange}
            onLimitChange={setLimit}
            onReset={() => updateParams({ page: 1, limit: params.limit })}
          />

          <AppTable
            data={filteredClasses}
            label='All Classes'
            isLoading={classesLoading}
            headerColumns={headerColumns}
            itemKey={({ itemIndex }) => `${itemIndex}`}
            paginationMode='server'
            itemsPerPage={allClasses?.pagination?.limit || 10}
            paginationMeta={{
              currentPage: allClasses?.pagination?.page || 1,
              totalPages: allClasses?.pagination?.pages || 1,
              totalItems: allClasses?.pagination?.total || 0,
              itemsPerPage: allClasses?.pagination?.limit || 10,
            }}
            onPageChange={goToPage}
            onActionClick={({ item }) =>
              updateModalState({ key: 'modalContent', value: item })
            }
            renderItem={({ item, itemIndex }) => (
              <>
                <TableDataItem>
                  <span className='font-light text-sm text-neutral-600'>
                    {((params?.page ?? 1) - 1) *
                      (allClasses?.pagination?.limit || 10) +
                      itemIndex +
                      1}
                    .
                  </span>
                </TableDataItem>
                <TableDataItem>{item.className}</TableDataItem>
                <TableDataItem>
                  {item?.teacher?.firstname && item?.teacher?.lastname
                    ? item.teacher.firstname + ' ' + item.teacher.lastname
                    : 'N/A'}
                </TableDataItem>
                <TableDataItem>{(item.courses ?? []).length}</TableDataItem>
                <TableDataItem>{formatDate(item.createdAt)}</TableDataItem>
              </>
            )}
            actionModalContent={
              <div className='flex flex-col gap-2 w-full'>
                <button
                  onClick={() => {
                    updateModalState({ key: 'type', value: 'view' });
                    updateModalState({ key: 'isOpen', value: true });
                  }}
                  className='px-2 py-1 rounded bg-primary-500 text-white text-xs cursor-pointer'
                >
                  View Courses
                </button>
                <button
                  onClick={() => {
                    updateModalState({ key: 'type', value: 'update' });
                    updateModalState({ key: 'isOpen', value: true });
                  }}
                  className='px-2 py-1 rounded bg-primary-500 text-white text-xs cursor-pointer'
                >
                  Update Class
                </button>
                <button
                  onClick={() => {
                    updateModalState({ key: 'type', value: 'delete' });
                    updateModalState({ key: 'isOpen', value: true });
                  }}
                  className='px-2 py-1 rounded bg-error-500 text-white text-xs cursor-pointer'
                >
                  Delete Class
                </button>
              </div>
            }
          />
        </div>

        <div className='col-span-1 flex flex-col gap-5 bg-background rounded-xl w-full p-3 h-fit'>
          <div className='flex flex-col gap-3 w-full'>
            <div className='py-2 border-b border-b-neutral-500'>
              <span className='text-base font-bold'>
                Assign Teacher to a Class
              </span>
            </div>

            <form
              onSubmit={assignTeacherSubmit(handleAssignClass)}
              className='flex flex-col items-stretch gap-2 w-full'
            >
              <div className='flex flex-col gap-1 w-full'>
                <label htmlFor='teacher'>
                  <span className='text-sm text-neutral-600'>
                    Select Teacher
                  </span>

                  <select
                    id='teacher'
                    {...assignTeacherReg('teacher')}
                    disabled={teachersLoading || !allTeachers?.data}
                    className='block w-full rounded-md border border-neutral-300 p-1 h-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-background text-foreground caret-foreground'
                  >
                    <option value={''} disabled>
                      Select Teacher
                    </option>
                    {allTeachers?.data?.data.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher?.firstname && teacher?.lastname
                          ? teacher.firstname + ' ' + teacher.lastname
                          : 'N/A'}
                      </option>
                    ))}
                  </select>
                </label>

                {assignTeacherError?.teacher?.message && (
                  <small className='text-error-500'>
                    {assignTeacherError?.teacher?.message}
                  </small>
                )}
              </div>

              <div className='flex flex-col gap-1 w-full'>
                <label htmlFor='class'>
                  <span className='text-sm text-neutral-600'>Select Class</span>

                  <select
                    id='class'
                    {...assignTeacherReg('nameOfClass')}
                    disabled={teachersLoading || !allTeachers}
                    className='block w-full rounded-md border border-neutral-300 p-1 h-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-background text-foreground caret-foreground'
                  >
                    <option value={''} disabled>
                      Select Class
                    </option>
                    {allClasses?.data?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.className}
                      </option>
                    ))}
                  </select>
                </label>

                {assignTeacherError?.nameOfClass?.message && (
                  <small className='text-error-500'>
                    {assignTeacherError?.nameOfClass?.message}
                  </small>
                )}
              </div>

              <div className='w-fit'>
                <Button
                  type='submit'
                  disabled={
                    classesLoading ||
                    teachersLoading ||
                    assignTeacherIsSubmitting
                  }
                >
                  {assignTeacherIsSubmitting ? 'Assigning' : 'Assign'}
                </Button>
              </div>
            </form>
          </div>

          <div className='flex flex-col gap-3 w-full'>
            <div className='py-2 border-b border-b-neutral-500'>
              <span className='text-base font-bold'>Quick Stats</span>
            </div>

            <div className='flex flex-col gap-4 w-full'>
              {quickStats.map((stat) => (
                <div key={stat.label} className='flex flex-col gap-1 w-full'>
                  <div className='flex flex-row items-center gap-2'>
                    <>{stat.icon}</>
                    <span className='text-sm text-neutral-600'>
                      {stat.label}
                    </span>
                  </div>
                  <span className='text-base font-medium'>{stat.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* modal to delete and update a class */}
      <Modal
        modalIsOpen={modalState.isOpen}
        setModalIsOpen={(value) =>
          updateModalState({ key: 'isOpen', value: value as boolean })
        }
      >
        {modalState.type === 'view' ? (
          <div className='grid grid-cols-4 gap-4'>
            {(modalState.modalContent?.courses ?? []).length > 0 ? (
              (modalState.modalContent?.courses ?? []).map((c) => (
                <Badge key={c?.id ?? Math.random()}>
                  <span className='block text-center'>
                    <span className='block font-black'>
                      {c?.title ?? 'N/A'}
                    </span>
                    <span className='block text-xs'>
                      {c?.description ?? 'N/A'}
                    </span>
                  </span>
                </Badge>
              ))
            ) : (
              <span>No courses assigned</span>
            )}
          </div>
        ) : modalState.type === 'update' ? (
          <UpdateClass
            singleClass={modalState.modalContent}
            allTeachers={allTeachers?.data.data ?? []}
            closeModal={() => updateModalState({ key: 'isOpen', value: false })}
            coursesData={coursesData?.data ?? []}
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
                  disabled={isDeleting}
                  onClick={handleDeleteClass}
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                </Button>

                <Button
                  disabled={isDeleting}
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
};

export default AdminClasses;
