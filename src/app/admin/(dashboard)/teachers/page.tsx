"use client";

import AppTable, { TableDataItem } from "@/components/table";
import { useState } from "react";
import Input from "@/components/ui/input";
import Button from "@/components/ui/Button";
import Modal from '@/components/modal';
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { authService } from "@/services/authService";
import { UserRole } from "@/types/auth.types";
import toast from "react-hot-toast";
import { errorLogger } from "@/lib/axios";
import { queryClient } from "@/providers/query-provider";
import { useGetTeachers } from "@/features/dashboard/queries/useDashboard";
import { useServerPagination } from '@/hooks/useServerPagination';
import useChangeTeacherPassword from '@/features/teachers/hooks/useChangeTeacherPassword';
import useDeleteTeacher from '@/features/teachers/hooks/useDeleteTeacher';
import type { AllTeachers } from '@/types/dashboard.types';
import { formatDate } from '../../../../../utils/helpers';

const schema = Yup.object({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  userName: Yup.string().required('Username is required'),
  password: Yup.string()
    .min(6, 'Password must be minimum of 6 characters')
    .required('Password is required'),
});

type FormProps = Yup.InferType<typeof schema>;

const passwordUpdateSchema = Yup.object({
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function AdminTeachersPage() {
  // Add server pagination hook
  const { params, goToPage, updateParams, setLimit } = useServerPagination({
    defaultPage: 1,
    defaultLimit: 10,
  });

  const [togglePassword, setTogglePassword] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    modalContent: AllTeachers | null;
    type: 'create' | 'update' | 'delete';
  }>({ isOpen: false, modalContent: null, type: 'create' });

  const deleteMutation = useDeleteTeacher();

  // update modal state helper
  const updateModalState = ({
    key,
    value,
  }: {
    key: keyof typeof modalState;
    value: boolean | AllTeachers | ('create' | 'update' | 'delete') | null;
  }) => {
    setModalState((prev) => ({ ...prev, [key]: value }));
  };

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset: resetForm,
  } = useForm<FormProps>({
    defaultValues: { firstName: '', lastName: '', userName: '', password: '' },
    resolver: yupResolver(schema),
  });

  const {
    data: allTeachers,
    isLoading: teachersLoading,
    error: teachersError,
  } = useGetTeachers(params);

  // Client-side search filtering
  const filteredTeachers =
    allTeachers?.data.data?.filter((teacher) =>
      searchValue
        ? `${teacher.firstname} ${teacher.lastname}`
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        : true,
    ) ?? [];

  const handleRegisterTeacher: SubmitHandler<FormProps> = async (data) => {
    const payload = {
      firstname: data.firstName,
      lastname: data.lastName,
      username: data.userName,
      password: data.password,
      role: 'TEACHER' as UserRole,
    };

    try {
      const res = await authService.register(payload);
      toast.success(res.message || 'Success');
      queryClient.invalidateQueries({ queryKey: ['teachers'] }); // invalidate and refetch teachers
      resetForm();
    } catch (error) {
      errorLogger(error);
    }
  };

  if (teachersError) {
    errorLogger(teachersError);
  }

  return (
    <section className='flex flex-col gap-4 w-full'>
      <h1 className='text-2xl font-semibold'>Manage Teachers</h1>

      <div className='grid grid-cols-1 lg:grid-cols-3 w-full gap-4'>
        <div className='col-span-1 flex flex-col gap-1 bg-background rounded-xl w-full p-3 h-fit'>
          <span className='font-medium'>Create Teacher</span>

          <form
            onSubmit={handleSubmit(handleRegisterTeacher)}
            className='flex flex-col gap-3 w-full'
          >
            <Input
              label='First Name'
              name='firstName'
              placeholder='First Name'
              hookFormRegister={register}
              errorText={errors.firstName && errors.firstName.message}
            />

            <Input
              label='Last Name'
              name='lastName'
              placeholder='Last Name'
              hookFormRegister={register}
              errorText={errors.lastName && errors.lastName.message}
            />

            <Input
              label='User Name'
              name='userName'
              placeholder='User Name'
              hookFormRegister={register}
              errorText={errors.userName && errors.userName.message}
            />

            <div className='flex flex-row items-center gap-2 w-full'>
              <Input
                type={togglePassword ? 'text' : 'password'}
                label='Password'
                name='password'
                placeholder='Password'
                className='flex-1'
                hookFormRegister={register}
                errorText={errors.password && errors.password.message}
              />

              <div className='w-fit self-end'>
                <Button onClick={() => setTogglePassword((prev) => !prev)}>
                  {togglePassword ? <FaEye /> : <FaEyeSlash />}
                </Button>
              </div>
            </div>

            <div className='w-fit'>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Teacher'}
              </Button>
            </div>
          </form>
        </div>

        <div className='col-span-2 flex flex-col gap-3 bg-background rounded-xl w-full p-3'>
          <span className='font-medium'>All Teachers</span>

          {/* Search and Filter Section */}
          <div className='flex items-center gap-3 w-full flex-wrap'>
            <Input
              name='search'
              placeholder='Search teachers by name...'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <select
              value={params.sort || ''}
              onChange={(e) =>
                updateParams({ sort: e.target.value || undefined })
              }
              className='rounded-md border border-neutral-300 px-3 py-2 bg-background text-foreground'
              aria-label='Sort by field'
            >
              <option value=''>Sort By</option>
              <option value='firstname'>First Name</option>
              <option value='lastname'>Last Name</option>
              <option value='createdAt'>Date Created</option>
            </select>
            <select
              value={params.order || 'asc'}
              onChange={(e) =>
                updateParams({ order: e.target.value as 'asc' | 'desc' })
              }
              className='rounded-md border border-neutral-300 px-3 py-2 bg-background text-foreground'
              aria-label='Sort order'
            >
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
          </div>

          <AppTable
            data={filteredTeachers}
            centralizeLabel
            isLoading={teachersLoading}
            label='All Teachers'
            headerColumns={[
              'S/N',
              `Name`,
              'Username/ID',
              'Email',
              'Phone',
              'Class(es)',
              'Course(s)',
              'Created on',
            ]}
            itemKey={({ item }) => `${item.id}`}
            paginationMode='server'
            paginationMeta={{
              currentPage: allTeachers?.data.pagination?.page || 1,
              totalPages: allTeachers?.data.pagination?.pages || 1,
              totalItems: allTeachers?.data.pagination?.total || 0,
              itemsPerPage: allTeachers?.data.pagination?.limit || 10,
            }}
            onPageChange={goToPage}
            renderItem={({ item, itemIndex }) => (
              <>
                <TableDataItem>
                  <span className='font-light text-sm text-neutral-600'>
                    {((params?.page ?? 1) - 1) *
                      (allTeachers?.data?.pagination?.limit || 10) +
                      itemIndex +
                      1}
                    .
                  </span>
                </TableDataItem>
                <TableDataItem>
                  {item.firstname + ' ' + item.lastname || 'N/A'}
                </TableDataItem>
                <TableDataItem>{item.username}</TableDataItem>
                <TableDataItem>
                  <span>{item.email || 'N/A'}</span>
                </TableDataItem>
                <TableDataItem>{item.phoneNumber || 'N/A'}</TableDataItem>
                <TableDataItem>
                  {item.teacherOf.length > 0
                    ? item.teacherOf.map((c) => c.className).join(', ')
                    : '--'}
                </TableDataItem>
                <TableDataItem>
                  {item.courses?.length > 0
                    ? item.courses.map((c) => c.title).join(', ')
                    : '--'}
                </TableDataItem>
                <TableDataItem>
                  {formatDate(item.createdAt.toString()) || 'N/A'}
                </TableDataItem>
              </>
            )}
            onActionClick={({ item }) =>
              updateModalState({ key: 'modalContent', value: item })
            }
            actionModalContent={
              <div className='flex flex-col gap-2 w-full'>
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
                  Delete Teacher
                </button>
              </div>
            }
          />
        </div>
      </div>

      <Modal
        modalIsOpen={modalState.isOpen}
        setModalIsOpen={(v) =>
          updateModalState({ key: 'isOpen', value: v as boolean })
        }
      >
        {modalState.type === 'update' ? (
          <UpdateTeacherForm
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
                Delete Teacher
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
                        teacherId: modalState.modalContent.id,
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

function UpdateTeacherForm({
  initialData,
  onClose,
}: {
  initialData: AllTeachers | null;
  onClose?: () => void;
}) {
  type FormValues = {
    newPassword: string;
    confirmPassword: string;
  };

  const changePassword = useChangeTeacherPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: yupResolver(passwordUpdateSchema) });

  const onSubmit = async (data: FormValues) => {
    if (!initialData) return;
    try {
      await changePassword.mutateAsync({
        teacherId: initialData.id,
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
