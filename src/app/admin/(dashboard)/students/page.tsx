'use client';
import AppTable, { TableDataItem } from '@/components/table';
import { Button } from '@/components/ui';
import Input from '@/components/ui/input';
import Modal from '@/components/modal';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { authService } from '@/services/authService';
import { queryClient } from '@/providers/query-provider';
import { useAdminStudents } from '@/features/students/hooks/useStudents';
import { useServerPagination } from '@/hooks/useServerPagination';
import useChangeStudentPassword from '@/features/students/hooks/useChangeStudentPassword';
import useDeleteStudent from '@/features/students/hooks/useDeleteStudent';
import useToggleStudentStatus from '@/features/students/hooks/useToggleStudentStatus';
import FilterBar, {
  FilterOption,
  FilterState,
} from '@/components/tests/FilterBar';
import { formatDate } from '../../../../../utils/helpers';
import StudentSummary from '@/components/tests/StudentSummary';
import { useCallback, useMemo, useState } from 'react';
import type { Student } from '@/types/students.types';
import useAssignClass from '@/features/students/hooks/useAssignClass';
import { useGetClasses } from '@/features/dashboard/queries/useDashboard';
import { AllClassesResponse } from '@/types/dashboard.types';
import { useUserStore } from '@/store/useUserStore';
import getErrorDetails from '@/utils/getErrorDetails';
import UpdateAnyProfileAdmin from '@/components/updateAnyProfileAdmin';
import { FiBookOpen, FiUserPlus } from 'react-icons/fi';

export default function AdminStudentsPage() {
  // Add server pagination hook
  const { params, goToPage, updateParams, setLimit } = useServerPagination({
    defaultPage: 1,
    defaultLimit: 10,
  });

  const role = useUserStore((s) => s.role);
  const { data: adminStudentsData, isLoading: isStudentsLoading } =
    useAdminStudents(params);

  const { data: allClasses, isLoading: classesLoading } = useGetClasses({
    limit: 1000,
    page: 1,
  });
  const handleFilterChange = useCallback(
    (nextFilter: FilterState) => {
      updateParams({
        page: 1,
        search: nextFilter.query || undefined,
        classId: nextFilter.classId || undefined,
        status: nextFilter.status || undefined,
        startDate: nextFilter.startDate || undefined,
      });
    },
    [updateParams],
  );

  const handleOuterReset = useCallback(() => {
    updateParams({ sort: undefined, order: undefined, page: 1, limit: 10 });
  }, [updateParams]);

  const students = useMemo<Student[]>(
    () => adminStudentsData?.data.data ?? [],
    [adminStudentsData],
  );
  const filteredData = students;

  // const classes = useMemo(() => {
  //   const arr = (allClasses?.data || []).flatMap((c) => c.className);
  //   return Array.from(new Set(arr)).filter((v): v is string => !!v);
  // }, [allClasses]);

  const classes = useMemo<FilterOption[]>(
    () =>
      (allClasses?.data ?? []).map((item) => ({
        value: item.id,
        label: item.className,
      })),
    [allClasses],
  );

  const tableHeaders = useMemo(
    () =>
      role === 'admin'
        ? [
            'S/N',
            'Photo',
            'Name',
            'Username/ID',
            'Email',
            'Phone',
            'Class',
            'Active',
            'Created on',
          ]
        : ['S/N', 'Name', 'Username/ID', 'Class'],
    [role],
  );

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    modalContent: Student | null;
    type: 'create' | 'update' | 'delete' | 'assign' | 'view' | 'updateProfile';
  }>({ isOpen: false, modalContent: null, type: 'create' });
  const [previewPicture, setPreviewPicture] = useState<{
    url: string;
    name: string;
  } | null>(null);

  const deleteMutation = useDeleteStudent();
  const statusMutation = useToggleStudentStatus();

  // update modal state helper
  const updateModalState = useCallback(
    ({
      key,
      value,
    }: {
      key: keyof typeof modalState;
      value:
        | boolean
        | Student
        | ('create' | 'update' | 'delete' | 'assign' | 'view' | 'updateProfile')
        | null;
    }) => {
      setModalState((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const actionModalContent = useMemo(() => {
    const hasRegisteredCourses =
      (modalState.modalContent?.class?.courses?.length ?? 0) > 0;

    return role === 'admin' ? (
      <div className='flex w-full flex-col gap-2'>
        {hasRegisteredCourses && (
          <button
            onClick={() => {
              updateModalState({ key: 'type', value: 'view' });
              updateModalState({ key: 'isOpen', value: true });
            }}
            className='px-2 py-1 rounded bg-primary-500 text-white text-xs cursor-pointer'
          >
            View Registered Courses
          </button>
        )}
        <button
          onClick={() => {
            updateModalState({ key: 'type', value: 'assign' });
            updateModalState({ key: 'isOpen', value: true });
          }}
          className='px-2 py-1 rounded bg-primary-500 text-white text-xs cursor-pointer'
        >
          Assign To Class
        </button>

        <button
          onClick={() => {
            updateModalState({ key: 'type', value: 'updateProfile' });
            updateModalState({ key: 'isOpen', value: true });
          }}
          className='px-2 py-1 rounded bg-primary-500 text-white text-xs cursor-pointer'
        >
          Update Profile
        </button>

        <button
          onClick={() => {
            updateModalState({ key: 'type', value: 'update' });
            updateModalState({ key: 'isOpen', value: true });
          }}
          className='px-2 py-1 rounded bg-primary-500 text-white text-xs cursor-pointer'
        >
          Update Password
        </button>
        <button
          onClick={() => {
            updateModalState({ key: 'type', value: 'delete' });
            updateModalState({ key: 'isOpen', value: true });
          }}
          className='px-2 py-1 rounded bg-error-500 text-white text-xs cursor-pointer'
        >
          Delete Student
        </button>
      </div>
    ) : (
      <div className='flex w-full flex-col gap-2'>
        <button
          onClick={() => {
            updateModalState({ key: 'type', value: 'view' });
            updateModalState({ key: 'isOpen', value: true });
          }}
          className='px-2 py-1 rounded bg-primary-500 text-white text-xs cursor-pointer'
        >
          View Registered Courses
        </button>
      </div>
    );
  }, [modalState.modalContent, updateModalState, role]);

  return (
    <section className=''>
      <div className='flex flex-col lg:flex-row gap-6 w-full'>
        <div className='flex-1 flex flex-col gap-4'>
          <div className='flex justify-between w-full'>
            <h1 className='text-2xl font-semibold'>Manage Students</h1>
            {role === 'admin' && (
              <div>
                <Button
                  onClick={() => {
                    updateModalState({ key: 'type', value: 'create' });
                    updateModalState({ key: 'isOpen', value: true });
                  }}
                  label='+ Create Student'
                  disabled={role !== 'admin'}
                />
              </div>
            )}
          </div>

          <FilterBar
            classes={classes}
            onChange={handleFilterChange}
            onReset={handleOuterReset}
            showCourseFilter={false}
            showStatusFilter={false}
            showTestTitleFilter={false}
          >
            {/* Search and Filter Section */}
            <>
              <select
                value={params.sort || ''}
                onChange={(e) =>
                  updateParams({ sort: e.target.value || undefined })
                }
                className='rounded-md border border-neutral-300 px-3 py-2 bg-background text-foreground'
                aria-label='Sort by field'
              >
                <option value='' disabled>
                  Sort By
                </option>
                <option value='firstname'>First Name</option>
                <option value='lastname'>Last Name</option>
                <option value='createdAt'>Date Created</option>
              </select>
              <select
                value={params.order || ''}
                onChange={(e) =>
                  updateParams({ order: e.target.value as 'asc' | 'desc' })
                }
                className='rounded-md border border-neutral-300 px-3 py-2 bg-background text-foreground'
                aria-label='Sort order'
              >
                <option value='' disabled className='bg-neutral-500'>
                  Order
                </option>
                <option value='asc'>Ascending</option>
                <option value='desc'>Descending</option>
              </select>
              <select
                value={params.limit || 10}
                onChange={(e) => setLimit(Number(e.target.value))}
                className='rounded-md border border-neutral-300 px-3 py-2 bg-background text-foreground'
                aria-label='Items per page'
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </>
          </FilterBar>
        </div>

        <aside className='w-full lg:w-80'>
          <StudentSummary students={students} />
        </aside>

        <Modal
          modalIsOpen={modalState.isOpen}
          setModalIsOpen={(v) =>
            updateModalState({ key: 'isOpen', value: v as boolean })
          }
        >
          {modalState.type === 'view' ? (
            <div className='w-full max-w-2xl'>
              <div className='mb-5 flex items-start justify-between border-b border-neutral-200 pb-4'>
                <div>
                  <p className='text-xs font-semibold uppercase tracking-[0.18em] text-primary-600'>
                    Academic record
                  </p>
                  <h2 className='mt-1 text-2xl font-bold text-neutral-900'>
                    Registered courses
                  </h2>
                  <p className='mt-1 text-sm text-neutral-500'>
                    Courses assigned to {modalState.modalContent?.firstname}{' '}
                    {modalState.modalContent?.lastname}.
                  </p>
                </div>
                <div className='rounded-full bg-primary-50 px-3 py-1 text-sm font-bold text-primary-700'>
                  {(modalState.modalContent?.class?.courses ?? []).length}
                </div>
              </div>
              {(modalState.modalContent?.class?.courses ?? []).length > 0 ? (
                <div className='grid gap-3 sm:grid-cols-2'>
                  {(modalState.modalContent?.class?.courses ?? []).map(
                    (course) => (
                      <div
                        key={course.id}
                        className='rounded-xl border border-neutral-200 bg-neutral-50 p-4'
                      >
                        <div className='mb-2 flex items-start gap-3'>
                          <span className='rounded-lg bg-white p-2 text-primary-600 shadow-sm'>
                            <FiBookOpen />
                          </span>
                          <h3 className='font-bold text-neutral-900'>
                            {course.title}
                          </h3>
                        </div>
                        <p className='text-sm leading-6 text-neutral-600'>
                          {course.description || 'No description provided.'}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <div className='rounded-xl border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500'>
                  No registered courses.
                </div>
              )}
            </div>
          ) : modalState.type === 'create' ? (
            <AddStudentForm
              classes={allClasses?.data || []}
              onClose={() => {
                updateModalState({ key: 'isOpen', value: false });
                updateModalState({ key: 'modalContent', value: null });
              }}
            />
          ) : modalState.type === 'update' ? (
            <UpdateStudentForm
              classes={allClasses?.data || []}
              initialData={modalState.modalContent}
              onClose={() => {
                updateModalState({ key: 'isOpen', value: false });
                updateModalState({ key: 'modalContent', value: null });
              }}
            />
          ) : modalState.type === 'assign' ? (
            <AssignToClassForm
              classes={allClasses?.data || []}
              initialData={modalState.modalContent}
              studentId={modalState.modalContent?.id}
              onClose={() => {
                updateModalState({ key: 'isOpen', value: false });
                updateModalState({ key: 'modalContent', value: null });
              }}
            />
          ) : modalState.type === 'updateProfile' ? (
            <UpdateAnyProfileAdmin
              initialData={modalState.modalContent || undefined}
              onClose={() => {
                updateModalState({ key: 'isOpen', value: false });
                updateModalState({ key: 'modalContent', value: null });
              }}
            />
          ) : (
            <div className='w-full h-full flex flex-col gap-6'>
              <div className='flex flex-col items-center gap-2 w-full'>
                <span className='text-lg text-error-700 font-medium'>
                  Delete Student
                </span>
                <span className='text-sm font-normal'>
                  This action is irreversible
                </span>
              </div>

              <div className='flex flex-row items-center justify-center w-full'>
                <div className='flex flex-row items-center gap-2 w-full max-w-[50%] mx-auto'>
                  <Button
                    variant='danger'
                    onClick={async () => {
                      if (!modalState.modalContent) return;
                      try {
                        await deleteMutation.mutateAsync({
                          studentId: modalState.modalContent.id,
                        });
                        updateModalState({ key: 'isOpen', value: false });
                        updateModalState({ key: 'modalContent', value: null });
                      } catch {
                        // handled in hook
                      }
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? 'Deleting...' : 'Yes, Delete'}
                  </Button>

                  <Button
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
      </div>

      <Modal
        modalIsOpen={Boolean(previewPicture)}
        setModalIsOpen={(isOpen) => {
          if (!isOpen) setPreviewPicture(null);
        }}
      >
        {previewPicture && (
          <div className='flex flex-col items-center gap-4 p-2'>
            <div className='flex w-full items-center justify-between'>
              <h2 className='text-lg font-semibold text-neutral-900'>
                {previewPicture.name}
              </h2>
              <button
                type='button'
                onClick={() => setPreviewPicture(null)}
                className='rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100'
              >
                Close
              </button>
            </div>
            <img
              src={previewPicture.url}
              alt={`${previewPicture.name} profile picture`}
              className='max-h-[70vh] max-w-full rounded-xl object-contain shadow-sm'
            />
          </div>
        )}
      </Modal>

      {/* ////////////////////////////////// */}

      <div>
        {role === 'admin' ? (
          <AppTable
            isLoading={isStudentsLoading || classesLoading}
            headerColumns={tableHeaders}
            data={students}
            itemKey={({ item }) => `${item.username}`}
            centralizeLabel={false}
            paginationMode='server'
            paginationMeta={{
              currentPage: adminStudentsData?.data?.pagination?.page || 1,
              totalPages: adminStudentsData?.data?.pagination?.pages || 1,
              totalItems: adminStudentsData?.data?.pagination?.total || 0,
              itemsPerPage: adminStudentsData?.data?.pagination?.limit || 10,
            }}
            itemsPerPage={adminStudentsData?.data?.pagination?.limit || 10}
            onPageChange={goToPage}
            renderItem={({ item, itemIndex }) => {
              return (
                <>
                  <TableDataItem>
                    <span className='font-light text-sm text-neutral-600'>
                      {((params?.page ?? 1) - 1) *
                        (adminStudentsData?.data?.pagination?.limit || 10) +
                        itemIndex +
                        1}
                      .
                    </span>
                  </TableDataItem>
                  <TableDataItem>
                    {item.profilePicture ? (
                      <button
                        type='button'
                        onClick={() =>
                          setPreviewPicture({
                            url: item.profilePicture!,
                            name: `${item.firstname} ${item.lastname}`,
                          })
                        }
                        className='mx-auto block rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 cursor-pointer'
                        aria-label={`View ${item.firstname} ${item.lastname}'s profile picture`}
                      >
                        <img
                          src={item.profilePicture}
                          alt={`${item.firstname} ${item.lastname}`}
                          className='h-9 w-9 rounded-full object-cover ring-2 ring-primary-100 transition hover:scale-110'
                        />
                      </button>
                    ) : (
                      <span className='mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700'>
                        {`${item.firstname?.[0] ?? ''}${item.lastname?.[0] ?? ''}`.toUpperCase() || (
                          <FiUserPlus />
                        )}
                      </span>
                    )}
                  </TableDataItem>
                  <TableDataItem>
                    {item.firstname} {item.lastname}
                  </TableDataItem>
                  <TableDataItem>{item.username ?? 'N/A'}</TableDataItem>
                  <TableDataItem>{item.email ?? 'N/A'}</TableDataItem>
                  <TableDataItem>{item.phoneNumber ?? 'N/A'}</TableDataItem>
                  <TableDataItem>
                    {item.class?.className ?? 'Unassigned'}
                  </TableDataItem>

                  <TableDataItem>
                    <div className='flex items-center justify-center'>
                      <label className='relative inline-flex cursor-pointer items-center'>
                        <input
                          type='checkbox'
                          className='peer sr-only disabled:cursor-not-allowed'
                          aria-label={`Toggle ${item.username} active status`}
                          checked={item.isActive}
                          onChange={(event) => {
                            statusMutation.mutate({
                              userId: item.id,
                              isActive: event.target.checked,
                            });
                          }}
                          disabled={statusMutation.isPending}
                        />
                        <div className='relative h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-primary-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-50' />
                        <span className='absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5 peer-disabled:opacity-50' />
                      </label>
                    </div>
                  </TableDataItem>
                  <TableDataItem>
                    {item.createdAt
                      ? formatDate(item.createdAt.toString())
                      : 'N/A'}
                  </TableDataItem>
                </>
              );
            }}
            onActionClick={({ item }) =>
              updateModalState({ key: 'modalContent', value: item })
            }
            actionModalContent={actionModalContent}
          />
        ) : (
          <AppTable
            isLoading={isStudentsLoading || classesLoading}
            headerColumns={tableHeaders}
            data={filteredData}
            itemKey={({ item }) => `${item.username}`}
            centralizeLabel={false}
            paginationMode='server'
            paginationMeta={{
              currentPage: adminStudentsData?.data?.pagination?.page || 1,
              totalPages: adminStudentsData?.data?.pagination?.pages || 1,
              totalItems: adminStudentsData?.data?.pagination?.total || 0,
              itemsPerPage: adminStudentsData?.data?.pagination?.limit || 10,
            }}
            itemsPerPage={adminStudentsData?.data?.pagination?.limit || 10}
            onPageChange={goToPage}
            renderItem={({ item, itemIndex }) => {
              return (
                <>
                  <TableDataItem>
                    <span className='font-light text-sm text-neutral-600'>
                      {((params?.page ?? 1) - 1) *
                        (adminStudentsData?.data?.pagination?.limit || 10) +
                        itemIndex +
                        1}
                      .
                    </span>
                  </TableDataItem>
                  <TableDataItem>
                    {item.firstname && item.lastname
                      ? `${item.firstname} ${item.lastname}`
                      : 'N/A'}
                  </TableDataItem>
                  <TableDataItem>{item.username ?? 'N/A'}</TableDataItem>
                  <TableDataItem>
                    {item.class?.className ?? 'N/A'}
                  </TableDataItem>
                </>
              );
            }}
            onActionClick={({ item }) =>
              updateModalState({ key: 'modalContent', value: item })
            }
            actionModalContent={actionModalContent}
          />
        )}
      </div>
    </section>
  );
}

function AssignToClassForm({
  classes,
  initialData,
  studentId,
  onClose,
}: {
  classes: AllClassesResponse['data'];
  initialData: Student | null;
  studentId?: string | number;
  onClose?: () => void;
}) {
  const assignMutation = useAssignClass();

  type FormValues = { classId: string };

  const {
    register,
    handleSubmit,
    // reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      classId: initialData?.class?.id
        ? initialData.class.id.toString()
        : undefined,
    },
  });

  // Keep default radio selection in sync with currently selected student
  // useEffect(() => {
  //   reset({
  //     classId: initialData?.class?.id
  //       ? initialData.class.id.toString()
  //       : undefined,
  //   });
  // }, [initialData?.class?.id, reset]);

  const onSubmit = async (data: FormValues) => {
    if (!studentId) return;
    try {
      await assignMutation.mutateAsync({
        studentId,
        payload: {
          classId: Number(data.classId),
        },
      });
      if (onClose) onClose();
    } catch {
      // handled in hook
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div>
        <span className='text-sm text-neutral-600'>Select Class</span>
        <div className='flex gap-4 flex-wrap'>
          {classes.map((c) => (
            <label key={c.id} className='flex gap-2 items-center'>
              <input
                type='radio'
                value={`${c.id}`}
                {...register('classId', { required: true })}
              />
              <span>{c.className}</span>
            </label>
          ))}
        </div>
      </div>

      <div className='flex justify-end'>
        <Button
          type='submit'
          disabled={assignMutation.isPending || isSubmitting}
        >
          {assignMutation.isPending || isSubmitting
            ? 'Assigning...'
            : 'Assign to class'}
        </Button>
      </div>
    </form>
  );
}

const createStudentSchema = Yup.object({
  firstname: Yup.string().required('First name is required'),
  lastname: Yup.string().required('Last name is required'),
  username: Yup.string().required('Username is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  classId: Yup.string().required('Class is required'),
});

const passwordUpdateSchema = Yup.object({
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm password is required'),
});

function AddStudentForm({
  classes,
  onClose,
}: {
  classes: AllClassesResponse['data'];
  onClose?: () => void;
}) {
  type FormValues = {
    firstname: string;
    lastname: string;
    username: string;
    password: string;
    classId: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: yupResolver(createStudentSchema) });

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        firstname: data.firstname,
        lastname: data.lastname,
        username: data.username,
        password: data.password,
        role: 'STUDENT' as const,
        classId: Number(data.classId),
      };

      const res = await authService.register(payload);
      toast.success(res.message || 'Student created');
      queryClient.invalidateQueries({ queryKey: ['adminStudents'] });
      if (onClose) onClose();
    } catch (err) {
      toast.error(getErrorDetails(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <Input
        label='First name'
        name='firstname'
        hookFormRegister={register}
        errorText={errors.firstname?.message as string}
      />
      <Input
        label='Last name'
        name='lastname'
        hookFormRegister={register}
        errorText={errors.lastname?.message as string}
      />
      <Input
        label='Username'
        name='username'
        hookFormRegister={register}
        errorText={errors.username?.message as string}
      />
      <Input
        label='Password'
        name='password'
        type='password'
        hookFormRegister={register}
        errorText={errors.password?.message as string}
      />

      <div>
        <span className='text-sm text-neutral-600'>Class</span>
        <div className='flex gap-4 flex-wrap'>
          {classes.map((c) => (
            <label key={c.id} className='flex gap-2 items-center'>
              <input {...register('classId')} type='radio' value={`${c.id}`} />
              <span>{c.className}</span>
            </label>
          ))}
        </div>
        {errors.classId && (
          <div className='text-sm text-error-500'>{errors.classId.message}</div>
        )}
      </div>

      <div className='flex justify-end'>
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Student'}
        </Button>
      </div>
    </form>
  );
}

function UpdateStudentForm({
  initialData,
  onClose,
}: {
  classes: AllClassesResponse['data'];
  initialData: Student | null;
  onClose?: () => void;
}) {
  const [showPasswords, setShowPasswords] = useState(false);
  type FormValues = {
    newPassword: string;
    confirmPassword: string;
  };

  const changePassword = useChangeStudentPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: yupResolver(passwordUpdateSchema) });

  const onSubmit = async (data: FormValues) => {
    if (!initialData) return;
    try {
      await changePassword.mutateAsync({
        studentId: initialData.id,
        payload: {
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        },
      });
      if (onClose) onClose();
    } catch {
      // handled in hook
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <Input
        label='New password'
        name='newPassword'
        type={showPasswords ? 'text' : 'password'}
        hookFormRegister={register}
        errorText={errors.newPassword?.message as string}
      />

      <Input
        label='Confirm password'
        name='confirmPassword'
        type={showPasswords ? 'text' : 'password'}
        hookFormRegister={register}
        errorText={errors.confirmPassword?.message as string}
      />

      <div className='flex justify-end'>
        <button
          type='button'
          onClick={() => setShowPasswords((prev) => !prev)}
          className='text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors cursor-pointer'
          aria-label={showPasswords ? 'Hide passwords' : 'Show passwords'}
        >
          {showPasswords ? 'Hide passwords' : 'Show passwords'}
        </button>
      </div>

      <div className='flex justify-end'>
        <Button
          type='submit'
          disabled={changePassword.isPending || isSubmitting}
        >
          {changePassword.isPending || isSubmitting
            ? 'Updating...'
            : 'Update password'}
        </Button>
      </div>
    </form>
  );
}
