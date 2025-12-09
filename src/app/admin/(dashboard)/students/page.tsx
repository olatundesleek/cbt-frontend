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
import { errorLogger } from '@/lib/axios';
import { useAdminStudents } from '@/features/students/hooks/useStudents';
import useChangeStudentPassword from '@/features/students/hooks/useChangeStudentPassword';
import useDeleteStudent from '@/features/students/hooks/useDeleteStudent';
import FilterBar, { FilterState } from '@/components/tests/FilterBar';
import { formatDate } from '../../../../../utils/helpers';
import StudentSummary from '@/components/tests/StudentSummary';
import { useMemo, useState } from 'react';
import type { Student } from '@/types/students.types';
import useAssignClass from '@/features/students/hooks/useAssignClass';
import { useGetClasses } from '@/features/dashboard/queries/useDashboard';
import { AllClassesResponse } from '@/types/dashboard.types';
import { useUserStore } from '@/store/useUserStore';

export default function AdminStudentsPage() {
  const role = useUserStore((s) => s.role);
  const { data: adminStudentsData, isLoading: isStudentsLoading } =
    useAdminStudents();

  const { data: allClasses, isLoading: classesLoading } = useGetClasses();

  const [filter, setFilter] = useState<FilterState>({ query: '' });

  const students = useMemo<Student[]>(
    () => adminStudentsData?.data.data ?? [],
    [adminStudentsData],
  );

  const classes = useMemo(() => {
    const arr = allClasses?.data?.flatMap((c) => c.className);
    return Array.from(new Set(arr)).filter((v): v is string => !!v);
  }, [allClasses]);

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

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    modalContent: Student | null;
    type: 'create' | 'update' | 'delete' | 'assign';
  }>({ isOpen: false, modalContent: null, type: 'create' });

  const deleteMutation = useDeleteStudent();

  // update modal state helper
  const updateModalState = ({
    key,
    value,
  }: {
    key: keyof typeof modalState;
    value:
      | boolean
      | Student
      | ('create' | 'update' | 'delete' | 'assign')
      | null;
  }) => {
    setModalState((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <section className='flex flex-col lg:flex-row gap-6 w-full'>
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
          courses={courses}
          classes={classes}
          onChange={(s) => setFilter(s)}
        />

        <div>
          {role === 'admin' ? (
            <AppTable
              isLoading={isStudentsLoading || classesLoading}
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
                    <TableDataItem>
                      {item.class?.className ?? '--'}
                    </TableDataItem>
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
              onActionClick={({ item }) =>
                updateModalState({ key: 'modalContent', value: item })
              }
              actionModalContent={
                <div className='flex flex-col gap-2 w-full'>
                  <button
                    onClick={() => {
                      updateModalState({ key: 'type', value: 'assign' });
                      updateModalState({ key: 'isOpen', value: true });
                    }}
                    className='px-2 py-1 rounded bg-emerald-600 text-white text-xs cursor-pointer'
                  >
                    Assign
                  </button>
                  <button
                    onClick={() => {
                      updateModalState({ key: 'type', value: 'update' });
                      updateModalState({ key: 'isOpen', value: true });
                    }}
                    className='px-2 py-1 rounded bg-primary-500 text-white text-xs cursor-pointer'
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      updateModalState({ key: 'type', value: 'delete' });
                      updateModalState({ key: 'isOpen', value: true });
                    }}
                    className='px-2 py-1 rounded bg-error-500 text-white text-xs cursor-pointer'
                  >
                    Delete
                  </button>
                </div>
              }
            />
          ) : (
            <AppTable
              isLoading={isStudentsLoading || classesLoading}
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
                    <TableDataItem>
                      {item.class?.className ?? '--'}
                    </TableDataItem>
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
          )}
        </div>
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
        {modalState.type === 'create' ? (
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
    </section>
  );
}

function AssignToClassForm({
  classes,
  initialData,
  onClose,
}: {
  classes: AllClassesResponse['data'];
  initialData: Student | null;
  onClose?: () => void;
}) {
  const assignMutation = useAssignClass();

  type FormValues = { classId: string };

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      classId: initialData?.class.id.toString() || undefined,
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!initialData) return;
    try {
      await assignMutation.mutateAsync({
        studentId: initialData.id,
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
      errorLogger(err);
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
        type='password'
        hookFormRegister={register}
        errorText={errors.newPassword?.message as string}
      />

      <Input
        label='Confirm password'
        name='confirmPassword'
        type='password'
        hookFormRegister={register}
        errorText={errors.confirmPassword?.message as string}
      />

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
