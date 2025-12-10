'use client';

import Modal from '@/components/modal';
import AppTable, { TableDataItem } from '@/components/table';
import { Button } from '@/components/ui';
import Input from '@/components/ui/input';
import {
  useCreateNotification,
  useDeleteNotification,
  useNotification,
  useUpdateNotification,
} from '@/hooks/useNotification';
import { Notification } from '@/types/notification.types';
import { useState, useEffect } from 'react';
import type { AllCourses } from '@/types/dashboard.types';
import { useForm } from 'react-hook-form';
import type { Resolver } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  useGetClasses,
  useGetCourses,
} from '@/features/dashboard/queries/useDashboard';
import { formatDate } from '../../../../../utils/helpers';
import { useServerPagination } from '@/hooks/useServerPagination';

const notificationTypes = [
  'GENERAL',
  'STUDENT',
  'TEACHER',
  'CLASS',
  'COURSE',
] as const;

type NotificationFormValues = {
  title: string;
  message: string;
  type: 'GENERAL' | 'STUDENT' | 'TEACHER' | 'CLASS' | 'COURSE';
  classId?: number;
  courseId?: number;
};

const notificationSchema = yup.object({
  title: yup.string().min(2).max(200).required('Title is required'),
  message: yup.string().min(2).max(1000).required('Message is required'),
  type: yup
    .string()
    .oneOf(['GENERAL', 'STUDENT', 'TEACHER', 'CLASS', 'COURSE'])
    .required('Notification type is required'),
  classId: yup.number().when('type', {
    is: 'CLASS',
    then: (schema) =>
      schema
        .transform((value, originalValue) =>
          originalValue === '' || originalValue == null
            ? undefined
            : Number(originalValue),
        )
        .required('classId is required for CLASS'),
    otherwise: (schema) =>
      schema.transform((value, originalValue) =>
        originalValue === '' || originalValue == null
          ? undefined
          : Number(originalValue),
      ),
  }),
  courseId: yup.number().when('type', {
    is: 'COURSE',
    then: (schema) =>
      schema
        .transform((value, originalValue) =>
          originalValue === '' || originalValue == null
            ? undefined
            : Number(originalValue),
        )
        .required('courseId is required for COURSE'),
    otherwise: (schema) =>
      schema.transform((value, originalValue) =>
        originalValue === '' || originalValue == null
          ? undefined
          : Number(originalValue),
      ),
  }),
});

export default function AdminNotificationPage() {
  const { params, goToPage } = useServerPagination({
    defaultPage: 1,
    defaultLimit: 10,
  });
  const { data: notificationData, isLoading: isNotificationLoading } =
    useNotification(params);
  const { mutate: deleteNotification, isPending: isDeletingNotification } =
    useDeleteNotification();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    modalContent: Notification | null;
    type: 'create' | 'update' | 'delete';
  }>({
    isOpen: false,
    modalContent: null,
    type: 'create',
  });

  //update modal state
  const updateModalState = ({
    key,
    value,
  }: {
    key: keyof typeof modalState;
    value: boolean | Notification | ('create' | 'update' | 'delete') | null;
  }) => {
    setModalState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDeleteNotification = (id: number) => {
    deleteNotification(id);
    updateModalState({ key: 'isOpen', value: false });
    updateModalState({ key: 'modalContent', value: null });
  };

  const notifications = notificationData?.data.data || [];

  const meta = {
    currentPage: notificationData?.data.pagination.page || 1,
    totalPages: notificationData?.data.pagination.pages || 1,
    totalItems: notificationData?.data.pagination.total || 0,
    itemsPerPage: notificationData?.data.pagination.limit || 10,
  };

  return (
    <div className='w-full space-y-4'>
      <div className='flex w-full justify-between'>
        <h1 className='text-2xl font-semibold'>Notifications</h1>
        <div>
          <Button
            onClick={() => {
              updateModalState({ key: 'type', value: 'create' });
              updateModalState({ key: 'isOpen', value: true });
            }}
          >
            + Create Notification
          </Button>
        </div>
      </div>

      <div className='space-y-2'>
        <AppTable<Notification>
          headerColumns={[
            'Title',
            'Recipients',
            'Message',
            'Sent By',
            'Date Sent',
          ]}
          data={notifications}
          isLoading={isNotificationLoading}
          itemKey={({ itemIndex }) => `${itemIndex}`}
          paginationMode='server'
          paginationMeta={meta}
          onPageChange={goToPage}
          renderItem={({ item }) => (
            <>
              <TableDataItem>{item.title}</TableDataItem>
              <TableDataItem>{item.type}</TableDataItem>
              <TableDataItem>{item.message}</TableDataItem>
              <TableDataItem>Admin</TableDataItem>
              <TableDataItem>{formatDate(item.createdAt)}</TableDataItem>
            </>
          )}
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
      </div>

      <Modal
        modalIsOpen={modalState.isOpen}
        setModalIsOpen={(value) =>
          updateModalState({ key: 'isOpen', value: value as boolean })
        }
      >
        {modalState.type === 'create' && <CreateNotificationForm />}
        {modalState.type === 'update' && (
          <UpdateNotificationForm
            initialData={modalState.modalContent}
            onClose={() => updateModalState({ key: 'isOpen', value: false })}
          />
        )}
        {modalState.type === 'delete' && (
          <div className='w-full h-full flex flex-col gap-6'>
            <div className='flex flex-col items-center gap-2 w-full'>
              <span className='text-lg text-error-700 font-medium'>
                Delete Notification
              </span>
              <span className='text-sm font-normal'>
                This action is irreversible
              </span>
            </div>

            <div className='flex flex-row items-center justify-center w-full'>
              <div className='flex flex-row items-center gap-2 w-full max-w-[50%] mx-auto'>
                <Button
                  variant='danger'
                  disabled={isDeletingNotification}
                  onClick={() => {
                    handleDeleteNotification(modalState.modalContent!.id);
                  }}
                >
                  Delete
                </Button>
                <Button
                  disabled={isDeletingNotification}
                  onClick={() =>
                    updateModalState({ key: 'isOpen', value: false })
                  }
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function UpdateNotificationForm({
  initialData,
  onClose,
}: {
  initialData: Notification | null;
  onClose?: () => void;
}) {
  const { mutate: updateNotification, isPending: isUpdatingNotification } =
    useUpdateNotification();

  const { data: classesData, isLoading: isClassesLoading } = useGetClasses();
  const { data: coursesData, isLoading: isCoursesLoading } = useGetCourses();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<NotificationFormValues>({
    resolver: yupResolver(
      notificationSchema,
    ) as unknown as Resolver<NotificationFormValues>,
  });

  const watchedType = watch('type');

  useEffect(() => {
    if (!initialData) return;
    setValue('title', initialData.title);
    setValue('message', initialData.message);
    setValue('type', initialData.type);
    setValue('classId', initialData.classId ?? undefined);
    setValue('courseId', initialData.courseId ?? undefined);
  }, [initialData, setValue]);

  const onSubmit = (data: NotificationFormValues) => {
    updateNotification({ payload: data, id: initialData!.id });
    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <Input
        label='Notification Title'
        name='title'
        id='title'
        placeholder='Enter notification title'
        type='text'
        hookFormRegister={register}
        errorText={errors.title?.message as string | undefined}
      />

      <div className='flex gap-4'>
        <div className='flex flex-col gap-1 w-full'>
          <label htmlFor='notificationType'>
            <span className='text-sm text-neutral-600'> Notification Type</span>

            <select
              id='notificationType'
              {...register('type')}
              className='block w-full rounded-md border border-neutral-300 p-1 h-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-background text-foreground caret-foreground'
            >
              {notificationTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.type?.message && (
              <small className='text-error-500'>
                {String(errors.type?.message)}
              </small>
            )}
          </label>
        </div>

        {watchedType === 'CLASS' && (
          <div className='flex flex-col gap-1 w-full'>
            <label htmlFor='classId'>
              <span className='text-sm text-neutral-600'>Select Class</span>
              <select
                id='classId'
                {...register('classId')}
                className='block w-full rounded-md border border-neutral-300 p-1 h-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-background text-foreground caret-foreground'
              >
                <option value=''>Select a class</option>
                {(classesData?.data ?? []).map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.className}
                  </option>
                ))}
              </select>
              {errors.classId?.message && (
                <small className='text-error-500'>
                  {String(errors.classId?.message)}
                </small>
              )}
            </label>
          </div>
        )}

        {watchedType === 'COURSE' && (
          <div className='flex flex-col gap-1 w-full'>
            <label htmlFor='courseId'>
              <span className='text-sm text-neutral-600'>Select Course</span>
              <select
                id='courseId'
                {...register('courseId')}
                className='block w-full rounded-md border border-neutral-300 p-1 h-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-background text-foreground caret-foreground'
              >
                <option value=''>Select a course</option>
                {(coursesData?.data ?? []).map((c: AllCourses) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.title}
                  </option>
                ))}
              </select>
              {errors.courseId?.message && (
                <small className='text-error-500'>
                  {String(errors.courseId?.message)}
                </small>
              )}
            </label>
          </div>
        )}
      </div>

      <div className='flex gap-4'>
        <textarea
          className='w-full rounded-md border border-neutral-300 p-2 h-32 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-background text-foreground caret-foreground'
          placeholder='Enter notification message'
          {...register('message')}
        ></textarea>
        {errors.message?.message && (
          <small className='text-error-500'>
            {String(errors.message?.message)}
          </small>
        )}
      </div>

      <div className='w-full flex justify-end'>
        <div className='w-fit'>
          <Button
            disabled={
              isUpdatingNotification || isClassesLoading || isCoursesLoading
            }
            type='submit'
          >
            Update Notification
          </Button>
        </div>
      </div>
    </form>
  );
}

function CreateNotificationForm() {
  const {
    mutate: createNotification,
    isPending: isCreatingNotificationPending,
  } = useCreateNotification();
  const { data: classesData, isLoading: isClassesLoading } = useGetClasses();
  const { data: coursesData, isLoading: isCoursesLoading } = useGetCourses();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<NotificationFormValues>({
    resolver: yupResolver(
      notificationSchema,
    ) as unknown as Resolver<NotificationFormValues>,
    defaultValues: { type: 'GENERAL' },
  });

  const watchedType = watch('type');

  const onSubmit = (data: NotificationFormValues) => {
    // ensure numeric fields are numbers (resolver will coerce if configured, but be explicit)
    const payload = {
      ...data,
      classId: data.classId ? Number(data.classId) : undefined,
      courseId: data.courseId ? Number(data.courseId) : undefined,
    };
    createNotification(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <Input
        label='Notification Title'
        name='title'
        id='title'
        placeholder='Enter notification title'
        type='text'
        hookFormRegister={register}
        errorText={errors.title?.message as string | undefined}
      />

      <div className='flex gap-4'>
        <div className='flex flex-col gap-1 w-full'>
          <label htmlFor='notificationType'>
            <span className='text-sm text-neutral-600'> Notification Type</span>

            <select
              id='notificationType'
              {...register('type')}
              className='block w-full rounded-md border border-neutral-300 p-1 h-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-background text-foreground caret-foreground'
            >
              {notificationTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.type?.message && (
              <small className='text-error-500'>
                {String(errors.type?.message)}
              </small>
            )}
          </label>
        </div>

        {watchedType === 'CLASS' && (
          <div className='flex flex-col gap-1 w-full'>
            <label htmlFor='classId'>
              <span className='text-sm text-neutral-600'>Select Class</span>
              <select
                id='classId'
                {...register('classId')}
                className='block w-full rounded-md border border-neutral-300 p-1 h-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-background text-foreground caret-foreground'
              >
                <option value=''>Select a class</option>
                {(classesData?.data ?? []).map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.className}
                  </option>
                ))}
              </select>
              {errors.classId?.message && (
                <small className='text-error-500'>
                  {String(errors.classId?.message)}
                </small>
              )}
            </label>
          </div>
        )}

        {watchedType === 'COURSE' && (
          <div className='flex flex-col gap-1 w-full'>
            <label htmlFor='courseId'>
              <span className='text-sm text-neutral-600'>Select Course</span>
              <select
                id='courseId'
                {...register('courseId')}
                className='block w-full rounded-md border border-neutral-300 p-1 h-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-background text-foreground caret-foreground'
              >
                <option value=''>Select a course</option>
                {(coursesData?.data ?? []).map((c: AllCourses) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.title}
                  </option>
                ))}
              </select>
              {errors.courseId?.message && (
                <small className='text-error-500'>
                  {String(errors.courseId?.message)}
                </small>
              )}
            </label>
          </div>
        )}
      </div>

      <div className='flex gap-4'>
        <textarea
          className='w-full rounded-md border border-neutral-300 p-2 h-32 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-background text-foreground caret-foreground'
          placeholder='Enter notification message'
          {...register('message')}
        ></textarea>
        {errors.message?.message && (
          <small className='text-error-500'>
            {String(errors.message?.message)}
          </small>
        )}
      </div>

      <div className='w-full flex justify-end'>
        <div className='w-fit'>
          <Button
            type='submit'
            disabled={
              isClassesLoading ||
              isCoursesLoading ||
              isCreatingNotificationPending
            }
          >
            Create Notification
          </Button>
        </div>
      </div>
    </form>
  );
}
